export const productArchitecture = {
  version: "0.1.0",
  project: "iso",
  displayName: "UCONAI ISO",
  domainNeutral: true,
  modules: [
    "frontend",
    "backend",
    "ai-services",
    "worker",
    "scheduler",
    "storage",
    "db",
    "infra"
  ],
  roles: [
    "SYSTEM_ADMIN",
    "PROJECT_LEAD",
    "EDITOR",
    "RESEARCHER",
    "REVIEWER",
    "VIEWER"
  ],
  errorClasses: [
    "VALIDATION_WARNING",
    "VALIDATION_BLOCKER",
    "OPERATION_LOCKED",
    "AUTH_REQUIRED",
    "FORBIDDEN",
    "LOCK_CONFLICT",
    "PROVIDER_UNAVAILABLE",
    "QUOTA_EXCEEDED",
    "INTERNAL_ERROR"
  ],
  apiContractPolicy: {
    basePath: "/api/v1",
    statusRoute: "/api/v1/config-status",
    responseEnvelope: {
      ok: "boolean",
      data: "object|array|null",
      error: "object|null"
    },
    errorEnvelope: {
      code: "stable machine-readable error code",
      message: "short user-facing explanation",
      details: "optional structured diagnostic payload"
    },
    runtimeGates: [
      {
        gate: "none",
        meaning: "Read-only product contract or preview endpoint."
      },
      {
        gate: "admin-review",
        meaning: "Mutation-shaped endpoint stubbed until DB, auth, audit, and rollback plans are reviewed."
      }
    ],
    mutationSafety: [
      "No DB migration is implied by API contract work.",
      "No HP deployment route is implied by source contract work.",
      "Export, billing, AI provider, and lock mutations stay blocked until their execution plans are reviewed."
    ]
  },
  schemaContractPolicy: {
    databaseEngine: "PostgreSQL planned; no migration executed in source phase.",
    primaryAggregates: [
      "User",
      "StandardProject",
      "DocumentElement",
      "DocumentVersionSnapshot",
      "EditOwnershipLock",
      "RoadmapEvent",
      "ReferenceDocument",
      "FigureAsset",
      "AiInteraction",
      "ExportJob",
      "CreditAccount",
      "AuditLog"
    ],
    invariants: [
      "A project has exactly one current deliverable profile.",
      "Document elements use stable keys and sortable structured hierarchy.",
      "Snapshots are append-only history records unless a formal recovery procedure is executed.",
      "Only one active edit ownership lock may govern a project editing session at a time.",
      "Reference, figure, AI usage, export, billing, and audit data stay project-scoped where applicable."
    ]
  },
  eventVocabularyPolicy: {
    allowedPrefixes: [
      "project.",
      "document.",
      "lock.",
      "reference.",
      "figure.",
      "ai.",
      "export.",
      "review.",
      "billing.",
      "audit."
    ],
    blockedPrefixes: [
      "external-control.",
      "operator-bridge.",
      "message-bridge.",
      "agent-runner."
    ],
    note: "ISO product events are internal product state events only; unrelated external control-plane bridges are outside the ISO codebase."
  },
  eventFamilies: [
    "project.created",
    "project.stage_change_requested",
    "project.stage_changed",
    "document.element_created",
    "document.element_updated",
    "document.element_moved",
    "document.snapshot_created",
    "lock.acquired",
    "lock.transferred",
    "reference.registered",
    "figure.source_validated",
    "ai.requested",
    "ai.completed",
    "export.created",
    "review.requested",
    "review.completed"
  ],
  apiGroups: [
    "/policy",
    "/projects",
    "/documents",
    "/versions",
    "/locks",
    "/roadmap",
    "/references",
    "/figures",
    "/exports",
    "/ai",
    "/billing"
  ]
};


