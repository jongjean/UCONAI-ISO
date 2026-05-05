import { buildAuthoringGuidance } from "./authoringGuidance.js";
import { buildDocumentCommandPlan, buildDocumentImpactPreview } from "./documentCommandPolicy.js";
import { createStarterDocument, validateDocumentOutline } from "./documentStructure.js";
import { describeCollaborationPolicy, validateStaleEdit } from "./editLockPolicy.js";
import { buildSnapshotPreview, buildVersionDateBrowser } from "./versionPolicy.js";

export function buildDocumentWorkspaceState(input = {}) {
  const elements = Array.isArray(input.elements) && input.elements.length > 0
    ? input.elements
    : createStarterDocument();
  const activeElement = input.activeElement || elements[0] || {};
  const lock = input.lock || {};
  const user = input.user || {};
  const command = input.command || {
    command: "update-element",
    projectId: input.projectId,
    userId: user.id,
    hasActiveLock: lock.userId && user.id ? lock.userId === user.id : false,
    baseVersionId: input.baseVersionId,
    element: activeElement
  };
  const snapshots = Array.isArray(input.snapshots) ? input.snapshots : [];

  return {
    projectId: input.projectId || null,
    stage: input.stage || "PWI",
    editor: buildEditorState({ user, lock }),
    outline: validateDocumentOutline(elements),
    commandPlan: buildDocumentCommandPlan(command),
    impactPreview: buildDocumentImpactPreview({
      before: input.beforeElements || elements,
      after: input.afterElements || elements,
      stage: input.stage,
      touchedAreas: input.touchedAreas || []
    }),
    guidance: buildAuthoringGuidance({
      element: activeElement,
      stage: input.stage,
      dialogueLanguage: input.dialogueLanguage,
      opposingConcerns: input.opposingConcerns
    }),
    snapshotPreview: buildSnapshotPreview(activeElement, user),
    versionBrowser: buildVersionDateBrowser({ snapshots }),
    collaboration: describeCollaborationPolicy(),
    persistence: "disabled-until-db-enabled"
  };
}

export function validateWorkspaceSubmitReadiness(input = {}) {
  const user = input.user || {};
  const lock = input.lock || {};
  const stale = validateStaleEdit({
    lockId: lock.id,
    userId: user.id,
    lockOwnerId: lock.userId,
    clientVersion: input.clientVersion,
    latestVersion: input.latestVersion
  });
  const commandPlan = buildDocumentCommandPlan(input.command || {});
  const errors = [...stale.errors, ...commandPlan.validation.errors];
  const warnings = [...stale.warnings, ...commandPlan.validation.warnings];

  return {
    ok: errors.length === 0,
    canonicalWriteAllowed: false,
    submitAllowedNow: false,
    blockers: errors,
    warnings,
    requiredBeforeSubmit: [
      "active single-editor lock",
      "fresh client version",
      "read-only snapshot",
      "audit event",
      "repository implementation"
    ],
    persistence: "disabled-until-db-enabled"
  };
}

function buildEditorState({ user, lock }) {
  const activeEditor = Boolean(user.id && lock.userId && user.id === lock.userId);
  return {
    userId: user.id || null,
    lockId: lock.id || null,
    lockOwnerId: lock.userId || null,
    activeEditor,
    canEditCanonicalText: activeEditor,
    canComment: true,
    canPropose: true,
    nonEditorMode: activeEditor ? "editor" : "comment-and-proposal"
  };
}
