const deliverableTypes = ["IS", "TS", "TR", "PAS", "IWA", "GUIDE"];
const stages = ["PWI", "NP", "WD", "CD", "DIS", "FDIS", "PUBLICATION"];
const tracks = ["MONTHS_18", "MONTHS_24", "MONTHS_36"];

const deliverableProfiles = {
  IS: {
    label: "International Standard",
    defaultTrack: "MONTHS_36",
    cautions: ["Most formal route; requires publication-grade discipline before DIS."]
  },
  TS: {
    label: "Technical Specification",
    defaultTrack: "MONTHS_24",
    cautions: ["Useful when full consensus for an IS is premature."]
  },
  TR: {
    label: "Technical Report",
    defaultTrack: "MONTHS_24",
    cautions: ["Informative posture; avoid writing hidden requirements."]
  },
  PAS: {
    label: "Publicly Available Specification",
    defaultTrack: "MONTHS_18",
    cautions: ["Accelerated route requires tight scope control."]
  },
  IWA: {
    label: "International Workshop Agreement",
    defaultTrack: "MONTHS_18",
    cautions: ["Workshop-driven route; committee adoption assumptions must be checked."]
  },
  GUIDE: {
    label: "Guide",
    defaultTrack: "MONTHS_36",
    cautions: ["Guidance wording must remain distinct from requirements unless explicitly intended."]
  }
};

const deliverableGuidelines = {
  IS: {
    posture: "normative",
    procedureFocus: ["full consensus discipline", "DIS/FDIS publication readiness", "strict source and figure evidence"],
    draftingWarnings: ["requirements language must be controlled", "scope changes can affect ballot confidence"],
    exportFocus: ["DOCX", "OSD companion report", "source version map", "editable figure package"]
  },
  TS: {
    posture: "normative-or-transitional",
    procedureFocus: ["technical maturity without full IS posture", "future IS conversion awareness", "scope stability"],
    draftingWarnings: ["avoid overclaiming IS-level consensus", "mark provisional technical posture clearly"],
    exportFocus: ["DOCX", "source version map", "reference readiness", "conversion notes"]
  },
  TR: {
    posture: "informative",
    procedureFocus: ["reporting and explanation", "avoid hidden requirements", "evidence and bibliography clarity"],
    draftingWarnings: ["shall language should be exceptional", "do not make informative guidance look mandatory"],
    exportFocus: ["DOCX", "bibliography/endnote binding", "OSD companion report"]
  },
  PAS: {
    posture: "accelerated-public-specification",
    procedureFocus: ["tight market need", "fast feedback loop", "future transformation or withdrawal awareness"],
    draftingWarnings: ["scope creep is high risk", "late references and figures can break compressed timing"],
    exportFocus: ["DOCX", "source version map", "rapid issue log"]
  },
  IWA: {
    posture: "workshop-agreement",
    procedureFocus: ["workshop participation", "stakeholder representation", "committee adoption boundary"],
    draftingWarnings: ["do not imply ordinary committee consensus unless established", "record workshop scope carefully"],
    exportFocus: ["DOCX", "participant record", "decision rationale"]
  },
  GUIDE: {
    posture: "guidance",
    procedureFocus: ["advice clarity", "non-requirement language", "audience and use-case control"],
    draftingWarnings: ["guidance must not accidentally become a requirement", "examples should remain clearly informative"],
    exportFocus: ["DOCX", "OSD companion report", "style and terminology checks"]
  }
};

export function validateProjectDraft(input = {}) {
  const errors = [];
  const warnings = [];

  if (!input.title || String(input.title).trim().length < 5) {
    errors.push({
      field: "title",
      code: "TITLE_TOO_SHORT",
      message: "Project title must be at least 5 characters."
    });
  }

  if (!deliverableTypes.includes(input.deliverableType)) {
    errors.push({
      field: "deliverableType",
      code: "INVALID_DELIVERABLE",
      message: "Deliverable type must be IS, TS, TR, PAS, IWA or GUIDE."
    });
  }

  if (input.stage && !stages.includes(input.stage)) {
    errors.push({
      field: "stage",
      code: "INVALID_STAGE",
      message: "Stage must be one of the ISO stage values."
    });
  }

  if (input.track && !tracks.includes(input.track)) {
    errors.push({
      field: "track",
      code: "INVALID_TRACK",
      message: "Track must be MONTHS_18, MONTHS_24 or MONTHS_36."
    });
  }

  if (!input.committee) {
    warnings.push({
      field: "committee",
      code: "COMMITTEE_MISSING",
      message: "Committee information can be added later but is required for serious roadmap planning."
    });
  }

  if (input.title && /\b(draft|standard|international standard)\b/i.test(input.title)) {
    warnings.push({
      field: "title",
      code: "TITLE_STYLE_CHECK",
      message: "Check whether the title is concise and avoids unnecessary document-type wording."
    });
  }

  if (input.deliverableType === "TR" && input.stage === "DIS") {
    warnings.push({
      field: "stage",
      code: "DELIVERABLE_STAGE_REVIEW",
      message: "Confirm that the selected deliverable type and stage path are procedurally appropriate."
    });
  }

  const normalizedDeliverableType = deliverableTypes.includes(input.deliverableType) ? input.deliverableType : "IS";
  const profile = deliverableProfiles[normalizedDeliverableType];

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    normalized: {
      title: input.title ? String(input.title).trim() : "",
      deliverableType: normalizedDeliverableType,
      deliverableProfile: profile,
      stage: input.stage || "PWI",
      track: input.track || profile.defaultTrack,
      committee: input.committee ? String(input.committee).trim() : null,
      language: input.language || "en",
      dialogueLanguage: input.dialogueLanguage || "ko"
    }
  };
}

export function buildProjectPreview(input = {}) {
  const validation = validateProjectDraft(input);
  const normalized = validation.normalized;

  return {
    validation,
    preview: {
      canPersist: false,
      requiredReview: "admin-review",
      blockedReason: "PostgreSQL schema and migration plan are not enabled yet.",
      normalized,
      initialSections: [
        { key: "title", title: "Title", risk: "high" },
        { key: "scope", title: "Scope", risk: "high" },
        { key: "normative-references", title: "Normative references", risk: "medium" },
        { key: "terms", title: "Terms and definitions", risk: "high" },
        { key: "abbreviations", title: "Symbols and abbreviated terms", risk: "medium" }
      ],
      requiredAdminGates: ["iso_db_bootstrap"],
      advisoryNotes: [
        "PWI/DTR example projects are not imported as seed data.",
        "The first saved project must create audit, version and edit ownership records.",
        "Committee calendar should be entered before roadmap dates are treated as dependable."
      ]
    }
  };
}

export function buildDeliverableGuidelineMatrix(input = {}) {
  const selected = deliverableTypes.includes(input.deliverableType) ? input.deliverableType : "IS";
  const stage = stages.includes(input.stage) ? input.stage : "PWI";

  const rows = deliverableTypes.map((type) => {
    const profile = deliverableProfiles[type];
    const guideline = deliverableGuidelines[type];
    return {
      type,
      label: profile.label,
      selected: type === selected,
      defaultTrack: profile.defaultTrack,
      posture: guideline.posture,
      procedureFocus: guideline.procedureFocus,
      draftingWarnings: guideline.draftingWarnings,
      exportFocus: guideline.exportFocus,
      stageNote: stageNoteForDeliverable(type, stage)
    };
  });

  return {
    selected,
    stage,
    rows,
    policy: {
      noGenericIsAssumption: true,
      typeDrivesWarnings: true,
      stageAndTypeMustBeReviewedTogether: true
    },
    persistence: "guideline-matrix-only-until-db-enabled"
  };
}

export function buildProjectDashboardPreview(input = {}) {
  const areas = normalizeProgressAreas(input.progress || {});
  const overall = weightedAverage(areas);
  const blockers = buildDashboardBlockers(input, areas);
  const nextActions = buildNextActions(input, areas, blockers);

  return {
    projectId: input.projectId || null,
    title: input.title || "Preview project",
    stage: input.stage || "PWI",
    overallProgress: overall,
    areas,
    blockers,
    nextActions,
    status: blockers.length > 0 ? "blocked-or-at-risk" : "on-track-preview",
    persistence: "disabled-until-db-enabled"
  };
}

export function buildWorkspaceContract(input = {}) {
  const projectKey = normalizeProjectKey(input.projectKey || input.slug || "preview-project");
  const stage = stages.includes(input.stage) ? input.stage : "PWI";
  const deliverableType = deliverableTypes.includes(input.deliverableType) ? input.deliverableType : "IS";

  return {
    projectKey,
    stage,
    deliverableType,
    hpPaths: {
      source: `/uconai/projects/iso`,
      deploy: `/uconai/www/iso`,
      data: `/uconai/data/iso/projects/${projectKey}`,
      storage: `/uconai/data/iso/storage/${projectKey}`,
      logs: `/uconai/data/iso/logs/${projectKey}`
    },
    surfaces: [
      { id: "roadmap", title: "Roadmap diary", status: "preview-ready", requiresDb: true },
      { id: "document", title: "Structured document editor", status: "preview-ready", requiresDb: true },
      { id: "agent", title: "Right-side AI guidance panel", status: "contract-ready", requiresDb: false },
      { id: "references", title: "Reference registry", status: "contract-ready", requiresDb: true },
      { id: "figures", title: "Editable figure source manager", status: "contract-ready", requiresDb: true },
      { id: "exports", title: "DOCX and OSD companion export", status: "locked", requiresDb: true }
    ],
    runtimeGates: [
      { id: "db", status: "locked", reason: "Project persistence waits for separate DB execution review." },
      { id: "storage", status: "locked", reason: "Reference and export storage writes are not enabled yet." },
      { id: "service", status: "locked", reason: "No HP runtime service is started from source contract work." },
      { id: "publicDeploy", status: "locked", reason: "Deployment directory remains an empty rebuildable artifact target." }
    ],
    editorLayout: {
      singleMonitor: ["sidebar", "workspace", "agent-panel"],
      dualMonitor: {
        left: ["structured-document-editor", "page-view-controls"],
        right: ["agent-panel", "roadmap-diary", "reference-watchlist", "runtime-gates"]
      },
      pageModes: [1, 2, 4]
    },
    completionModel: buildWorkspaceCompletionModel(stage),
    persistence: "disabled-until-db-enabled"
  };
}

export function validateWorkspaceContract(input = {}) {
  const contract = buildWorkspaceContract(input);
  const errors = [];
  const warnings = [];

  if (!/^[a-z0-9][a-z0-9-]{2,62}$/.test(contract.projectKey)) {
    errors.push({
      field: "projectKey",
      code: "PROJECT_KEY_INVALID",
      message: "Project key must use lowercase letters, numbers and hyphens."
    });
  }

  if (input.deployFromData === true) {
    errors.push({
      field: "deployFromData",
      code: "DEPLOY_ARTIFACT_ONLY",
      message: "Deployment output must be rebuildable and must not be treated as source or data."
    });
  }

  if (input.sharedWithOtherProjects === true) {
    errors.push({
      field: "sharedWithOtherProjects",
      code: "PROJECT_ISOLATION_REQUIRED",
      message: "ISO project data must remain isolated from other UCONAI projects."
    });
  }

  if (contract.stage === "DIS" && input.referenceReady !== true) {
    warnings.push({
      field: "referenceReady",
      code: "DIS_REFERENCE_READINESS_NEEDED",
      message: "DIS workspace should show reference and bibliography readiness prominently."
    });
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    contract
  };
}

export function validateArchiveRequest(input = {}) {
  const errors = [];
  const warnings = [];

  if (!input.projectId) {
    errors.push({ field: "projectId", code: "PROJECT_REQUIRED", message: "Project ID is required." });
  }

  if (!input.reason || String(input.reason).trim().length < 12) {
    errors.push({ field: "reason", code: "ARCHIVE_REASON_REQUIRED", message: "Archive requires a clear reason." });
  }

  if (input.deleteFiles === true) {
    errors.push({ field: "deleteFiles", code: "DELETE_NOT_ALLOWED", message: "Archive policy must be non-destructive." });
  }

  warnings.push({
    code: "ARCHIVE_AUDIT_REQUIRED",
    message: "Archiving should preserve history, exports, references and audit records."
  });

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    destructive: false,
    persistence: "disabled-until-db-enabled"
  };
}

function normalizeProjectKey(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 63) || "preview-project";
}

function buildWorkspaceCompletionModel(stage) {
  const stageWeights = {
    PWI: { roadmap: 35, document: 15, references: 5, figures: 0, consensus: 25, export: 0 },
    NP: { roadmap: 45, document: 25, references: 10, figures: 5, consensus: 35, export: 0 },
    WD: { roadmap: 55, document: 45, references: 25, figures: 20, consensus: 45, export: 10 },
    CD: { roadmap: 68, document: 60, references: 45, figures: 40, consensus: 60, export: 20 },
    DIS: { roadmap: 82, document: 78, references: 75, figures: 70, consensus: 75, export: 55 },
    FDIS: { roadmap: 94, document: 92, references: 90, figures: 88, consensus: 88, export: 80 },
    PUBLICATION: { roadmap: 100, document: 100, references: 100, figures: 100, consensus: 100, export: 100 }
  };

  const weights = stageWeights[stage] || stageWeights.PWI;
  return Object.entries(weights).map(([area, target]) => ({
    area,
    target,
    source: "stage-based workspace target"
  }));
}

function normalizeProgressAreas(progress) {
  const defaults = [
    ["roadmap", 0, 0.18],
    ["document", 0, 0.28],
    ["references", 0, 0.12],
    ["figures", 0, 0.1],
    ["consensus", 0, 0.16],
    ["export", 0, 0.1],
    ["qa", 0, 0.06]
  ];

  return defaults.map(([id, fallback, weight]) => ({
    id,
    progress: clamp(Number(progress[id] ?? fallback)),
    weight
  }));
}

function weightedAverage(areas) {
  const weightSum = areas.reduce((sum, area) => sum + area.weight, 0);
  const value = areas.reduce((sum, area) => sum + area.progress * area.weight, 0) / weightSum;
  return Math.round(value);
}

function buildDashboardBlockers(input, areas) {
  const blockers = [];
  const stage = input.stage || "PWI";
  const area = Object.fromEntries(areas.map((item) => [item.id, item.progress]));

  if (["DIS", "FDIS", "PUBLICATION"].includes(stage) && area.references < 70) {
    blockers.push({ code: "REFERENCES_NOT_READY", message: "Formal-stage project needs stronger reference readiness." });
  }
  if (["FDIS", "PUBLICATION"].includes(stage) && area.figures < 80) {
    blockers.push({ code: "FIGURE_SOURCES_NOT_READY", message: "Final-stage project needs editable figure source readiness." });
  }
  if (area.consensus < 40 && ["CD", "DIS", "FDIS"].includes(stage)) {
    blockers.push({ code: "CONSENSUS_RISK", message: "Consensus progress is low for the selected stage." });
  }
  if (input.dbEnabled !== true) {
    blockers.push({ code: "DB_NOT_ENABLED", message: "Persistent project dashboard requires enabled DB." });
  }

  return blockers;
}

function stageNoteForDeliverable(type, stage) {
  if (type === "TR" && ["DIS", "FDIS"].includes(stage)) {
    return "Confirm the applicable procedure path; TR content should remain informative.";
  }
  if (type === "IS" && ["DIS", "FDIS", "PUBLICATION"].includes(stage)) {
    return "Formal package evidence, references, figures and consensus posture are critical.";
  }
  if (["PAS", "IWA"].includes(type) && stage !== "PWI") {
    return "Compressed or workshop-driven path needs tight issue tracking and participant evidence.";
  }
  if (type === "GUIDE") {
    return "Keep guidance wording distinct from requirements.";
  }
  return "Review deliverable type, stage, track and committee context together.";
}

function buildNextActions(input, areas, blockers) {
  const stage = input.stage || "PWI";
  const sorted = [...areas].sort((a, b) => a.progress - b.progress);
  const weakest = sorted[0];
  const actions = [];

  actions.push({ priority: "high", action: `Improve ${weakest.id} progress before the next ${stage} decision.` });
  if (blockers.some((item) => item.code === "DB_NOT_ENABLED")) {
    actions.push({ priority: "high", action: "Complete separate DB execution review before creating ISO PostgreSQL DB." });
  }
  if (stage === "PWI") {
    actions.push({ priority: "medium", action: "Prepare need statement, scope boundary and supporter map." });
  }
  return actions;
}

function clamp(value) {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

