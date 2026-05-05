import { validateElementDraft, validateDocumentOutline, generateNumberingPreview } from "./documentStructure.js";

export const documentCommands = [
  "create-element",
  "update-element",
  "move-element",
  "delete-element",
  "accept-ai-proposal",
  "reject-ai-proposal",
  "create-comment",
  "resolve-comment"
];

const canonicalWriteCommands = new Set([
  "create-element",
  "update-element",
  "move-element",
  "delete-element",
  "accept-ai-proposal"
]);

export function validateDocumentCommand(input = {}) {
  const errors = [];
  const warnings = [];
  const command = input.command;
  const canonicalWrite = canonicalWriteCommands.has(command);

  if (!documentCommands.includes(command)) {
    errors.push({ field: "command", code: "INVALID_DOCUMENT_COMMAND", message: "Document command is not registered." });
  }

  if (!input.projectId) {
    errors.push({ field: "projectId", code: "PROJECT_REQUIRED", message: "Project ID is required." });
  }

  if (canonicalWrite && input.hasActiveLock !== true) {
    errors.push({
      field: "hasActiveLock",
      code: "ACTIVE_LOCK_REQUIRED",
      message: "Canonical document commands require an active edit ownership lock."
    });
  }

  if (canonicalWrite && !input.userId) {
    errors.push({ field: "userId", code: "USER_REQUIRED", message: "Canonical document commands require a user." });
  }

  if (canonicalWrite && !input.baseVersionId) {
    warnings.push({
      field: "baseVersionId",
      code: "BASE_VERSION_RECOMMENDED",
      message: "Canonical document commands should bind to the source version the editor saw."
    });
  }

  if (command === "update-element" || command === "create-element") {
    const elementValidation = validateElementDraft(input.element || {});
    errors.push(...elementValidation.errors.map((error) => ({ ...error, field: "element" })));
    warnings.push(...elementValidation.warnings.map((warning) => ({ ...warning, field: "element" })));
  }

  if (command === "move-element" && input.newParentId === input.elementId) {
    errors.push({
      field: "newParentId",
      code: "ELEMENT_CANNOT_PARENT_ITSELF",
      message: "An element cannot be moved under itself."
    });
  }

  if (command === "delete-element" && input.confirmedDestructive !== true) {
    warnings.push({
      field: "confirmedDestructive",
      code: "DESTRUCTIVE_COMMAND_CONFIRMATION_RECOMMENDED",
      message: "Delete commands should require explicit confirmation and recoverable history."
    });
  }

  if (command === "accept-ai-proposal" && input.aiProposalReviewed !== true) {
    errors.push({
      field: "aiProposalReviewed",
      code: "AI_PROPOSAL_REVIEW_REQUIRED",
      message: "AI proposal must be reviewed before it can become canonical text."
    });
  }

  return {
    ok: errors.length === 0,
    command,
    canonicalWrite,
    requiresLock: canonicalWrite,
    requiresSnapshot: canonicalWrite,
    requiresAudit: canonicalWrite || command === "resolve-comment",
    executionAllowed: false,
    errors,
    warnings,
    persistence: "disabled-until-db-enabled"
  };
}

export function buildDocumentCommandPlan(input = {}) {
  const validation = validateDocumentCommand(input);
  return {
    validation,
    plan: {
      command: validation.command,
      sequence: buildCommandSequence(validation),
      repository: "documents",
      transactionRequired: validation.canonicalWrite,
      canonicalWriteAllowedNow: false,
      blockedReason: "Document command execution waits for DB, active locks, snapshots and audit persistence."
    },
    persistence: "disabled-until-db-enabled"
  };
}

export function buildBulkDocumentCommandPlan(input = {}) {
  const commands = Array.isArray(input.commands) ? input.commands : [];
  const plans = commands.map((command, index) => ({
    index,
    ...buildDocumentCommandPlan({ ...command, projectId: command.projectId || input.projectId, userId: command.userId || input.userId })
  }));
  const hasCanonicalWrite = plans.some((item) => item.validation.canonicalWrite);
  const errors = plans.flatMap((item) => item.validation.errors.map((error) => ({ ...error, index: item.index })));

  return {
    ok: errors.length === 0,
    commandCount: plans.length,
    hasCanonicalWrite,
    transactionRequired: hasCanonicalWrite,
    plans,
    errors,
    persistence: "disabled-until-db-enabled"
  };
}

export function buildDocumentImpactPreview(input = {}) {
  const before = Array.isArray(input.before) ? input.before : [];
  const after = Array.isArray(input.after) ? input.after : [];
  const beforeValidation = validateDocumentOutline(before);
  const afterValidation = validateDocumentOutline(after);
  const beforeNumbering = generateNumberingPreview(before);
  const afterNumbering = generateNumberingPreview(after);

  return {
    before: {
      validation: beforeValidation,
      numbering: beforeNumbering
    },
    after: {
      validation: afterValidation,
      numbering: afterNumbering
    },
    changedNumbering: afterNumbering.filter((item) => {
      const previous = beforeNumbering.find((candidate) => candidate.stableKey === item.stableKey);
      return previous && previous.numbering !== item.numbering;
    }),
    warnings: [
      ...afterValidation.warnings,
      ...stageImpactWarnings(input.stage || "PWI", input.touchedAreas || [])
    ],
    persistence: "disabled-until-db-enabled"
  };
}

function buildCommandSequence(validation) {
  const sequence = ["validate-command"];
  if (validation.requiresLock) sequence.push("verify-active-edit-lock");
  if (validation.requiresSnapshot) sequence.push("create-read-only-snapshot");
  if (validation.canonicalWrite) sequence.push("apply-structured-document-change");
  if (validation.requiresAudit) sequence.push("append-audit-event");
  sequence.push("return-impact-preview");
  return sequence;
}

function stageImpactWarnings(stage, touchedAreas) {
  const formalStages = ["CD", "DIS", "FDIS", "PUBLICATION"];
  if (!formalStages.includes(stage)) return [];
  const sensitive = touchedAreas.filter((area) => ["title", "scope", "terms", "references", "figures"].includes(area));
  return sensitive.map((area) => ({
    code: "FORMAL_STAGE_CHANGE_RISK",
    area,
    message: `${area} changes at ${stage} can affect committee confidence, references, export readiness or prior decisions.`
  }));
}
