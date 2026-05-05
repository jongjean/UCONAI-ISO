import type {
  AcceptanceGateSignal,
  AiCapability,
  AiGateSignal,
  BrainConflictSignal,
  BrainDecisionLogSignal,
  BrainEvidenceSignal,
  BrainMissionSignal,
  BrainOpinionSignal,
  BrainPanelSignal,
  CalendarMissionSignal,
  ChangeImpactSignal,
  ChapterWorkspaceBlock,
  ChiefAgentSignal,
  DashboardMetric,
  DeliveryMapSignal,
  DeliverableGuidelineSignal,
  DocumentCommandStep,
  DocumentImpactItem,
  DocumentSection,
  ExportGateSignal,
  FormalPackageSignal,
  Guardrail,
  MeetingLedgerSignal,
  Milestone,
  ProjectDraft,
  RoadmapEvent,
  RuntimeGate,
  SectionRiskSignal,
  SourceUseSignal,
  SupportingMaterialSignal,
  TrackRiskSignal,
  WorkspaceStateSignal,
  WorkspaceSurface
} from "./types";

export const metrics: DashboardMetric[] = [
  { label: "Overall progress", value: "82%", tone: "neutral" },
  { label: "Source scaffold", value: "In progress", tone: "good" },
  { label: "HP deploy", value: "Not published", tone: "warn" },
  { label: "Runtime locks", value: "DB / Deploy / Service", tone: "danger" }
];

export const milestones: Milestone[] = [
  {
    id: "1.0",
    chapter: "Project Reset",
    section: "1.1",
    title: "Clean HP baseline confirmed",
    owner: "Codex",
    status: "done",
    progress: 100
  },
  {
    id: "3.0",
    chapter: "ISO Rule Foundation",
    section: "3.4",
    title: "Stage, deliverable, OSD readiness rule registry",
    owner: "Rule Engine",
    status: "ready",
    progress: 89
  },
  {
    id: "5.0",
    chapter: "Database Model",
    section: "5.1",
    title: "Prepare PostgreSQL bootstrap plan before DB execution",
    owner: "Architecture",
    status: "blocked",
    progress: 86
  },
  {
    id: "7.0",
    chapter: "Frontend Foundation",
    section: "7.5",
    title: "Workspace, roadmap diary, AI guidance panels",
    owner: "Frontend",
    status: "ready",
    progress: 55
  },
  {
    id: "12.0",
    chapter: "AI Gateway",
    section: "12.2",
    title: "Connect default Ollama adapter after endpoint setup",
    owner: "AI",
    status: "blocked",
    progress: 24
  },
  {
    id: "21.0",
    chapter: "Testing and QA",
    section: "21.2",
    title: "Static smoke, API contract and HP preflight checks",
    owner: "QA",
    status: "ready",
    progress: 16
  }
];

export const documentSections: DocumentSection[] = [
  {
    id: "title",
    number: "0",
    title: "Title",
    state: "warning",
    progress: 10,
    memo: "High-impact field. Changes after formal progress require explicit review."
  },
  {
    id: "scope",
    number: "1",
    title: "Scope",
    state: "draft",
    progress: 15,
    memo: "Boundary, exclusions and deliverable type must be checked before NP/CD progress."
  },
  {
    id: "normative",
    number: "2",
    title: "Normative references",
    state: "locked",
    progress: 0,
    memo: "Requires reviewed reference registry and Clause 2 policy."
  },
  {
    id: "terms",
    number: "3",
    title: "Terms and definitions",
    state: "warning",
    progress: 10,
    memo: "Existing ISO/IEC terminology check required before final acceptance."
  },
  {
    id: "abbrev",
    number: "4",
    title: "Symbols and abbreviated terms",
    state: "draft",
    progress: 5,
    memo: "Keep abbreviations consistent with term entries and first use."
  }
];

export const chapterWorkspaceBlocks: ChapterWorkspaceBlock[] = [
  { id: "ch-01", chapter: 1, title: "Project governance", area: "Setup", progress: 95, status: "ready", focus: "Project boundary, independent ISO identity and safety rules.", sections: ["Objective", "Authority boundary", "Execution rule"], mission: "Keep ISO separated from other UCONAI projects.", guide: "Use this block when changing policy text, project identity or development assumptions." },
  { id: "ch-02", chapter: 2, title: "HP infrastructure policy", area: "Setup", progress: 94, status: "ready", focus: "HP paths, source/deploy/data boundary and runtime locks.", sections: ["HP paths", "Port policy", "Deploy boundary"], mission: "Keep source work independent from production runtime.", guide: "Use this before any path, service, Caddy or storage decision." },
  { id: "ch-03", chapter: 3, title: "ISO rule foundation", area: "Rules", progress: 92, status: "ready", focus: "Directives, OSD, deliverable type and stage rule baseline.", sections: ["Stage rules", "Deliverable types", "OSD posture"], mission: "Keep every feature tied to ISO procedure discipline.", guide: "Use this when adding rule checks or stage-specific cautions." },
  { id: "ch-04", chapter: 4, title: "Product architecture", area: "Architecture", progress: 90, status: "ready", focus: "Modular product map and API surface separation.", sections: ["Frontend", "Backend", "AI boundary"], mission: "Keep heavy AI outside HP while HP remains command center.", guide: "Use this before adding modules or new route groups." },
  { id: "ch-05", chapter: 5, title: "Database and data model", area: "Data", progress: 88, status: "watch", focus: "PostgreSQL-ready schema without executing migrations yet.", sections: ["Users", "Projects", "Document elements", "Audit"], mission: "Prepare persistence without touching live DB.", guide: "Use this for schema planning and repository contracts." },
  { id: "ch-06", chapter: 6, title: "Backend foundation", area: "API", progress: 90, status: "ready", focus: "Express API, route manifest and locked operation patterns.", sections: ["Routes", "Errors", "Contracts"], mission: "Keep preview APIs predictable and test-covered.", guide: "Use this for route additions and backend checks." },
  { id: "ch-07", chapter: 7, title: "Frontend foundation", area: "UI", progress: 72, status: "watch", focus: "Usable workspace, chapter blocks, document editor and AI panel.", sections: ["Layout", "Chapter focus", "Editor views"], mission: "Turn the control room into a real authoring workspace.", guide: "Use this block for UX, navigation and screen layout work." },
  { id: "ch-08", chapter: 8, title: "Project workspace", area: "Workspace", progress: 86, status: "ready", focus: "Project setup, deliverable type and workspace surfaces.", sections: ["Project draft", "Surfaces", "Archive checks"], mission: "Make each standard project independently manageable.", guide: "Use this for project metadata and workspace state screens." },
  { id: "ch-09", chapter: 9, title: "Structured document engine", area: "Document", progress: 91, status: "ready", focus: "Element-based document structure instead of one long blob.", sections: ["Title", "Scope", "Terms", "Figures"], mission: "Keep every clause addressable and traceable.", guide: "Use this for document blocks, numbering and OSD-sensitive text." },
  { id: "ch-10", chapter: 10, title: "Version history", area: "Document", progress: 89, status: "ready", focus: "Read-only snapshots, diff preview and impact reports.", sections: ["Snapshots", "Date browser", "Change impact"], mission: "Make every meaningful change recoverable and reviewable.", guide: "Use this for history, rollback previews and export binding." },
  { id: "ch-11", chapter: 11, title: "Edit ownership and collaboration", area: "Document", progress: 90, status: "ready", focus: "Single active editor with comments and proposals for others.", sections: ["Edit lock", "Transfer", "Proposal mode"], mission: "Prevent simultaneous canonical edits.", guide: "Use this for editor rights, transfer UX and stale edit checks." },
  { id: "ch-12", chapter: 12, title: "AI provider gateway", area: "AI", progress: 74, status: "watch", focus: "Ollama-first routing and premium provider policy.", sections: ["Model routing", "Preflight", "Budget gate"], mission: "Keep AI execution controlled, explainable and cost-aware.", guide: "Use this before connecting real model execution." },
  { id: "ch-13", chapter: 13, title: "AI agent functions", area: "AI", progress: 82, status: "watch", focus: "Directive checker, authoring guide and consensus assistant.", sections: ["Drafting", "OSD checks", "Similarity"], mission: "Attach AI as an advisor, not an uncontrolled writer.", guide: "Use this for right-panel agent behavior and advisory outputs." },
  { id: "ch-14", chapter: 14, title: "Roadmap and procedure engine", area: "Roadmap", progress: 91, status: "ready", focus: "18/24/36 month tracks, stage missions and calendar overlay.", sections: ["Tracks", "Diary", "Calendar"], mission: "Show what must happen before each procedural checkpoint.", guide: "Use this for timeline, meeting and ballot schedule logic." },
  { id: "ch-15", chapter: 15, title: "Reference and bibliography management", area: "References", progress: 88, status: "watch", focus: "Reference registration, source-use decision and endnote planning.", sections: ["Reference use", "Bibliography links", "Endnotes"], mission: "Keep source influence traceable from early drafting to DIS.", guide: "Use this for reference panels and document evidence links." },
  { id: "ch-16", chapter: 16, title: "Terms and definitions", area: "Terms", progress: 89, status: "ready", focus: "Clause 3 term discipline, duplication and requirement boundary.", sections: ["Terms", "Definitions", "Consistency"], mission: "Prevent terminology drift across the document.", guide: "Use this for term checks and definition guidance." },
  { id: "ch-17", chapter: 17, title: "Figures, tables and editable sources", area: "Figures", progress: 86, status: "watch", focus: "Editable PPTX/SVG/draw.io source packages and preview separation.", sections: ["Diagrams", "Tables", "Source package"], mission: "Ensure final submission is not raster-only.", guide: "Use this for Venn, flowchart and editable source generation." },
  { id: "ch-18", chapter: 18, title: "Review comments and consensus", area: "Consensus", progress: 88, status: "ready", focus: "Stakeholder posture, objections and cooperation missions.", sections: ["Comments", "Actors", "Meeting ledger"], mission: "Guide agreement-building without distorting stakeholder positions.", guide: "Use this for response planning and meeting preparation." },
  { id: "ch-19", chapter: 19, title: "DOCX and OSD export", area: "Export", progress: 80, status: "watch", focus: "DOCX assembly, OSD companion report and source map.", sections: ["DOCX", "OSD report", "Manifest"], mission: "Produce formal package evidence from structured source.", guide: "Use this when building downloadable output." },
  { id: "ch-20", chapter: 20, title: "Billing and premium AI", area: "Billing", progress: 78, status: "watch", focus: "Entitlement, usage estimate and premium model budget gates.", sections: ["Plans", "Usage", "Credits"], mission: "Keep paid AI optional and auditable.", guide: "Use this for billing UX and provider usage controls." },
  { id: "ch-21", chapter: 21, title: "Testing and QA", area: "QA", progress: 87, status: "ready", focus: "Contract tests, runtime previews and source-noise checks.", sections: ["Smoke", "Contracts", "Runtime"], mission: "Prevent regressions as the system grows.", guide: "Use this whenever source contracts or UI surfaces change." },
  { id: "ch-22", chapter: 22, title: "HP development deployment", area: "HP", progress: 76, status: "watch", focus: "Development runtime readiness without production publication.", sections: ["Preflight", "Service drafts", "Preview"], mission: "Prepare HP execution without crossing production boundaries.", guide: "Use this before dev service or internal preview changes." },
  { id: "ch-23", chapter: 23, title: "Production deployment", area: "Deploy", progress: 44, status: "blocked", focus: "Public build, Caddy route and production service enablement.", sections: ["Build", "Caddy", "Service"], mission: "Publish only after final evidence is ready.", guide: "Use this only when production release work begins." },
  { id: "ch-24", chapter: 24, title: "Operations and maintenance", area: "Ops", progress: 62, status: "watch", focus: "Logging, backup, monitoring and runbooks.", sections: ["Logs", "Backup", "Runbook"], mission: "Make the product maintainable after launch.", guide: "Use this for operations policy and status screens." },
  { id: "ch-25", chapter: 25, title: "Final acceptance", area: "Acceptance", progress: 58, status: "blocked", focus: "End-to-end evidence before complete claim.", sections: ["Browser QA", "Export QA", "Release evidence"], mission: "Close the project only with verifiable acceptance evidence.", guide: "Use this for final signoff and release readiness." }
];

export const documentCommandSteps: DocumentCommandStep[] = [
  {
    id: "create-element",
    command: "Create element",
    actor: "Active editor",
    sequence: ["validate", "lock check", "snapshot", "impact preview"],
    state: "ready"
  },
  {
    id: "accept-ai-proposal",
    command: "Use AI proposal",
    actor: "Active editor + agent",
    sequence: ["review proposal", "validate style", "snapshot", "audit event"],
    state: "watch"
  },
  {
    id: "move-element",
    command: "Move clause",
    actor: "Active editor",
    sequence: ["validate hierarchy", "renumber", "impact preview", "audit event"],
    state: "ready"
  },
  {
    id: "delete-element",
    command: "Delete element",
    actor: "Active editor",
    sequence: ["destructive check", "snapshot", "recoverable history", "impact preview"],
    state: "blocked"
  }
];

export const documentImpactPreview: DocumentImpactItem[] = [
  {
    id: "title",
    area: "Title",
    current: "PWI/NP-sensitive",
    impact: "A title change can reset stakeholder expectations and search differentiation work.",
    severity: "warning"
  },
  {
    id: "scope",
    area: "Scope",
    current: "Clause 1",
    impact: "Scope edits can affect deliverable type, ballot confidence and overlap analysis.",
    severity: "blocked"
  },
  {
    id: "terms",
    area: "Terms",
    current: "Clause 3",
    impact: "Term wording must remain consistent with definitions, abbreviations and later clauses.",
    severity: "warning"
  },
  {
    id: "figures",
    area: "Figures",
    current: "Editable source required",
    impact: "Flat previews are acceptable for drafting, but source packages must be tracked.",
    severity: "info"
  }
];

export const changeImpactSignals: ChangeImpactSignal[] = [
  {
    id: "scope-dis",
    element: "Scope content",
    stage: "DIS",
    risk: "high",
    checks: "scope boundary, comment recheck, OSD entry",
    action: "Create revision brief before submit"
  },
  {
    id: "term-cd",
    element: "Term definition",
    stage: "CD",
    risk: "high",
    checks: "terminology consistency, usage propagation",
    action: "Bind change to element key and issue log"
  },
  {
    id: "figure-fdis",
    element: "Figure text",
    stage: "FDIS",
    risk: "medium",
    checks: "editable source, caption, source manifest",
    action: "Refresh editable source package"
  },
  {
    id: "numbering-wd",
    element: "Clause numbering",
    stage: "WD",
    risk: "medium",
    checks: "outline, cross-reference anchors",
    action: "Run numbering preview before submit"
  }
];

export const sectionRiskSignals: SectionRiskSignal[] = [
  {
    id: "title",
    section: "Title",
    osdFocus: "Project identity and discovery wording",
    control: "formal review after NP",
    warning: "Can reset stakeholder expectations and differentiation work.",
    risk: "high"
  },
  {
    id: "scope",
    section: "Scope",
    osdFocus: "Clause 1 boundary and exclusions",
    control: "formal review after NP",
    warning: "Can affect votes, overlap analysis and committee confidence.",
    risk: "high"
  },
  {
    id: "terms",
    section: "Terms",
    osdFocus: "Clause 3 concept precision",
    control: "formal review from WD/CD",
    warning: "Can propagate through clauses, figures and objections.",
    risk: "high"
  },
  {
    id: "figures",
    section: "Figures",
    osdFocus: "Editable source and callout binding",
    control: "formal review at DIS",
    warning: "Flat previews cannot stand alone for final package readiness.",
    risk: "medium"
  }
];

export const workspaceStateSignals: WorkspaceStateSignal[] = [
  {
    id: "editor",
    label: "Editor state",
    value: "Single editor",
    detail: "Canonical text edits require the active editor lock; others can comment or propose.",
    status: "active"
  },
  {
    id: "snapshot",
    label: "Snapshot",
    value: "Read-only preview",
    detail: "Every future write must bind to a historical version snapshot.",
    status: "watch"
  },
  {
    id: "agent",
    label: "AI guidance",
    value: "Proposal only",
    detail: "Agent output stays in the right panel until reviewed by the editor.",
    status: "watch"
  },
  {
    id: "repository",
    label: "Repository",
    value: "Disabled",
    detail: "Persistent writes wait for DB, repository implementation and audit logging.",
    status: "locked"
  }
];

export const guardrails: Guardrail[] = [
  {
    id: "db",
    title: "DB review required",
    detail: "Project creation and membership persistence are blocked until PostgreSQL schema review is complete.",
    severity: "blocked"
  },
  {
    id: "data",
    title: "Data root created",
    detail: "/uconai/data/iso exists. DB creation and migrations remain blocked.",
    severity: "info"
  },
  {
    id: "osd",
    title: "Pre-OSD mode",
    detail: "The editor prepares OSD-ready structured content but does not replace OSD submission.",
    severity: "info"
  },
  {
    id: "ai",
    title: "AI provider locked",
    detail: "Default provider is planned as Ollama. Paid APIs require administrator review.",
    severity: "blocked"
  }
];

export const runtimeGates: RuntimeGate[] = [
  {
    id: "db",
    target: "Create PostgreSQL schema",
    risk: "PostgreSQL DB and migrations are still blocked",
    status: "locked"
  },
  {
    id: "service",
    target: "Start iso-api / iso-worker systemd services",
    risk: "HP runtime process becomes active",
    status: "locked"
  },
  {
    id: "deploy",
    target: "Build frontend and publish /uconai/www/iso",
    risk: "Public /iso/ route changes from empty 404 to live UI",
    status: "ready"
  },
  {
    id: "paid-ai",
    target: "Enable premium external AI providers",
    risk: "Billable usage and key custody start",
    status: "later"
  }
];

export const aiCapabilities: AiCapability[] = [
  {
    id: "directive-check",
    title: "Directives and OSD checker",
    purpose: "Detect structure, clause, reference and style risks while editing.",
    provider: "Ollama first, premium API optional",
    status: "design"
  },
  {
    id: "consensus",
    title: "Consensus mission guide",
    purpose: "Suggest meeting missions, stakeholder concerns and response themes.",
    provider: "Policy engine plus AI agent",
    status: "design"
  },
  {
    id: "figure-source",
    title: "Editable figure source assistant",
    purpose: "Generate Mermaid, PPTX shape plans or draw.io XML instead of flat JPG-only output.",
    provider: "Code-first generator with AI prompt planner",
    status: "ready"
  },
  {
    id: "similarity",
    title: "Similarity and scope overlap review",
    purpose: "Compare titles, scope language and public metadata before risky progression.",
    provider: "Search/RAG adapter after administrator review",
    status: "blocked"
  }
];

export const aiGateSignals: AiGateSignal[] = [
  {
    id: "local-first",
    label: "Local-first drafting",
    provider: "ollama",
    detail: "Routine drafting, style and advisory checks prefer workstation Ollama.",
    status: "watch"
  },
  {
    id: "large-context",
    label: "Large context review",
    provider: "premium-large-context",
    detail: "Premium routing needs entitlement, credits and source policy checks.",
    status: "blocked"
  },
  {
    id: "editable-artifact",
    label: "Editable artifact generation",
    provider: "code-first-generator",
    detail: "Figures, tables and DOCX/PPTX artifacts use code-first generation plans.",
    status: "ready"
  },
  {
    id: "canonical-write",
    label: "Canonical text write",
    provider: "none",
    detail: "AI output remains proposal-only until the document command flow accepts it.",
    status: "blocked"
  }
];

export const chiefAgentSignals: ChiefAgentSignal[] = [
  {
    id: "chief",
    label: "ISO Chief Standard Development Agent",
    scope: "Whole-document consistency, terminology unity, OSD readiness, meeting mission and specialist coordination.",
    activation: "always-on",
    brief: "Coordinates specialist findings into one human-reviewable recommendation."
  },
  {
    id: "title-scope",
    label: "Title & Scope Specialist",
    scope: "Title, scope boundary, differentiation and committee fit.",
    activation: "active",
    brief: "Escalates formal-stage title or scope changes."
  },
  {
    id: "terms",
    label: "Terms & Abbreviations Specialist",
    scope: "Clause 3, definitions, abbreviations and terminology consistency.",
    activation: "watch",
    brief: "Checks hidden requirements and term drift."
  },
  {
    id: "form4",
    label: "Form 4 & Draft Specialist",
    scope: "NP package, Form 4 fields, draft maturity and proposal evidence.",
    activation: "standby",
    brief: "Activates when proposal evidence or draft maturity gaps appear."
  },
  {
    id: "osd",
    label: "OSD & Directives Specialist",
    scope: "Directives, OSD entry, numbering, formal-stage blockers and package readiness.",
    activation: "always-on",
    brief: "Escalates high severity rule or formal package blockers."
  },
  {
    id: "generated",
    label: "Generated Task Specialist",
    scope: "Created by the chief agent when a narrow task-specific expertise gap is detected.",
    activation: "watch",
    brief: "Must report to the chief and can only propose findings."
  }
];

export const brainPanelSignals: BrainPanelSignal[] = [
  {
    id: "health",
    label: "Document health",
    value: "78%",
    detail: "Scope, terms and figure-source checks need council review.",
    status: "watch"
  },
  {
    id: "osd",
    label: "OSD readiness",
    value: "64%",
    detail: "Formal package fields and editable sources are not complete.",
    status: "watch"
  },
  {
    id: "compute",
    label: "Model / GPU",
    value: "Unified",
    detail: "Agents share one AI gateway and shared GPU pool policy.",
    status: "ready"
  },
  {
    id: "decision",
    label: "Human decision",
    value: "Required",
    detail: "Brain panel can propose, defer, memo or assign; canonical text remains editor-controlled.",
    status: "blocked"
  }
];

export const brainMissionSignals: BrainMissionSignal[] = [
  {
    id: "conflict",
    title: "Resolve specialist conflict",
    owner: "Chief Agent",
    priority: "high",
    status: "open"
  },
  {
    id: "memo",
    title: "Create revision memo for selected chapter",
    owner: "Consensus Specialist",
    priority: "medium",
    status: "open"
  },
  {
    id: "osd-check",
    title: "Run OSD and Directives risk memo",
    owner: "OSD Specialist",
    priority: "medium",
    status: "ready"
  }
];

export const brainOpinionSignals: BrainOpinionSignal[] = [
  {
    id: "scope-boundary",
    specialist: "Title & Scope Specialist",
    stance: "revise",
    finding: "The selected clause needs sharper boundary language before wider circulation.",
    recommendation: "Ask the editor to state inclusions, exclusions and intended users in one controlled paragraph."
  },
  {
    id: "terms-consistency",
    specialist: "Terms & Abbreviations Specialist",
    stance: "hold",
    finding: "Key nouns should be checked against Clause 3 before the clause is treated as stable.",
    recommendation: "Create or link term candidates, then run terminology propagation review."
  },
  {
    id: "osd-format",
    specialist: "OSD & Directives Specialist",
    stance: "revise",
    finding: "The clause should remain structurally simple and avoid uncontrolled bullet-like drafting.",
    recommendation: "Use numbered subclauses and keep requirement language stage-appropriate."
  },
  {
    id: "draft-evidence",
    specialist: "Form 4 & Draft Specialist",
    stance: "support",
    finding: "The current chapter can continue in preview mode if evidence gaps stay visible.",
    recommendation: "Keep proposal evidence, stakeholder rationale and draft maturity notes together."
  }
];

export const brainConflictSignals: BrainConflictSignal[] = [
  {
    id: "precision-vs-speed",
    topic: "Precision vs schedule",
    tension: "Scope and term specialists prefer tighter wording; roadmap pressure may favor circulation.",
    chiefResolution: "Circulate only with an issue memo that makes unresolved wording explicit.",
    severity: "high"
  },
  {
    id: "readability-vs-formality",
    topic: "Readable draft vs formal structure",
    tension: "Natural authoring text may drift toward essay style instead of ISO clause discipline.",
    chiefResolution: "Keep authoring friendly in notes, but convert canonical text into numbered clauses.",
    severity: "medium"
  },
  {
    id: "figure-preview-vs-source",
    topic: "Figure preview vs editable source",
    tension: "A preview diagram helps discussion, while final package readiness requires editable source.",
    chiefResolution: "Allow preview images in drafting while tracking editable source readiness separately.",
    severity: "medium"
  }
];

export const brainEvidenceSignals: BrainEvidenceSignal[] = [
  {
    id: "directives",
    label: "Directives and OSD rule memo",
    sourceType: "rule",
    usage: "Used to classify wording, numbering, reference and package risks."
  },
  {
    id: "chapter-plan",
    label: "25-chapter delivery map",
    sourceType: "project",
    usage: "Used to connect selected chapter work to overall project readiness."
  },
  {
    id: "source-registry",
    label: "Reference use register",
    sourceType: "reference",
    usage: "Used to distinguish compare, summarize, exclude and endnote-bound sources."
  },
  {
    id: "meeting-ledger",
    label: "Participation and issue ledger",
    sourceType: "meeting",
    usage: "Used to convert objections and concerns into meeting missions."
  }
];

export const brainDecisionLogSignals: BrainDecisionLogSignal[] = [
  {
    id: "memo",
    action: "Memo",
    target: "Selected clause",
    result: "Create a review note before text becomes stable."
  },
  {
    id: "assign",
    action: "Assign specialist",
    target: "Selected chapter",
    result: "Route a narrow task to the relevant specialist role."
  },
  {
    id: "defer",
    action: "Defer",
    target: "Chief recommendation",
    result: "Keep finding visible until supporting evidence improves."
  }
];

export const roadmapEvents: RoadmapEvent[] = [
  {
    id: "pwi",
    stage: "PWI",
    mission: "Clarify need, committee interest and likely opposition before NP proposal.",
    timing: "Before first formal proposal",
    progress: 20
  },
  {
    id: "np",
    stage: "NP",
    mission: "Secure participation, scope confidence and project leadership consensus.",
    timing: "NP ballot window",
    progress: 0
  },
  {
    id: "cd",
    stage: "CD",
    mission: "Expose disputed definitions, scope boundaries and technical objections early.",
    timing: "Committee draft consultation",
    progress: 0
  },
  {
    id: "dis",
    stage: "DIS",
    mission: "Enter publication-grade discipline: references, figures, editable sources and disposition records.",
    timing: "DIS preparation and ballot",
    progress: 0
  }
];

export const trackRiskSignals: TrackRiskSignal[] = [
  {
    id: "np-compression",
    stage: "NP",
    dateDelta: "-120 days",
    readiness: "scope and participation evidence required",
    mission: "Do not compress proposal timing until support and title/scope confidence are visible.",
    risk: "high"
  },
  {
    id: "cd-consultation",
    stage: "CD",
    dateDelta: "-95 days",
    readiness: "comment handling must be planned",
    mission: "Keep consultation, comment log and disposition method ahead of schedule pressure.",
    risk: "medium"
  },
  {
    id: "dis-ballot",
    stage: "DIS",
    dateDelta: "-70 days",
    readiness: "references, figures and terms need maturity",
    mission: "Enter DIS only with stable draft, editable source package and response posture.",
    risk: "medium"
  }
];

export const calendarMissionSignals: CalendarMissionSignal[] = [
  {
    id: "np-window",
    stage: "NP",
    checkpoint: "Proposal package review",
    daysUntil: 18,
    urgency: "urgent",
    missing: "participation plan, draft scope",
    mission: "Circulate proposal rationale and secure named expert participation."
  },
  {
    id: "cd-meeting",
    stage: "CD",
    checkpoint: "Committee draft meeting",
    daysUntil: 36,
    urgency: "watch",
    missing: "comment template",
    mission: "Present draft structure and ask objectors for exact wording."
  },
  {
    id: "dis-prep",
    stage: "DIS",
    checkpoint: "DIS readiness checkpoint",
    daysUntil: 62,
    urgency: "watch",
    missing: "reference check, editable figure source check",
    mission: "Show stable draft, reference status and editable figure evidence."
  },
  {
    id: "fdis-package",
    stage: "FDIS",
    checkpoint: "Final package review",
    daysUntil: 110,
    urgency: "ready",
    missing: "late risk list",
    mission: "Keep final decision package free of new technical substance."
  }
];

export const procedureWindows = [
  { id: "np", label: "NP ballot", status: "verify current rule" },
  { id: "cd", label: "CD consultation", status: "verify current rule" },
  { id: "dis", label: "DIS ballot", status: "verify current rule" },
  { id: "fdis", label: "FDIS decision", status: "verify current rule" }
];

export const meetingLedgerSignals: MeetingLedgerSignal[] = [
  {
    id: "cd-review",
    meeting: "CD review checkpoint",
    stage: "CD",
    participation: "Opposing expert joined; circulation still needed",
    objectionIntent: "scope-boundary",
    cooperationBoundary: "Offer revised exclusions and examples before wider circulation.",
    nextMission: "Circulate issue memo and ask for exact wording proposal.",
    status: "watch"
  },
  {
    id: "dis-prep",
    meeting: "DIS readiness meeting",
    stage: "DIS",
    participation: "Supporters visible; figure-source evidence pending",
    objectionIntent: "evidence-confidence",
    cooperationBoundary: "Show reference status and editable source package evidence.",
    nextMission: "Present stable draft, references, figures and response posture.",
    status: "blocked"
  },
  {
    id: "np-support",
    meeting: "NP support alignment",
    stage: "NP",
    participation: "Support path identified",
    objectionIntent: "clarification-needed",
    cooperationBoundary: "Keep title and scope confidence visible.",
    nextMission: "Secure named expert participation before proposal movement.",
    status: "ready"
  }
];

export const supportingMaterialSignals: SupportingMaterialSignal[] = [
  {
    id: "clause2",
    area: "Clause 2 references",
    score: 35,
    detail: "Normative references must be linked or resolved before formal package readiness.",
    status: "watch"
  },
  {
    id: "clause3",
    area: "Clause 3 terms",
    score: 42,
    detail: "Definitions need source checks, usage checks and requirement-boundary review.",
    status: "watch"
  },
  {
    id: "figures",
    area: "Editable figure sources",
    score: 28,
    detail: "Preview images and editable source packages are tracked separately.",
    status: "blocked"
  }
];

export const sourceUseSignals: SourceUseSignal[] = [
  {
    id: "iso-compare",
    source: "ISO/IEC source",
    mode: "compare",
    target: "Scope",
    trace: "comparison memo + element key",
    status: "ready"
  },
  {
    id: "paper-summary",
    source: "Research paper",
    mode: "summarize",
    target: "Introduction",
    trace: "summary memo + source location",
    status: "watch"
  },
  {
    id: "internal-exclude",
    source: "Internal note",
    mode: "exclude",
    target: "Awareness only",
    trace: "exclusion reason",
    status: "ready"
  },
  {
    id: "quote-limit",
    source: "Meeting material",
    mode: "limited-quote",
    target: "Comment response",
    trace: "quote limit + element key",
    status: "blocked"
  }
];

export const exportGateSignals: ExportGateSignal[] = [
  {
    id: "docx",
    label: "DOCX assembly",
    detail: "Element keys, generated numbering and DOCX styles must come from structured source.",
    status: "watch"
  },
  {
    id: "source-map",
    label: "Source version map",
    detail: "Every official export needs version-bound source evidence.",
    status: "blocked"
  },
  {
    id: "osd-report",
    label: "OSD companion report",
    detail: "Formal-stage package includes OSD readiness, warnings and blockers.",
    status: "watch"
  },
  {
    id: "asset-package",
    label: "Figure source package",
    detail: "FDIS/publication exports need editable source files, not only preview images.",
    status: "blocked"
  }
];

export const formalPackageSignals: FormalPackageSignal[] = [
  {
    id: "docx",
    label: "Structured DOCX",
    evidence: "document.docx plus source-version-map.json",
    blocker: "Missing version-bound structured source",
    status: "watch"
  },
  {
    id: "osd",
    label: "OSD companion",
    evidence: "osd-readiness-report.md",
    blocker: "Formal stage needs OSD entry checklist",
    status: "watch"
  },
  {
    id: "endnote",
    label: "Endnote bindings",
    evidence: "reference + elementStableKey + noteText",
    blocker: "DIS and later cannot rely on deferred bibliography notes",
    status: "blocked"
  },
  {
    id: "figure-source",
    label: "Editable figure package",
    evidence: "preview + editable source + source-manifest.json",
    blocker: "Raster-only figures block FDIS/publication package readiness",
    status: "blocked"
  }
];

export const acceptanceGateSignals: AcceptanceGateSignal[] = [
  { id: "source-contract", label: "Source contract", progress: 100, blocks: "runtime execution", status: "ready" },
  { id: "runtime-readiness", label: "Runtime readiness", progress: 72, blocks: "service installation", status: "watch" },
  { id: "export-readiness", label: "Export readiness", progress: 48, blocks: "DOCX and OSD release", status: "blocked" },
  { id: "ops-readiness", label: "Operations readiness", progress: 34, blocks: "public route", status: "blocked" },
  { id: "final-acceptance", label: "Final acceptance", progress: 20, blocks: "final-complete claim", status: "blocked" }
];

export const deliveryMapSignals: DeliveryMapSignal[] = [
  { chapter: "1-4", title: "Governance, HP boundary and architecture", phase: "0-1", progress: 93, status: "ready", next: "Keep source checks synchronized" },
  { chapter: "5-8", title: "Data model, backend and workspace", phase: "1-2", progress: 84, status: "watch", next: "Prepare reviewed repository switch" },
  { chapter: "9-11", title: "Document, history and editor lock", phase: "3", progress: 90, status: "ready", next: "Bind commands to persistent snapshots later" },
  { chapter: "14,18", title: "Roadmap, meetings and consensus", phase: "4", progress: 90, status: "ready", next: "Attach actual committee calendar later" },
  { chapter: "15-17", title: "References, terms and editable sources", phase: "5", progress: 88, status: "watch", next: "Add file registry and source package fixtures" },
  { chapter: "12,13,20", title: "AI gateway, agents and usage controls", phase: "6", progress: 78, status: "watch", next: "Keep paid providers disabled by default" },
  { chapter: "19", title: "DOCX and OSD package", phase: "7", progress: 80, status: "watch", next: "Create render sample after source fixtures" },
  { chapter: "21-25", title: "QA, HP runtime, operations and final evidence", phase: "8-9", progress: 65, status: "blocked", next: "Needs browser, service, DB and public route evidence later" }
];

export const projectDraft: ProjectDraft = {
  title: "New ISO standard development project",
  deliverableType: "IS",
  stage: "PWI",
  track: "MONTHS_36",
  committee: "To be assigned"
};

export const deliverableGuidelineSignals: DeliverableGuidelineSignal[] = [
  {
    type: "IS",
    label: "International Standard",
    posture: "normative",
    track: "36 months",
    warning: "Full formal evidence is critical before DIS/FDIS.",
    exportFocus: "DOCX, OSD report, source map, editable figures",
    status: "ready"
  },
  {
    type: "TS",
    label: "Technical Specification",
    posture: "transitional",
    track: "24 months",
    warning: "Avoid overclaiming IS-level consensus.",
    exportFocus: "DOCX, source map, reference readiness",
    status: "watch"
  },
  {
    type: "TR",
    label: "Technical Report",
    posture: "informative",
    track: "24 months",
    warning: "Avoid hidden requirements and uncontrolled shall language.",
    exportFocus: "DOCX, bibliography/endnote binding",
    status: "watch"
  },
  {
    type: "PAS/IWA",
    label: "Accelerated routes",
    posture: "compressed",
    track: "18 months",
    warning: "Scope creep and late evidence corrections are high risk.",
    exportFocus: "DOCX, issue log, participant evidence",
    status: "blocked"
  }
];

export const workspaceSurfaces: WorkspaceSurface[] = [
  { id: "roadmap", title: "Roadmap diary", status: "preview-ready", target: 35 },
  { id: "document", title: "Structured editor", status: "preview-ready", target: 15 },
  { id: "agent", title: "AI guidance panel", status: "contract-ready", target: 20 },
  { id: "references", title: "Reference registry", status: "contract-ready", target: 5 },
  { id: "figures", title: "Editable figures", status: "contract-ready", target: 0 },
  { id: "exports", title: "DOCX and OSD package", status: "locked", target: 0 }
];

export const viewModes = [
  { id: "one", label: "1 page", pages: 1 },
  { id: "two", label: "2 pages", pages: 2 },
  { id: "four", label: "4 pages", pages: 4 }
];

