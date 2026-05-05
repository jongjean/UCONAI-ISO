const documentTypes = ["ISO", "IEC", "REGULATION", "PAPER", "INTERNAL_NOTE", "MEETING_MATERIAL", "OTHER"];
const aiUseModes = ["EXCLUDE", "SUMMARIZE", "COMPARE", "QUOTE_LIMITED", "PENDING"];
const formalStages = ["DIS", "FDIS", "PUBLICATION"];

export function validateReferenceDraft(input = {}) {
  const errors = [];
  const warnings = [];

  if (!input.title || String(input.title).trim().length < 3) {
    errors.push({ field: "title", code: "TITLE_REQUIRED", message: "Reference title is required." });
  }

  if (input.documentType && !documentTypes.includes(input.documentType)) {
    errors.push({ field: "documentType", code: "INVALID_DOCUMENT_TYPE", message: "Unsupported reference document type." });
  }

  if (input.aiUseMode && !aiUseModes.includes(input.aiUseMode)) {
    errors.push({ field: "aiUseMode", code: "INVALID_AI_USE_MODE", message: "Unsupported AI use mode." });
  }

  if (input.normative === true && input.aiUseMode === "PENDING") {
    warnings.push({ code: "NORMATIVE_PENDING_AI_MODE", message: "Normative reference candidates should have reviewed AI use permissions." });
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    normalized: {
      title: input.title ? String(input.title).trim() : "",
      documentType: input.documentType || "OTHER",
      aiUseMode: input.aiUseMode || "PENDING",
      normative: input.normative === true,
      bibliographyCandidate: input.bibliographyCandidate === true
    }
  };
}

export function describeBibliographyPolicy() {
  return {
    earlyStages: "Use deferred bibliography link candidates to avoid drafting friction.",
    disAndLater: "Require formal bibliography/endnote readiness checks.",
    finalExport: "Export bibliography/linking report with source version binding."
  };
}

export function buildReferenceReadinessReport(input = {}) {
  const stage = input.stage || "PWI";
  const references = Array.isArray(input.references) ? input.references : [];
  const results = references.map((reference, index) => ({
    index,
    validation: validateReferenceDraft(reference),
    linkStatus: reference.linkedElementStableKey ? "linked" : "unlinked",
    requiredBeforeFinal: reference.normative === true || reference.bibliographyCandidate === true
  }));

  const unresolved = results.filter((item) => !item.validation.ok || item.linkStatus === "unlinked");
  const pendingAiUse = results.filter((item) => item.validation.normalized.aiUseMode === "PENDING");
  const normativeUnlinked = results.filter((item) => item.validation.normalized.normative && item.linkStatus === "unlinked");

  return {
    stage,
    strictMode: formalStages.includes(stage),
    counts: {
      total: references.length,
      unresolved: unresolved.length,
      pendingAiUse: pendingAiUse.length,
      normativeUnlinked: normativeUnlinked.length
    },
    blockers: formalStages.includes(stage)
      ? [
          ...normativeUnlinked.map((item) => ({
            code: "NORMATIVE_REFERENCE_UNLINKED",
            message: "Normative reference candidate must be linked to Clause 2 or resolved.",
            index: item.index
          })),
          ...pendingAiUse.map((item) => ({
            code: "AI_USE_PERMISSION_PENDING",
            message: "AI use permission must be decided before formal-stage use.",
            index: item.index
          }))
        ]
      : [],
    results,
    persistence: "disabled-until-db-enabled"
  };
}

export function buildBibliographyLinkPreview(input = {}) {
  const candidates = Array.isArray(input.candidates) ? input.candidates : [];
  return {
    stage: input.stage || "PWI",
    links: candidates.map((candidate, index) => ({
      index,
      referenceTitle: candidate.title || `Reference ${index + 1}`,
      elementStableKey: candidate.elementStableKey || null,
      suggestedNote: candidate.elementStableKey
        ? `Attach bibliography candidate to element ${candidate.elementStableKey}.`
        : "Keep as deferred bibliography candidate until a target clause is selected.",
      formalizeAt: formalStages.includes(input.stage) ? "now" : "DIS-or-later"
    })),
    persistence: "disabled-until-db-enabled"
  };
}

export function buildEndnoteBindingPlan(input = {}) {
  const stage = input.stage || "PWI";
  const candidates = Array.isArray(input.candidates) ? input.candidates : [];
  const strictMode = formalStages.includes(stage);
  const rows = candidates.map((candidate, index) => {
    const hasElement = Boolean(candidate.elementStableKey);
    const hasReference = Boolean(candidate.referenceId || candidate.title);
    const hasNoteText = Boolean(candidate.noteText || candidate.memo);
    const missing = [];

    if (!hasReference) missing.push("reference");
    if (strictMode && !hasElement) missing.push("elementStableKey");
    if (strictMode && !hasNoteText) missing.push("noteText");

    return {
      index,
      referenceId: candidate.referenceId || null,
      referenceTitle: candidate.title || `Reference ${index + 1}`,
      elementStableKey: candidate.elementStableKey || null,
      noteText: candidate.noteText || candidate.memo || null,
      osdEndnoteTarget: hasElement ? `endnote:${candidate.elementStableKey}:${index + 1}` : null,
      draftingMode: strictMode ? "formal-binding" : "deferred-link-record",
      ready: missing.length === 0,
      missing,
      blocking: strictMode && missing.length > 0
    };
  });

  return {
    stage,
    strictMode,
    rows,
    ready: rows.every((row) => !row.blocking),
    blockers: rows
      .filter((row) => row.blocking)
      .map((row) => ({
        code: "ENDNOTE_BINDING_INCOMPLETE",
        referenceTitle: row.referenceTitle,
        missing: row.missing
      })),
    policy: {
      earlyDrafting: "Record link intent without forcing final endnote placement.",
      disAndLater: "Require reference, target element, and note text before formal package readiness.",
      osdCompatibility: "Each formal bibliography entry should carry a stable element target for OSD entry."
    },
    persistence: "binding-plan-only-until-db-enabled"
  };
}

export function buildReferenceGovernanceMatrix(input = {}) {
  const stage = input.stage || "PWI";
  const references = Array.isArray(input.references) ? input.references : [];
  const rows = references.map((reference, index) => {
    const validation = validateReferenceDraft(reference);
    const linked = Boolean(reference.linkedElementStableKey);
    const intendedUse = classifyReferenceUse(reference);
    return {
      index,
      title: validation.normalized.title || `Reference ${index + 1}`,
      documentType: validation.normalized.documentType,
      aiUseMode: validation.normalized.aiUseMode,
      intendedUse,
      linkedElementStableKey: reference.linkedElementStableKey || null,
      normativeReady: validation.normalized.normative === true && linked && validation.normalized.aiUseMode !== "PENDING",
      bibliographyReady: validation.normalized.bibliographyCandidate === true && (linked || !formalStages.includes(stage)),
      action: referenceActionFor({ stage, validation, linked, intendedUse })
    };
  });

  return {
    stage,
    strictMode: formalStages.includes(stage),
    rows,
    unresolved: rows.filter((row) => row.action.status !== "ready"),
    policy: {
      earlyDrafting: "Keep lightweight link candidates before DIS to reduce drafting friction.",
      formalStage: "DIS and later require reference intent, AI-use mode, and target linkage review.",
      sourceSeparation: "Normative references and bibliography candidates must be tracked separately."
    },
    persistence: "disabled-until-db-enabled"
  };
}

export function buildSourceUseDecisionReport(input = {}) {
  const stage = input.stage || "PWI";
  const references = Array.isArray(input.references) ? input.references : [];
  const targetElements = Array.isArray(input.targetElements) ? input.targetElements : [];

  const rows = references.map((reference, index) => {
    const validation = validateReferenceDraft(reference);
    const mode = validation.normalized.aiUseMode;
    const target = pickTargetElement(reference, targetElements);
    const decision = sourceUseDecisionFor({ stage, reference, validation, target });

    return {
      index,
      title: validation.normalized.title || `Reference ${index + 1}`,
      documentType: validation.normalized.documentType,
      aiUseMode: mode,
      targetElementStableKey: target?.stableKey || reference.linkedElementStableKey || null,
      targetSection: target?.section || reference.targetSection || null,
      decision: decision.mode,
      rationale: decision.rationale,
      allowedActions: decision.allowedActions,
      blockedActions: decision.blockedActions,
      requiredTrace: decision.requiredTrace,
      status: decision.status
    };
  });

  return {
    stage,
    rows,
    counts: {
      total: rows.length,
      excluded: rows.filter((row) => row.decision === "exclude").length,
      compare: rows.filter((row) => row.decision === "compare").length,
      summarize: rows.filter((row) => row.decision === "summarize").length,
      limitedQuote: rows.filter((row) => row.decision === "limited-quote").length,
      pending: rows.filter((row) => row.status !== "ready").length
    },
    policy: {
      sourceTextIsNotCanonicalDraft: true,
      exactCitationRequiresTrace: true,
      formalStageRequiresElementTarget: formalStages.includes(stage),
      aiOutputMustKeepReferenceBoundary: true
    },
    persistence: "source-use-decision-only-until-db-enabled"
  };
}

function classifyReferenceUse(reference = {}) {
  if (reference.normative === true) return "normative-reference";
  if (reference.bibliographyCandidate === true) return "bibliography-candidate";
  if (reference.aiUseMode === "EXCLUDE") return "registered-excluded-source";
  return "background-reference";
}

function referenceActionFor({ stage, validation, linked, intendedUse }) {
  if (!validation.ok) {
    return { status: "blocked", code: "REFERENCE_INVALID", message: "Fix required reference metadata." };
  }
  if (formalStages.includes(stage) && validation.normalized.aiUseMode === "PENDING") {
    return { status: "blocked", code: "AI_USE_MODE_REQUIRED", message: "Decide whether AI may summarize, compare, quote in limited form, or exclude this source." };
  }
  if (formalStages.includes(stage) && intendedUse === "normative-reference" && !linked) {
    return { status: "blocked", code: "CLAUSE_2_LINK_REQUIRED", message: "Normative reference must be linked or removed before formal package readiness." };
  }
  if (formalStages.includes(stage) && intendedUse === "bibliography-candidate" && !linked) {
    return { status: "warning", code: "BIBLIOGRAPHY_LINK_RECOMMENDED", message: "Bibliography candidate should be linked to its supporting clause or memo." };
  }
  return { status: "ready", code: "REFERENCE_READY", message: "Reference governance metadata is sufficient for this stage." };
}

function pickTargetElement(reference = {}, targetElements = []) {
  return targetElements.find((element) => element.stableKey && element.stableKey === reference.linkedElementStableKey) || null;
}

function sourceUseDecisionFor({ stage, reference, validation, target }) {
  if (!validation.ok) {
    return {
      mode: "exclude",
      status: "blocked",
      rationale: "Reference metadata is incomplete, so it cannot guide AI drafting.",
      allowedActions: ["register-metadata-gap"],
      blockedActions: ["summarize", "compare", "quote", "draft-from-source"],
      requiredTrace: []
    };
  }

  if (validation.normalized.aiUseMode === "EXCLUDE") {
    return {
      mode: "exclude",
      status: "ready",
      rationale: "Source is registered for awareness but intentionally excluded from AI synthesis.",
      allowedActions: ["show-title-only", "record-exclusion-reason"],
      blockedActions: ["summarize", "compare", "quote", "draft-from-source"],
      requiredTrace: ["exclusionReason"]
    };
  }

  if (validation.normalized.aiUseMode === "PENDING") {
    return {
      mode: "pending",
      status: "blocked",
      rationale: "AI use mode must be selected before the source influences drafting.",
      allowedActions: ["metadata-review", "link-target-element"],
      blockedActions: ["summarize", "compare", "quote", "draft-from-source"],
      requiredTrace: ["aiUseMode"]
    };
  }

  if (formalStages.includes(stage) && !target && (reference.normative || reference.bibliographyCandidate)) {
    return {
      mode: "compare",
      status: "warning",
      rationale: "Formal-stage source use needs a stable target element before final linkage.",
      allowedActions: ["compare-high-level", "create-link-candidate"],
      blockedActions: ["final-endnote-binding", "clause-2-finalization"],
      requiredTrace: ["linkedElementStableKey", "sourceLocation"]
    };
  }

  if (validation.normalized.aiUseMode === "QUOTE_LIMITED") {
    return {
      mode: "limited-quote",
      status: "ready",
      rationale: "Only short, traceable excerpts may be used, with paraphrase preferred for drafting guidance.",
      allowedActions: ["short-excerpt-check", "paraphrase-guidance", "citation-trace"],
      blockedActions: ["long-excerpt", "untraced-quotation", "canonical-paste"],
      requiredTrace: ["sourceLocation", "quoteLimitCheck", "elementStableKey"]
    };
  }

  if (validation.normalized.aiUseMode === "COMPARE") {
    return {
      mode: "compare",
      status: "ready",
      rationale: "Source may be used to compare scope, terminology, method and difference claims.",
      allowedActions: ["similarity-check", "scope-boundary-compare", "term-compare"],
      blockedActions: ["canonical-paste", "unsupported-normative-claim"],
      requiredTrace: ["comparisonMemo", "elementStableKey"]
    };
  }

  return {
    mode: "summarize",
    status: "ready",
    rationale: "Source may be summarized into advisory notes while keeping canonical drafting separate.",
    allowedActions: ["summary-note", "issue-extraction", "reference-memo"],
    blockedActions: ["canonical-paste", "untraced-quotation"],
    requiredTrace: ["summaryMemo", "elementStableKey"]
  };
}

