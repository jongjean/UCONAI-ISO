import {
  AlertTriangle,
  BookOpenCheck,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Database,
  FileText,
  KeyRound,
  LayoutDashboard,
  LockKeyhole,
  Milestone,
  Network,
  PanelRight,
  Route,
  ServerCog,
  Sparkles,
  Users
} from "lucide-react";
import {
  analyzeNDocument,
  buildProjectControlSnapshot,
  buildStageAssessment as requestStageAssessment,
  probeIsoApi,
  queryNDocumentKnowledge,
  runAiCommander,
  type ApiProbeState
} from "./api";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import {
  acceptanceGateSignals as defaultAcceptanceGateSignals,
  aiCapabilities as defaultAiCapabilities,
  aiGateSignals as defaultAiGateSignals,
  brainConflictSignals,
  brainDecisionLogSignals,
  brainEvidenceSignals,
  brainMissionSignals,
  brainOpinionSignals,
  brainPanelSignals,
  calendarMissionSignals as defaultCalendarMissionSignals,
  changeImpactSignals as defaultChangeImpactSignals,
  chapterWorkspaceBlocks,
  chiefAgentSignals,
  documentCommandSteps,
  documentImpactPreview,
  documentSections,
  deliverableGuidelineSignals as defaultDeliverableGuidelineSignals,
  deliveryMapSignals as defaultDeliveryMapSignals,
  exportGateSignals as defaultExportGateSignals,
  formalPackageSignals as defaultFormalPackageSignals,
  guardrails as defaultGuardrails,
  meetingLedgerSignals as defaultMeetingLedgerSignals,
  metrics as defaultMetrics,
  milestones as defaultMilestones,
  projectDraft as defaultProjectDraft,
  procedureWindows as defaultProcedureWindows,
  roadmapEvents as defaultRoadmapEvents,
  runtimeGates as defaultRuntimeGates,
  sectionRiskSignals as defaultSectionRiskSignals,
  sourceUseSignals as defaultSourceUseSignals,
  supportingMaterialSignals as defaultSupportingMaterialSignals,
  trackRiskSignals as defaultTrackRiskSignals,
  viewModes,
  workspaceStateSignals as defaultWorkspaceStateSignals,
  workspaceSurfaces as defaultWorkspaceSurfaces
} from "./data";
import type { BrainDecisionLogSignal, ChapterWorkspaceBlock, DocumentSection, MilestoneStatus, ProjectDraft, ViewMode } from "./types";

type ClauseDraft = {
  id: string;
  title: string;
  depth: 1 | 2 | 3 | 4;
  status: "draft" | "watch" | "ready";
};

type WizardStepId = "fit" | "classification" | "committee" | "scope" | "review";

type StandardSetup = {
  projectTitle: string;
  standardTitle: string;
  aiModelName: string;
  developerNames: string;
  developmentLead: string;
  developmentCommittee: string;
  problemStatement: string;
  standardizationNeed: string;
  targetUsers: string;
  stakeholders: string;
  keywords: string;
  standardClass: string;
  organization: string;
  jointStructure: string;
  committeeType: string;
  tc: string;
  sc: string;
  wg: string;
  committeeName: string;
  deliverableType: string;
  currentStage: string;
  developmentTrack: string;
  scopeDraft: string;
  includedScope: string;
  excludedScope: string;
  differentiationStatement: string;
  similarStandardsMemo: string;
  evidenceMemo: string;
  realTimeStatusMemo: string;
  advancedInfoMemo: string;
};

type FieldMeta = {
  source: "manual" | "wizard" | "search" | "ai";
  status: "confirmed" | "suggested" | "unverified" | "undecided" | "risk";
  note: string;
};

type RegulationAnalysis = {
  fileName: string;
  detectedStage: string;
  confidence: "low" | "medium" | "high";
  done: string[];
  todo: string[];
  summary: string;
};

type SuperAgentMessage = {
  id: string;
  speaker: "user" | "super-agent";
  text: string;
};

type NDocumentEventType = "presentation" | "decision" | "meeting" | "plenary" | "circulation" | "vote" | "regulation" | "reference";

type NDocumentRecord = {
  id: string;
  fileName: string;
  uploadedAt: string;
  eventType: NDocumentEventType;
  stage: string;
  confidence?: "low" | "medium" | "high";
  summary: string;
  contentPreview: string;
  done?: string[];
  todo?: string[];
  risks?: string[];
  scheduleSignals?: string[];
  referenceSignals?: string[];
  dates?: string[];
  chunks?: Array<{
    id: string;
    fileName: string;
    text: string;
    keywords: string[];
    stageHints: string[];
    eventHints: string[];
  }>;
  storageRef?: string;
};

type ProjectControlSnapshot = {
  actionItems: string[];
  risks: string[];
  scheduleSignals: string[];
  referenceSignals: string[];
  dates: string[];
  commanderBrief: string[];
};

type WizardHistoryEntry = {
  id: string;
  label: string;
  createdAt: string;
  standardSetup: StandardSetup;
  projectDraft: ProjectDraft;
  documentSections: DocumentSection[];
};

type WorkspaceSaveState = {
  chapterBlocks: ChapterWorkspaceBlock[];
  selectedChapterId: string;
  expandedChapterIds: string[];
  selectedClauseId: string;
  clauseDrafts: ClauseDraft[];
  projectDraft: ProjectDraft;
  editableDocumentSections: DocumentSection[];
  brainDecisionLog: BrainDecisionLogSignal[];
  activeViewMode: ViewMode;
  operationalModules?: OperationalModules;
  standardSetup?: StandardSetup;
  fieldMeta?: Record<string, FieldMeta>;
  activeWizardStep?: WizardStepId;
  regulationAnalysis?: RegulationAnalysis;
  superAgentMessages?: SuperAgentMessage[];
  nDocuments?: NDocumentRecord[];
  projectControlSnapshot?: ProjectControlSnapshot;
  wizardHistory?: WizardHistoryEntry[];
  isWizardPageOpen?: boolean;
};

type OperationalModules = {
  metrics: typeof defaultMetrics;
  milestones: typeof defaultMilestones;
  guardrails: typeof defaultGuardrails;
  documentCommandSteps: typeof documentCommandSteps;
  documentImpactPreview: typeof documentImpactPreview;
  changeImpactSignals: typeof defaultChangeImpactSignals;
  sectionRiskSignals: typeof defaultSectionRiskSignals;
  workspaceStateSignals: typeof defaultWorkspaceStateSignals;
  workspaceSurfaces: typeof defaultWorkspaceSurfaces;
  deliverableGuidelineSignals: typeof defaultDeliverableGuidelineSignals;
  roadmapEvents: typeof defaultRoadmapEvents;
  runtimeGates: typeof defaultRuntimeGates;
  trackRiskSignals: typeof defaultTrackRiskSignals;
  procedureWindows: typeof defaultProcedureWindows;
  calendarMissionSignals: typeof defaultCalendarMissionSignals;
  meetingLedgerSignals: typeof defaultMeetingLedgerSignals;
  supportingMaterialSignals: typeof defaultSupportingMaterialSignals;
  sourceUseSignals: typeof defaultSourceUseSignals;
  exportGateSignals: typeof defaultExportGateSignals;
  formalPackageSignals: typeof defaultFormalPackageSignals;
  aiGateSignals: typeof defaultAiGateSignals;
  aiCapabilities: typeof defaultAiCapabilities;
  deliveryMapSignals: typeof defaultDeliveryMapSignals;
  acceptanceGateSignals: typeof defaultAcceptanceGateSignals;
};

const storageKey = "uconai.iso.workspace.v1";
const sidebarWidthKey = "uconai.iso.sidebar.width";
const navSectionIds = [
  "workspace-dashboard",
  "workspace-roadmap",
  "workspace-document",
  "workspace-references",
  "workspace-milestones",
  "workspace-schedule",
  "workspace-members"
];

const defaultOperationalModules: OperationalModules = {
  metrics: defaultMetrics,
  milestones: defaultMilestones,
  guardrails: defaultGuardrails,
  documentCommandSteps,
  documentImpactPreview,
  changeImpactSignals: defaultChangeImpactSignals,
  sectionRiskSignals: defaultSectionRiskSignals,
  workspaceStateSignals: defaultWorkspaceStateSignals,
  workspaceSurfaces: defaultWorkspaceSurfaces,
  deliverableGuidelineSignals: defaultDeliverableGuidelineSignals,
  roadmapEvents: defaultRoadmapEvents,
  runtimeGates: defaultRuntimeGates,
  trackRiskSignals: defaultTrackRiskSignals,
  procedureWindows: defaultProcedureWindows,
  calendarMissionSignals: defaultCalendarMissionSignals,
  meetingLedgerSignals: defaultMeetingLedgerSignals,
  supportingMaterialSignals: defaultSupportingMaterialSignals,
  sourceUseSignals: defaultSourceUseSignals,
  exportGateSignals: defaultExportGateSignals,
  formalPackageSignals: defaultFormalPackageSignals,
  aiGateSignals: defaultAiGateSignals,
  aiCapabilities: defaultAiCapabilities,
  deliveryMapSignals: defaultDeliveryMapSignals,
  acceptanceGateSignals: defaultAcceptanceGateSignals
};

const defaultStandardSetup: StandardSetup = {
  projectTitle: "",
  standardTitle: "",
  aiModelName: "Preview policy engine",
  developerNames: "",
  developmentLead: "",
  developmentCommittee: "",
  problemStatement: "",
  standardizationNeed: "",
  targetUsers: "",
  stakeholders: "",
  keywords: "",
  standardClass: "undecided",
  organization: "undecided",
  jointStructure: "undecided",
  committeeType: "undecided",
  tc: "",
  sc: "",
  wg: "",
  committeeName: "",
  deliverableType: "undecided",
  currentStage: "Pre-project",
  developmentTrack: "undecided",
  scopeDraft: "",
  includedScope: "",
  excludedScope: "",
  differentiationStatement: "",
  similarStandardsMemo: "",
  evidenceMemo: "",
  realTimeStatusMemo: "",
  advancedInfoMemo: ""
};

const wizardSteps: Array<{ id: WizardStepId; label: string; title: string; detail: string }> = [
  { id: "fit", label: "1 Fit", title: "Project fit survey", detail: "Clarify whether the task can become a standardization project." },
  { id: "classification", label: "2 Class", title: "Standard classification", detail: "Select standard level, organization and development path." },
  { id: "committee", label: "3 Path", title: "Committee and deliverable path", detail: "Capture TC, SC, WG, stage, track and document type." },
  { id: "scope", label: "4 Scope", title: "Scope builder", detail: "Draft included scope, excluded scope and differentiation." },
  { id: "review", label: "5 Review", title: "Setup review", detail: "Review unresolved items before moving into the workspace." }
];

const wizardHelp: Record<WizardStepId, {
  prompt: string;
  links: Array<{ label: string; url: string }>;
  faq: string[];
}> = {
  fit: {
    prompt: "Ask whether your topic is suitable for standardization, what evidence is needed or how to describe the need.",
    links: [
      { label: "ISO standards development overview", url: "https://www.iso.org/stages-and-resources-for-standards-development.html" },
      { label: "IEEE Standards Association", url: "https://standards.ieee.org/" }
    ],
    faq: [
      "A good standardization topic is repeatable, neutral and useful across organizations.",
      "If the topic depends on one product or one vendor, define a more neutral common method or data model.",
      "Evidence can include market need, interoperability problems, existing reports, pilots or expert demand.",
      "If the topic is still exploratory, TR or TS may be safer than IS."
    ]
  },
  classification: {
    prompt: "Ask which standard level or organization fits your project: ISO, IEC, ISO/IEC, IEEE, national or association.",
    links: [
      { label: "ISO technical committees", url: "https://www.iso.org/technical-committees.html" },
      { label: "IEC committees", url: "https://www.iec.ch/technical-committees-and-subcommittees" },
      { label: "ISO/IEC JTC 1", url: "https://www.iso.org/committee/45020.html" },
      { label: "IEEE Standards Association", url: "https://standards.ieee.org/" }
    ],
    faq: [
      "International, national, association and company standards have different authority and procedure.",
      "ISO/IEC is usually relevant when the subject crosses ISO and IEC/JTC technology domains.",
      "IEEE can be appropriate for engineering, communications, computing and industry-led technical ecosystems.",
      "Undecided is allowed, but the choice should remain visible as a risk."
    ]
  },
  committee: {
    prompt: "Ask how to choose TC, SC or WG, or whether IS, TS or TR is the right deliverable.",
    links: [
      { label: "ISO technical committees", url: "https://www.iso.org/technical-committees.html" },
      { label: "ISO work programme search", url: "https://www.iso.org/standards.html" },
      { label: "IEC committees", url: "https://www.iec.ch/technical-committees-and-subcommittees" },
      { label: "IEEE standards search", url: "https://standards.ieee.org/standard/" }
    ],
    faq: [
      "TC defines a broad technical domain; SC narrows it; WG usually develops specific work items.",
      "Committee scope should match your project scope before you commit to a route.",
      "IS generally needs stronger consensus and maturity than TS or TR.",
      "If several committees seem relevant, record alternatives and compare their official scope."
    ]
  },
  scope: {
    prompt: "Ask how to narrow the scope, define exclusions or phrase it in a standard-like way.",
    links: [
      { label: "ISO drafting resources", url: "https://www.iso.org/stages-and-resources-for-standards-development.html" },
      { label: "ISO standards search", url: "https://www.iso.org/standards.html" }
    ],
    faq: [
      "The scope should say what the document specifies, where it applies and what it does not cover.",
      "Avoid broad phrases such as all AI, all education or all data unless the committee scope supports it.",
      "Exclusions are useful because they reduce conflict with other standards and committees.",
      "A strong scope helps similar-standard search, committee selection and later objection handling."
    ]
  },
  review: {
    prompt: "Ask what unresolved items should be fixed before generating the master plan.",
    links: [
      { label: "ISO standards development resources", url: "https://www.iso.org/stages-and-resources-for-standards-development.html" },
      { label: "ISO standards search", url: "https://www.iso.org/standards.html" },
      { label: "IEC committees", url: "https://www.iec.ch/technical-committees-and-subcommittees" },
      { label: "IEEE Standards Association", url: "https://standards.ieee.org/" }
    ],
    faq: [
      "Before master plan generation, check unresolved organization, committee, deliverable and scope fields.",
      "Suggested values should be confirmed or kept as visible risks.",
      "Similar-standard search should happen before finalizing committee and scope strategy.",
      "The setup form is still editable after the wizard; the wizard improves starting quality."
    ]
  }
};

const defaultRegulationAnalysis: RegulationAnalysis = {
  fileName: "No regulation document uploaded",
  detectedStage: "PWI",
  confidence: "low",
  done: [
    "Project need and committee path are awaiting evidence from the uploaded meeting or regulation package."
  ],
  todo: [
    "Upload PWI, plenary, meeting minutes, resolution notes or regulation guidance to classify current status."
  ],
  summary: "Document-based stage analysis is waiting for source evidence."
};

const defaultSuperAgentMessages: SuperAgentMessage[] = [
  {
    id: "super-agent-opening",
    speaker: "super-agent",
    text: "I coordinate project creation, meeting evidence, references, schedules, stage decisions and document actions. Korean prompts are supported."
  }
];

const defaultProjectControlSnapshot: ProjectControlSnapshot = {
  actionItems: ["Upload source evidence so the AI Commander can build the first action queue."],
  risks: [],
  scheduleSignals: [],
  referenceSignals: [],
  dates: [],
  commanderBrief: ["Project control snapshot is waiting for N-document evidence."]
};

const nDocumentEventLabels: Record<NDocumentEventType, string> = {
  presentation: "Presentation",
  decision: "Decision",
  meeting: "Meeting",
  plenary: "Plenary",
  circulation: "Circulation",
  vote: "Vote",
  regulation: "Regulation",
  reference: "Reference"
};

const initialClauseDrafts: ClauseDraft[] = [
  { id: "clause-scope", title: "Scope", depth: 1, status: "watch" },
  { id: "clause-purpose", title: "Purpose and boundary", depth: 2, status: "draft" },
  { id: "clause-exclusions", title: "Exclusions", depth: 2, status: "draft" },
  { id: "clause-terms", title: "Terms and definitions", depth: 1, status: "watch" },
  { id: "clause-core-term", title: "Core term entry", depth: 2, status: "draft" },
  { id: "clause-note", title: "Editorial note", depth: 3, status: "ready" }
];

function readWorkspaceSave(): Partial<WorkspaceSaveState> {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Partial<WorkspaceSaveState>;
  } catch {
    return {};
  }
}

function readSavedSidebarWidth() {
  if (typeof window === "undefined") return 280;
  const parsed = Number(window.localStorage.getItem(sidebarWidthKey));
  if (!Number.isFinite(parsed)) return 280;
  return Math.min(460, Math.max(220, parsed));
}

const statusLabel: Record<MilestoneStatus, string> = {
  planned: "Planned",
  blocked: "Locked",
  ready: "Ready",
  done: "Done"
};

const statusClass: Record<MilestoneStatus, string> = {
  planned: "status planned",
  blocked: "status blocked",
  ready: "status ready",
  done: "status done"
};

function numberForClause(index: number, clauses: ClauseDraft[]) {
  const counters = [0, 0, 0, 0];
  for (let position = 0; position <= index; position += 1) {
    const depth = clauses[position].depth;
    counters[depth - 1] += 1;
    for (let reset = depth; reset < counters.length; reset += 1) counters[reset] = 0;
  }
  return counters.slice(0, clauses[index].depth).join(".");
}

export function App() {
  const savedWorkspace = readWorkspaceSave();
  const superAgentListRef = useRef<HTMLDivElement | null>(null);
  const [chapterBlocks, setChapterBlocks] = useState<ChapterWorkspaceBlock[]>(savedWorkspace.chapterBlocks || chapterWorkspaceBlocks);
  const [selectedChapterId, setSelectedChapterId] = useState(savedWorkspace.selectedChapterId || chapterWorkspaceBlocks[6]?.id || chapterWorkspaceBlocks[0].id);
  const [expandedChapterIds, setExpandedChapterIds] = useState<string[]>(savedWorkspace.expandedChapterIds || [chapterWorkspaceBlocks[6]?.id || chapterWorkspaceBlocks[0].id]);
  const [selectedClauseId, setSelectedClauseId] = useState(savedWorkspace.selectedClauseId || "clause-scope");
  const [brainDecision, setBrainDecision] = useState("No human decision selected.");
  const [brainDecisionLog, setBrainDecisionLog] = useState<BrainDecisionLogSignal[]>(savedWorkspace.brainDecisionLog || brainDecisionLogSignals);
  const [clauseDrafts, setClauseDrafts] = useState<ClauseDraft[]>(savedWorkspace.clauseDrafts || initialClauseDrafts);
  const [editableProjectDraft, setEditableProjectDraft] = useState<ProjectDraft>(savedWorkspace.projectDraft || defaultProjectDraft);
  const [editableDocumentSections, setEditableDocumentSections] = useState<DocumentSection[]>(savedWorkspace.editableDocumentSections || documentSections);
  const [activeViewMode, setActiveViewMode] = useState<ViewMode>(savedWorkspace.activeViewMode || "one");
  const [workspaceJson, setWorkspaceJson] = useState("");
  const [workspaceMessage, setWorkspaceMessage] = useState("Autosave ready.");
  const [lastSavedAt, setLastSavedAt] = useState("Not saved yet");
  const [operationalModules, setOperationalModules] = useState<OperationalModules>({
    ...defaultOperationalModules,
    ...savedWorkspace.operationalModules
  });
  const [standardSetup, setStandardSetup] = useState<StandardSetup>({
    ...defaultStandardSetup,
    ...savedWorkspace.standardSetup
  });
  const [fieldMeta, setFieldMeta] = useState<Record<string, FieldMeta>>(savedWorkspace.fieldMeta || {});
  const [activeWizardStep, setActiveWizardStep] = useState<WizardStepId>(savedWorkspace.activeWizardStep || "fit");
  const [wizardQuestion, setWizardQuestion] = useState("");
  const [wizardAnswer, setWizardAnswer] = useState("Ask a question about fit, scope, committee path or deliverable type.");
  const [regulationAnalysis, setRegulationAnalysis] = useState<RegulationAnalysis>(savedWorkspace.regulationAnalysis || defaultRegulationAnalysis);
  const [superAgentMessages, setSuperAgentMessages] = useState<SuperAgentMessage[]>(savedWorkspace.superAgentMessages || defaultSuperAgentMessages);
  const [superAgentInput, setSuperAgentInput] = useState("");
  const [nDocuments, setNDocuments] = useState<NDocumentRecord[]>(savedWorkspace.nDocuments || []);
  const [openNDocumentId, setOpenNDocumentId] = useState<string | null>(savedWorkspace.nDocuments?.[0]?.id || null);
  const [stageEngineMessage, setStageEngineMessage] = useState("Stage engine is waiting for source evidence.");
  const [projectControlSnapshot, setProjectControlSnapshot] = useState<ProjectControlSnapshot>(savedWorkspace.projectControlSnapshot || defaultProjectControlSnapshot);
  const [wizardHistory, setWizardHistory] = useState<WizardHistoryEntry[]>(savedWorkspace.wizardHistory || []);
  const [isWizardPageOpen, setIsWizardPageOpen] = useState(savedWorkspace.isWizardPageOpen || false);
  const [activeModuleKey, setActiveModuleKey] = useState<keyof OperationalModules>("roadmapEvents");
  const [moduleJson, setModuleJson] = useState(JSON.stringify((savedWorkspace.operationalModules || defaultOperationalModules).roadmapEvents, null, 2));
  const [apiProbe, setApiProbe] = useState<ApiProbeState>({
    status: "checking",
    baseUrl: "/iso/api/v1",
    health: "checking",
    routes: 0,
    progress: null,
    message: "Checking ISO API preview connection."
  });
  const [activeSection, setActiveSection] = useState(navSectionIds[0]);
  const [isMobileAgentOpen, setIsMobileAgentOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(readSavedSidebarWidth);
  const [floatingControlPosition, setFloatingControlPosition] = useState({
    agentLeft: 0,
    agentTop: 0,
    topLeft: 0,
    topTop: 0,
    ready: false
  });
  const {
    metrics,
    milestones,
    guardrails,
    changeImpactSignals,
    sectionRiskSignals,
    workspaceStateSignals,
    workspaceSurfaces,
    deliverableGuidelineSignals,
    roadmapEvents,
    runtimeGates,
    trackRiskSignals,
    procedureWindows,
    calendarMissionSignals,
    meetingLedgerSignals,
    supportingMaterialSignals,
    sourceUseSignals,
    exportGateSignals,
    formalPackageSignals,
    aiGateSignals,
    aiCapabilities,
    deliveryMapSignals,
    acceptanceGateSignals
  } = operationalModules;

  useEffect(() => {
    let active = true;
    probeIsoApi().then((state) => {
      if (active) setApiProbe(state);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const controlSize = 46;
    const gap = 10;
    const margin = 16;
    const syncFloatingControls = () => {
      const viewport = window.visualViewport;
      const viewportLeft = viewport?.offsetLeft ?? 0;
      const viewportTop = viewport?.offsetTop ?? 0;
      const viewportWidth = viewport?.width ?? window.innerWidth;
      const viewportHeight = viewport?.height ?? window.innerHeight;
      const left = viewportLeft + viewportWidth - controlSize - margin;
      const top = viewportTop + viewportHeight - controlSize - margin;

      setFloatingControlPosition({
        agentLeft: left,
        agentTop: top - controlSize - gap,
        topLeft: left,
        topTop: top,
        ready: true
      });
    };

    syncFloatingControls();
    window.addEventListener("resize", syncFloatingControls);
    window.addEventListener("scroll", syncFloatingControls, { passive: true });
    window.visualViewport?.addEventListener("resize", syncFloatingControls);
    window.visualViewport?.addEventListener("scroll", syncFloatingControls);

    return () => {
      window.removeEventListener("resize", syncFloatingControls);
      window.removeEventListener("scroll", syncFloatingControls);
      window.visualViewport?.removeEventListener("resize", syncFloatingControls);
      window.visualViewport?.removeEventListener("scroll", syncFloatingControls);
    };
  }, []);

  useEffect(() => {
    const list = superAgentListRef.current;
    if (!list) return;
    list.scrollTop = list.scrollHeight;
  }, [superAgentMessages, isMobileAgentOpen]);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const workspace = document.querySelector(".workspace");
    if (!workspace) return undefined;

    function updateActiveSection() {
      const sectionPositions = navSectionIds
        .map((id) => {
          const element = document.getElementById(id);
          return element ? { id, top: element.getBoundingClientRect().top } : null;
        })
        .filter((item): item is { id: string; top: number } => Boolean(item))
        .sort((a, b) => a.top - b.top);
      const current = [...sectionPositions].reverse().find((item) => item.top <= 160) || sectionPositions[0];
      if (current) setActiveSection(current.id);
    }

    updateActiveSection();
    workspace.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      workspace.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  useEffect(() => {
    const payload: WorkspaceSaveState = {
      chapterBlocks,
      selectedChapterId,
      expandedChapterIds,
      selectedClauseId,
      clauseDrafts,
      projectDraft: editableProjectDraft,
      editableDocumentSections,
      brainDecisionLog,
      activeViewMode,
      operationalModules,
      standardSetup,
      fieldMeta,
      activeWizardStep,
      regulationAnalysis,
      superAgentMessages,
      nDocuments,
      projectControlSnapshot,
      wizardHistory,
      isWizardPageOpen
    };
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, JSON.stringify(payload));
    }
    setLastSavedAt(new Date().toLocaleTimeString());
    setWorkspaceMessage("Autosaved in this browser.");
  }, [
    activeViewMode,
    brainDecisionLog,
    chapterBlocks,
    clauseDrafts,
    editableDocumentSections,
    editableProjectDraft,
    expandedChapterIds,
    operationalModules,
    standardSetup,
    fieldMeta,
    activeWizardStep,
    regulationAnalysis,
    superAgentMessages,
    nDocuments,
    projectControlSnapshot,
    wizardHistory,
    isWizardPageOpen,
    selectedChapterId,
    selectedClauseId
  ]);

  const selectedChapter = chapterBlocks.find((block) => block.id === selectedChapterId) || chapterBlocks[0] || chapterWorkspaceBlocks[0];

  function selectChapter(id: string) {
    setSelectedChapterId(id);
    setExpandedChapterIds((current) => current.includes(id) ? current : [...current, id]);
  }

  function toggleChapter(id: string) {
    setExpandedChapterIds((current) => (
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    ));
  }

  function moveChapter(id: string, direction: -1 | 1) {
    setChapterBlocks((current) => {
      const index = current.findIndex((block) => block.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(nextIndex, 0, item);
      return next;
    });
  }

  function deleteChapter(id: string) {
    setChapterBlocks((current) => {
      if (current.length <= 1) return current;
      const index = current.findIndex((block) => block.id === id);
      const next = current.filter((block) => block.id !== id);
      if (selectedChapterId === id) {
        setSelectedChapterId(next[Math.max(0, index - 1)]?.id || next[0].id);
      }
      return next;
    });
    setExpandedChapterIds((current) => current.filter((item) => item !== id));
  }

  function addChapterBlock() {
    const nextChapter = Math.max(...chapterBlocks.map((block) => block.chapter), 0) + 1;
    const id = `ch-custom-${Date.now()}`;
    const block: ChapterWorkspaceBlock = {
      id,
      chapter: nextChapter,
      title: "New working chapter",
      area: "Custom",
      progress: 0,
      status: "watch",
      focus: "Define the chapter objective before canonical drafting.",
      sections: ["Objective", "Working notes", "Open checks"],
      mission: "Capture the chapter purpose and required evidence.",
      guide: "This is a local preview block. Persistence waits for DB-backed workspace storage."
    };
    setChapterBlocks((current) => [...current, block]);
    setSelectedChapterId(id);
    setExpandedChapterIds((current) => [...current, id]);
  }

  function updateChapterBlock(id: string, patch: Partial<ChapterWorkspaceBlock>) {
    setChapterBlocks((current) => current.map((block) => (
      block.id === id ? { ...block, ...patch } : block
    )));
  }

  function addClause(afterId?: string) {
    const id = `clause-${Date.now()}`;
    setClauseDrafts((current) => {
      const index = afterId ? current.findIndex((item) => item.id === afterId) : current.length - 1;
      const previous = current[Math.max(0, index)];
      const draft: ClauseDraft = {
        id,
        title: "New clause",
        depth: previous?.depth || 1,
        status: "draft"
      };
      const next = [...current];
      next.splice(index + 1, 0, draft);
      return next;
    });
  }

  function addChildClause(parentId: string) {
    setClauseDrafts((current) => {
      const index = current.findIndex((item) => item.id === parentId);
      if (index < 0) return current;
      const parent = current[index];
      const draft: ClauseDraft = {
        id: `clause-${Date.now()}`,
        title: "New subclause",
        depth: Math.min(4, parent.depth + 1) as ClauseDraft["depth"],
        status: "draft"
      };
      const next = [...current];
      next.splice(index + 1, 0, draft);
      return next;
    });
  }

  function deleteClause(id: string) {
    setClauseDrafts((current) => {
      if (current.length <= 1) return current;
      const index = current.findIndex((item) => item.id === id);
      const next = current.filter((item) => item.id !== id);
      if (selectedClauseId === id) setSelectedClauseId(next[Math.max(0, index - 1)]?.id || next[0].id);
      return next;
    });
  }

  function moveClause(id: string, direction: -1 | 1) {
    setClauseDrafts((current) => {
      const index = current.findIndex((item) => item.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(nextIndex, 0, item);
      return next;
    });
  }

  function changeClauseDepth(id: string, direction: -1 | 1) {
    setClauseDrafts((current) => current.map((item) => {
      if (item.id !== id) return item;
      const depth = Math.max(1, Math.min(4, item.depth + direction)) as ClauseDraft["depth"];
      return { ...item, depth };
    }));
  }

  function updateClauseTitle(id: string, title: string) {
    setClauseDrafts((current) => current.map((item) => (
      item.id === id ? { ...item, title } : item
    )));
  }

  function updateProjectDraft(key: keyof ProjectDraft, value: string) {
    pushWizardHistory(`Before project ${key} change`);
    setEditableProjectDraft((current) => ({ ...current, [key]: value }));
    setEditableDocumentSections((current) => syncDocumentSectionsFromFields(current, standardSetup, { ...editableProjectDraft, [key]: value }));
  }

  function updateStandardSetup(key: keyof StandardSetup, value: string, status: FieldMeta["status"] = "unverified") {
    pushWizardHistory(`Before ${key} change`);
    const nextSetup = { ...standardSetup, [key]: value };
    setStandardSetup((current) => ({ ...current, [key]: value }));
    setEditableDocumentSections((current) => syncDocumentSectionsFromFields(current, nextSetup, editableProjectDraft));
    setFieldMeta((current) => ({
      ...current,
      [key]: {
        source: "wizard",
        status,
        note: status === "undecided" ? "This item remains undecided and should be reviewed later." : "Entered through the Standard Development Wizard."
      }
    }));
  }

  function fieldStatus(key: keyof StandardSetup) {
    const value = standardSetup[key];
    if (fieldMeta[key]) return fieldMeta[key].status;
    if (!value || value === "undecided") return "undecided";
    return "unverified";
  }

  function pushWizardHistory(label: string) {
    const entry: WizardHistoryEntry = {
      id: `wizard-history-${Date.now()}`,
      label,
      createdAt: new Date().toLocaleString(),
      standardSetup,
      projectDraft: editableProjectDraft,
      documentSections: editableDocumentSections
    };
    setWizardHistory((current) => [entry, ...current].slice(0, 20));
  }

  function restoreWizardHistory(entry: WizardHistoryEntry) {
    setStandardSetup(entry.standardSetup);
    setEditableProjectDraft(entry.projectDraft);
    setEditableDocumentSections(entry.documentSections);
    setWorkspaceMessage(`Restored wizard version: ${entry.label}`);
  }

  function syncDocumentSectionsFromFields(sections: DocumentSection[], setup: StandardSetup, project: ProjectDraft) {
    const titleText = setup.standardTitle || setup.projectTitle || project.title || "Untitled ISO project";
    const scopeMemo = [
      setup.scopeDraft && `Scope: ${setup.scopeDraft}`,
      setup.includedScope && `Includes: ${setup.includedScope}`,
      setup.excludedScope && `Excludes: ${setup.excludedScope}`,
      setup.differentiationStatement && `Differentiation: ${setup.differentiationStatement}`,
      `Deliverable: ${setup.deliverableType || project.deliverableType}`,
      `Stage: ${setup.currentStage || project.stage}`
    ].filter(Boolean).join("\n");
    const referenceMemo = [
      setup.evidenceMemo && `Evidence: ${setup.evidenceMemo}`,
      `${nDocuments.length} event/reference document(s) registered.`,
      openNDocument?.summary
    ].filter(Boolean).join("\n");
    const termMemo = [
      setup.keywords && `Keywords: ${setup.keywords}`,
      setup.targetUsers && `Target users: ${setup.targetUsers}`,
      setup.standardizationNeed && `Need: ${setup.standardizationNeed}`
    ].filter(Boolean).join("\n");

    return sections.map((section) => {
      if (section.id === "title") {
        return { ...section, title: titleText, memo: `Committee path: ${[setup.tc, setup.sc, setup.wg].filter(Boolean).join(" ") || "Not assigned"}\nAI model: ${setup.aiModelName || "Not assigned"}`, progress: Math.max(section.progress, titleText === "Untitled ISO project" ? 10 : 35) };
      }
      if (section.id === "scope") {
        return { ...section, memo: scopeMemo || section.memo, progress: Math.max(section.progress, setup.scopeDraft ? 42 : 15) };
      }
      if (section.id === "normative") {
        return { ...section, memo: referenceMemo || section.memo, progress: Math.max(section.progress, nDocuments.length > 0 ? 25 : 0) };
      }
      if (section.id === "terms") {
        const memberMemo = [
          termMemo,
          setup.developerNames && `Developers: ${setup.developerNames}`,
          setup.developmentLead && `Development lead: ${setup.developmentLead}`,
          setup.developmentCommittee && `Committee members: ${setup.developmentCommittee}`
        ].filter(Boolean).join("\n");
        return { ...section, memo: memberMemo || section.memo, progress: Math.max(section.progress, setup.keywords || setup.developerNames ? 28 : 10) };
      }
      return section;
    });
  }

  function askWizard() {
    const focus = wizardQuestion.trim();
    if (!focus) {
      setWizardAnswer(activeWizardHelp.prompt);
      return;
    }
    const stepTitle = wizardSteps.find((step) => step.id === activeWizardStep)?.title || "wizard step";
    setWizardAnswer(`${stepTitle} note: based on "${focus}", review the current fields, official links and FAQ for this step before confirming or carrying it as an unresolved risk.`);
  }

  function openSuperAgentRoom() {
    setActiveWizardStep("review");
    setIsWizardPageOpen(true);
    setActiveSection("workspace-dashboard");
    setTimeout(() => scrollToTop(), 0);
  }

  function handleNavItemClick(id: string) {
    if (isWizardPageOpen) {
      setIsWizardPageOpen(false);
      setActiveSection(id);
      setTimeout(() => scrollToSection(id), 0);
      return;
    }
    scrollToSection(id);
  }

  function buildSuperAgentReply(prompt: string, isKoreanPrompt: boolean) {
    const normalizedPrompt = prompt.toLowerCase();
    const hasKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(prompt);
    const asksUpload = /(upload|업로드|올리|파일|n문서|n-document|문서)/i.test(prompt);
    const asksSchedule = /(schedule|일정|회의|agenda|안건|마일스톤|milestone)/i.test(prompt);
    const asksReference = /(reference|참고|자료|출처|source|근거)/i.test(prompt);
    const asksStage = /(stage|단계|pwi|np|wd|cd|dis|fdis|publish|진도|진행)/i.test(prompt);
    const asksWizard = /(wizard|위자드|설정|수정|입력|필드)/i.test(prompt);

    if (asksUpload) {
      return hasKorean || isKoreanPrompt
        ? "N문서는 Start Wizard 설정 페이지의 `N-document event registry` 영역에서 업로드합니다. 상단의 `Start Wizard`를 열고 `Upload N-documents` 버튼을 누르면 됩니다. 업로드된 원본은 같은 블록의 `Original document preview`에서 다시 열어볼 수 있고, stage 진행표에도 반영됩니다."
        : "Upload N-documents in the Start Wizard settings page, inside the `N-document event registry` block. Use `Upload N-documents`; the original text reopens in `Original document preview`, and stage evidence is reflected on the progress line.";
    }

    if (asksSchedule) {
      return hasKorean || isKoreanPrompt
        ? `현재 단계는 ${currentStage}입니다. 다음 일정은 Schedule 메뉴에서 관리하고, 회의/총회/N문서를 업로드하면 해당 증빙을 기준으로 다음 액션과 일정 리스크를 갱신하는 흐름이 맞습니다.`
        : `Current stage is ${currentStage}. Manage timeline items in Schedule, then upload meeting or plenary N-documents so next actions and schedule risks can be updated from evidence.`;
    }

    if (asksReference) {
      return hasKorean || isKoreanPrompt
        ? "참고자료는 References 메뉴에서 현황을 보고, 실제 근거 파일이나 회의 문서는 Start Wizard의 N-document event registry에 올리는 구조가 좋습니다. 참고자료가 문서 본문 필드에 반영되어야 하면 위자드의 Evidence memo도 함께 수정하세요."
        : "Use References for the reference status view, and upload source or meeting evidence in the Start Wizard N-document registry. If the evidence must affect the draft fields, update the wizard Evidence memo as well.";
    }

    if (asksStage) {
      return hasKorean || isKoreanPrompt
        ? `현재 stage 표시는 ${currentStage}이고, 문서 분석 기준 감지 단계는 ${regulationAnalysis.detectedStage}입니다. 총회/회의/회람/투표 관련 N문서를 업로드하면 stage line의 문서 마커와 현황 요약이 갱신됩니다.`
        : `The current stage display is ${currentStage}, and the document analysis detected ${regulationAnalysis.detectedStage}. Upload plenary, meeting, circulation or ballot evidence to update the stage markers and status summary.`;
    }

    if (asksWizard) {
      return hasKorean || isKoreanPrompt
        ? "프로젝트 기본정보, 고급정보, 실시간 상태, 참고문서, AI Commander 의사결정은 Start Wizard 설정 페이지에서 수정합니다. 대시보드는 읽기 전용 현황판이라 직접 편집하지 않습니다."
        : "Edit project fields, advanced information, live status, reference documents and AI Commander decisions in the Start Wizard settings page. The dashboard is read-only.";
    }

    if (normalizedPrompt.includes("hello") || normalizedPrompt.includes("hi") || hasKorean) {
      return hasKorean || isKoreanPrompt
        ? "좋습니다. 무엇을 진행할지 말해주시면 현재 화면 기준으로 위치와 다음 작업을 바로 안내하겠습니다. 예: N문서 업로드 위치, stage 변경, 참고자료 정리, 다음 회의 안건 생성."
        : "Got it. Tell me what you want to do and I will point to the right place in the current workspace, such as N-document upload, stage update, references, or next meeting agenda.";
    }

    return isKoreanPrompt
      ? `현재 단계는 ${currentStage}입니다. "${prompt}" 요청을 위자드 입력값, N문서 증빙, 참고자료, 일정 리스크 중 어디에 반영해야 하는지 기준으로 정리하겠습니다.`
      : `Current stage is ${currentStage}. I will map "${prompt}" to wizard fields, N-document evidence, references, or schedule risk depending on where it belongs.`;
  }

  async function sendSuperAgentMessage(text = superAgentInput) {
    const prompt = text.trim();
    if (!prompt) return;
    const isKoreanPrompt = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(prompt);
    const userMessage: SuperAgentMessage = {
      id: `user-${Date.now()}`,
      speaker: "user",
      text: prompt
    };
    const messagesForApi = [...superAgentMessages, userMessage].slice(-8);
    setSuperAgentMessages((current) => [...current, userMessage].slice(-12));
    setSuperAgentInput("");
    setWorkspaceMessage("AI Commander is thinking with the project context.");
    try {
      let knowledgeBasis: unknown = null;
      try {
        knowledgeBasis = await queryNDocumentKnowledge({ query: prompt, nDocuments });
      } catch {
        knowledgeBasis = null;
      }
      const result = await runAiCommander({
        prompt,
        messages: messagesForApi,
        context: {
          currentStage,
          regulationAnalysis,
          standardSetup,
          projectDraft: editableProjectDraft,
          nDocuments,
          projectControlSnapshot,
          knowledgeBasis
        }
      });
      const agentMessage: SuperAgentMessage = {
        id: `super-agent-${Date.now()}`,
        speaker: "super-agent",
        text: result.text
      };
      setSuperAgentMessages((current) => [...current, agentMessage].slice(-12));
      setWorkspaceMessage(`AI Commander answered through ${result.provider}/${result.model}.`);
    } catch {
      const agentMessage: SuperAgentMessage = {
        id: `super-agent-${Date.now()}`,
        speaker: "super-agent",
        text: `${buildSuperAgentReply(prompt, isKoreanPrompt)}\n\nAI engine connection is not available yet, so this is a local fallback response.`
      };
      setSuperAgentMessages((current) => [...current, agentMessage].slice(-12));
      setWorkspaceMessage("AI Commander used local fallback because the engine was unavailable.");
    }
    if (/(upload|업로드|올리|파일|n문서|n-document|문서)/i.test(prompt)) {
      setIsWizardPageOpen(true);
      setTimeout(() => document.getElementById("wizard-n-document-registry")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
    }
  }

  async function analyzeRegulationDocument(file: File) {
    const rawText = await file.text().catch(() => "");
    const text = `${file.name}\n${rawText}`.toLowerCase();
    const stageRules = [
      { stage: "Publish", terms: ["publication", "published", "publish", "is published"] },
      { stage: "FDIS", terms: ["fdis", "final draft international standard"] },
      { stage: "DIS", terms: ["dis", "draft international standard", "enquiry"] },
      { stage: "CD", terms: ["committee draft", " cd ", "committee stage"] },
      { stage: "WD", terms: ["working draft", " wd ", "working group draft"] },
      { stage: "NP", terms: ["new work item proposal", "new proposal", "np ballot", "np approved"] },
      { stage: "PWI", terms: ["preliminary work item", "pwi", "plenary", "meeting", "regulation"] }
    ];
    const matched = stageRules.find((rule) => rule.terms.some((term) => text.includes(term)));
    const detectedStage = matched?.stage || "PWI";
    const evidenceCount = stageRules.flatMap((rule) => rule.terms).filter((term) => text.includes(term)).length;
    const confidence = evidenceCount >= 3 ? "high" : evidenceCount >= 1 ? "medium" : "low";
    const sentenceSource = rawText
      .replace(/\s+/g, " ")
      .split(/(?<=[.!?])\s+|[\n\r]+/)
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 80);
    const doneTerms = ["approved", "completed", "confirmed", "adopted", "resolved", "submitted", "circulated", "held"];
    const todoTerms = ["shall", "must", "should", "action", "todo", "next", "pending", "required", "prepare", "submit"];
    const done = sentenceSource
      .filter((sentence) => doneTerms.some((term) => sentence.toLowerCase().includes(term)))
      .slice(0, 4);
    const todo = sentenceSource
      .filter((sentence) => todoTerms.some((term) => sentence.toLowerCase().includes(term)))
      .slice(0, 5);
    const analysis = {
      fileName: file.name,
      detectedStage,
      confidence,
      done: done.length > 0 ? done : [`Classified current stage as ${detectedStage} from uploaded source evidence.`],
      todo: todo.length > 0 ? todo : [`Review ${detectedStage} evidence and confirm next required committee action.`],
      summary: `AI preview classified ${file.name} as ${detectedStage} evidence with ${confidence} confidence.`
    } satisfies RegulationAnalysis;

    setRegulationAnalysis(analysis);
    updateStandardSetup("currentStage", detectedStage, confidence === "low" ? "unverified" : "suggested");
    updateProjectDraft("stage", detectedStage === "Publish" ? "FDIS" : detectedStage);
    setWorkspaceMessage(`Regulation analysis applied: ${detectedStage} / ${confidence} confidence.`);
  }

  function classifyNDocument(text: string): { eventType: NDocumentEventType; stage: string } {
    const lower = text.toLowerCase();
    const eventRules: Array<{ eventType: NDocumentEventType; terms: string[] }> = [
      { eventType: "vote", terms: ["vote", "ballot", "accepted result", "voting result"] },
      { eventType: "circulation", terms: ["circulation", "circulated", "comment period", "consultation"] },
      { eventType: "plenary", terms: ["plenary", "general assembly", "총회"] },
      { eventType: "meeting", terms: ["meeting", "minutes", "agenda", "회의"] },
      { eventType: "decision", terms: ["decision", "resolution", "decided", "approved"] },
      { eventType: "presentation", terms: ["presentation", "presented", "slide", "발표"] },
      { eventType: "regulation", terms: ["regulation", "directive", "procedure"] }
    ];
    const stageRules = [
      { stage: "Publish", terms: ["publication", "published", "publish"] },
      { stage: "FDIS", terms: ["fdis", "final draft international standard"] },
      { stage: "DIS", terms: ["dis", "draft international standard", "enquiry"] },
      { stage: "CD", terms: ["committee draft", "committee stage"] },
      { stage: "WD", terms: ["working draft", "working group draft"] },
      { stage: "NP", terms: ["new work item proposal", "new proposal", "np ballot"] },
      { stage: "PWI", terms: ["preliminary work item", "pwi"] }
    ];
    return {
      eventType: eventRules.find((rule) => rule.terms.some((term) => lower.includes(term)))?.eventType || "reference",
      stage: stageRules.find((rule) => rule.terms.some((term) => lower.includes(term)))?.stage || currentStage
    };
  }

  async function uploadNDocuments(files: FileList | null) {
    if (!files?.length) return;
    const records = await Promise.all(Array.from(files).map(async (file, index) => {
      const rawText = await file.text().catch(() => "");
      const combined = `${file.name}\n${rawText}`;
      const classification = classifyNDocument(combined);
      const preview = rawText.replace(/\s+/g, " ").trim().slice(0, 1800) || "Original preview is unavailable for this file type in browser preview mode.";
      try {
        const engineAnalysis = await analyzeNDocument({
          fileName: file.name,
          contentText: rawText,
          fallbackStage: currentStage
        });
        return {
          id: engineAnalysis.id,
          fileName: engineAnalysis.fileName,
          uploadedAt: new Date(engineAnalysis.uploadedAt).toLocaleString(),
          eventType: engineAnalysis.eventType,
          stage: engineAnalysis.stage,
          confidence: engineAnalysis.confidence,
          summary: engineAnalysis.summary,
          contentPreview: engineAnalysis.contentPreview,
          done: engineAnalysis.done,
          todo: engineAnalysis.todo,
          risks: engineAnalysis.risks,
          scheduleSignals: engineAnalysis.scheduleSignals,
          referenceSignals: engineAnalysis.referenceSignals,
          dates: engineAnalysis.dates,
          chunks: engineAnalysis.chunks,
          storageRef: engineAnalysis.storageRef
        } satisfies NDocumentRecord;
      } catch {
        setStageEngineMessage("N-document engine API is not connected on this path, so browser analysis was used.");
      }
      return {
        id: `n-doc-${Date.now()}-${index}`,
        fileName: file.name,
        uploadedAt: new Date().toLocaleString(),
        eventType: classification.eventType,
        stage: classification.stage,
        confidence: "low",
        summary: `${nDocumentEventLabels[classification.eventType]} evidence mapped to ${classification.stage}.`,
        contentPreview: preview,
        chunks: [{
          id: `local-chunk-${Date.now()}-${index}`,
          fileName: file.name,
          text: preview,
          keywords: [],
          stageHints: [classification.stage],
          eventHints: [classification.eventType]
        }]
      } satisfies NDocumentRecord;
    }));
    setNDocuments((current) => [...records, ...current]);
    setOpenNDocumentId(records[0]?.id || openNDocumentId);
    setEditableDocumentSections((current) => current.map((section) => (
      section.id === "normative"
        ? {
          ...section,
          memo: `${records.length + nDocuments.length} event/reference document(s) registered.\nLatest: ${records[0]?.summary || "No summary"}`,
          progress: Math.max(section.progress, 25)
        }
        : section
    )));
    if (records[0]) {
      updateStandardSetup("currentStage", records[0].stage, "suggested");
      updateProjectDraft("stage", records[0].stage === "Publish" ? "FDIS" : records[0].stage);
      setRegulationAnalysis({
        fileName: records[0].fileName,
        detectedStage: records[0].stage,
        confidence: records[0].confidence || "low",
        done: records[0].done || [`Registered ${records[0].eventType} source evidence for ${records[0].stage}.`],
        todo: records[0].todo || [`Confirm next ${records[0].stage} committee action.`],
        summary: records[0].summary
      });
    }
    try {
      const assessment = await requestStageAssessment({
        currentStage: records[0]?.stage || currentStage,
        nDocuments: [...records, ...nDocuments]
      });
      setStageEngineMessage(`Stage engine v0.1: ${assessment.currentStage} / ${assessment.progress}% with ${assessment.nextActions[0]}`);
    } catch {
      setStageEngineMessage("Stage engine API is not connected on this path; local stage markers remain active.");
    }
    try {
      const snapshot = await buildProjectControlSnapshot({
        currentStage: records[0]?.stage || currentStage,
        nDocuments: [...records, ...nDocuments]
      });
      setProjectControlSnapshot({
        actionItems: snapshot.actionItems,
        risks: snapshot.risks,
        scheduleSignals: snapshot.scheduleSignals,
        referenceSignals: snapshot.referenceSignals,
        dates: snapshot.dates,
        commanderBrief: snapshot.commanderBrief
      });
    } catch {
      const mergedRecords = [...records, ...nDocuments];
      setProjectControlSnapshot({
        actionItems: mergedRecords.flatMap((record) => record.todo || []).slice(0, 8),
        risks: mergedRecords.flatMap((record) => record.risks || []).slice(0, 8),
        scheduleSignals: mergedRecords.flatMap((record) => record.scheduleSignals || []).slice(0, 8),
        referenceSignals: mergedRecords.flatMap((record) => record.referenceSignals || []).slice(0, 8),
        dates: [...new Set(mergedRecords.flatMap((record) => record.dates || []))].slice(0, 8),
        commanderBrief: ["Project control snapshot is using browser fallback until the API is connected."]
      });
    }
    const agentMessage: SuperAgentMessage = {
      id: `n-doc-agent-${Date.now()}`,
      speaker: "super-agent",
      text: `${records.length} N-document event file(s) registered. I marked event evidence on the progress line, updated current stage from the newest source, and prepared the AI Commander context.`
    };
    setSuperAgentMessages((current) => [...current, agentMessage].slice(-12));
    setWorkspaceMessage(`${records.length} N-document event file(s) uploaded and classified.`);
  }

  function updateDocumentSection(id: string, patch: Partial<DocumentSection>) {
    setEditableDocumentSections((current) => current.map((section) => (
      section.id === id ? { ...section, ...patch } : section
    )));
  }

  function addDocumentSection() {
    const nextNumber = `${editableDocumentSections.length}`;
    const section: DocumentSection = {
      id: `section-${Date.now()}`,
      number: nextNumber,
      title: "New section",
      state: "draft",
      progress: 0,
      memo: "Describe drafting risk, source needs and review focus."
    };
    setEditableDocumentSections((current) => [...current, section]);
  }

  function deleteDocumentSection(id: string) {
    setEditableDocumentSections((current) => (
      current.length <= 1 ? current : current.filter((section) => section.id !== id)
    ));
  }

  function exportWorkspace() {
    const payload: WorkspaceSaveState = {
      chapterBlocks,
      selectedChapterId,
      expandedChapterIds,
      selectedClauseId,
      clauseDrafts,
      projectDraft: editableProjectDraft,
      editableDocumentSections,
      brainDecisionLog,
      activeViewMode,
      operationalModules,
      standardSetup,
      fieldMeta,
      activeWizardStep
    };
    setWorkspaceJson(JSON.stringify(payload, null, 2));
    setWorkspaceMessage("Workspace JSON exported below.");
  }

  function importWorkspace() {
    try {
      const parsed = JSON.parse(workspaceJson) as Partial<WorkspaceSaveState>;
      if (parsed.chapterBlocks?.length) setChapterBlocks(parsed.chapterBlocks);
      if (parsed.selectedChapterId) setSelectedChapterId(parsed.selectedChapterId);
      if (parsed.expandedChapterIds?.length) setExpandedChapterIds(parsed.expandedChapterIds);
      if (parsed.selectedClauseId) setSelectedClauseId(parsed.selectedClauseId);
      if (parsed.clauseDrafts?.length) setClauseDrafts(parsed.clauseDrafts);
      if (parsed.projectDraft) setEditableProjectDraft(parsed.projectDraft);
      if (parsed.editableDocumentSections?.length) setEditableDocumentSections(parsed.editableDocumentSections);
      if (parsed.brainDecisionLog?.length) setBrainDecisionLog(parsed.brainDecisionLog);
      if (parsed.activeViewMode) setActiveViewMode(parsed.activeViewMode);
      if (parsed.operationalModules) setOperationalModules({ ...defaultOperationalModules, ...parsed.operationalModules });
      if (parsed.standardSetup) setStandardSetup({ ...defaultStandardSetup, ...parsed.standardSetup });
      if (parsed.fieldMeta) setFieldMeta(parsed.fieldMeta);
      if (parsed.activeWizardStep) setActiveWizardStep(parsed.activeWizardStep);
      if (parsed.regulationAnalysis) setRegulationAnalysis(parsed.regulationAnalysis);
      if (parsed.superAgentMessages?.length) setSuperAgentMessages(parsed.superAgentMessages);
      if (parsed.nDocuments) {
        setNDocuments(parsed.nDocuments);
        setOpenNDocumentId(parsed.nDocuments[0]?.id || null);
      }
      if (parsed.wizardHistory) setWizardHistory(parsed.wizardHistory);
      if (typeof parsed.isWizardPageOpen === "boolean") setIsWizardPageOpen(parsed.isWizardPageOpen);
      setWorkspaceMessage("Workspace JSON imported.");
    } catch {
      setWorkspaceMessage("JSON import failed. Check the text and try again.");
    }
  }

  function resetWorkspace() {
    setChapterBlocks(chapterWorkspaceBlocks);
    setSelectedChapterId(chapterWorkspaceBlocks[6]?.id || chapterWorkspaceBlocks[0].id);
    setExpandedChapterIds([chapterWorkspaceBlocks[6]?.id || chapterWorkspaceBlocks[0].id]);
    setSelectedClauseId("clause-scope");
    setClauseDrafts(initialClauseDrafts);
    setEditableProjectDraft(defaultProjectDraft);
    setEditableDocumentSections(documentSections);
    setBrainDecisionLog(brainDecisionLogSignals);
    setActiveViewMode("one");
    setOperationalModules(defaultOperationalModules);
    setStandardSetup(defaultStandardSetup);
    setFieldMeta({});
    setActiveWizardStep("fit");
    setRegulationAnalysis(defaultRegulationAnalysis);
    setSuperAgentMessages(defaultSuperAgentMessages);
    setSuperAgentInput("");
    setNDocuments([]);
    setOpenNDocumentId(null);
    setWizardHistory([]);
    setIsWizardPageOpen(false);
    setActiveModuleKey("roadmapEvents");
    setModuleJson(JSON.stringify(defaultOperationalModules.roadmapEvents, null, 2));
    setWorkspaceJson("");
    setWorkspaceMessage("Workspace reset to source defaults.");
  }

  function loadOperationalModule(key: keyof OperationalModules) {
    setActiveModuleKey(key);
    setModuleJson(JSON.stringify(operationalModules[key], null, 2));
  }

  function applyOperationalModule() {
    try {
      const parsed = JSON.parse(moduleJson) as OperationalModules[keyof OperationalModules];
      setOperationalModules((current) => ({ ...current, [activeModuleKey]: parsed }));
      setWorkspaceMessage(`${String(activeModuleKey)} applied to live panels.`);
    } catch {
      setWorkspaceMessage("Module JSON failed. Check commas, brackets and quoted field names.");
    }
  }

  function resetOperationalModule() {
    setOperationalModules((current) => ({ ...current, [activeModuleKey]: defaultOperationalModules[activeModuleKey] }));
    setModuleJson(JSON.stringify(defaultOperationalModules[activeModuleKey], null, 2));
    setWorkspaceMessage(`${String(activeModuleKey)} reset.`);
  }

  function scrollToSection(id: string) {
    if (typeof document === "undefined") return;
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollToTop() {
    if (typeof document === "undefined") return;
    document.querySelector(".workspace")?.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startSidebarResize(event: ReactPointerEvent<HTMLButtonElement>) {
    if (typeof window === "undefined") return;
    event.preventDefault();
    const updateWidth = (clientX: number) => {
      const nextWidth = Math.min(460, Math.max(220, window.innerWidth - clientX));
      setSidebarWidth(nextWidth);
      window.localStorage.setItem(sidebarWidthKey, String(nextWidth));
    };
    const handlePointerMove = (moveEvent: PointerEvent) => updateWidth(moveEvent.clientX);
    const stopResize = () => {
      document.body.classList.remove("resizing-sidebar");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResize);
      window.removeEventListener("pointercancel", stopResize);
    };

    document.body.classList.add("resizing-sidebar");
    updateWidth(event.clientX);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResize);
    window.addEventListener("pointercancel", stopResize);
  }

  function recordBrainDecision(action: string, result: string) {
    const target = `${selectedChapter.title} / ${selectedClause.number} ${selectedClause.title}`;
    setBrainDecision(`${action}: ${target}`);
    setBrainDecisionLog((current) => [
      {
        id: `decision-${Date.now()}`,
        action,
        target,
        result
      },
      ...current.slice(0, 4)
    ]);
  }

  const numberedClauses = clauseDrafts.map((item, index, list) => ({
    ...item,
    number: numberForClause(index, list)
  }));
  const selectedClause = numberedClauses.find((clause) => clause.id === selectedClauseId) || numberedClauses[0];
  const activeBrainSignals = brainPanelSignals.map((signal) => {
    if (signal.id === "health") {
      return {
        ...signal,
        value: `${Math.max(45, Math.min(96, selectedChapter.progress - (selectedClause.status === "watch" ? 8 : 0)))}%`,
        detail: `${selectedChapter.title} / ${selectedClause.number} ${selectedClause.title}`
      };
    }
    if (signal.id === "osd") {
      return {
        ...signal,
        value: selectedChapter.area === "Export" || selectedChapter.area === "Figures" ? "72%" : signal.value,
        detail: `Active context: ${selectedChapter.area}, clause level ${selectedClause.depth}`
      };
    }
    return signal;
  });
  const activeChiefSignals = chiefAgentSignals.map((signal) => {
    const active =
      signal.id === "chief" ||
      signal.id === "osd" ||
      (selectedChapter.area === "Document" && (signal.id === "title-scope" || signal.id === "terms")) ||
      (selectedChapter.area === "Terms" && signal.id === "terms") ||
      (selectedChapter.area === "Figures" && signal.id === "generated") ||
      (selectedChapter.area === "Roadmap" && signal.id === "form4");
    return active ? { ...signal, activation: signal.id === "chief" || signal.id === "osd" ? "always-on" : "active" as const } : signal;
  });
  const activeBrainMissions = brainMissionSignals.map((mission, index) => ({
    ...mission,
    title: index === 0 ? `Review ${selectedClause.number} ${selectedClause.title}` : mission.title,
    owner: index === 0 ? "Chief Agent" : mission.owner
  }));
  const activeBrainOpinions = brainOpinionSignals.map((opinion) => {
    if (opinion.id === "scope-boundary") {
      return {
        ...opinion,
        finding: `${selectedChapter.title} requires boundary review at ${selectedClause.number} ${selectedClause.title}.`
      };
    }
    if (opinion.id === "osd-format") {
      return {
        ...opinion,
        recommendation: `Keep ${selectedClause.number} at level ${selectedClause.depth} and preserve generated numbering.`
      };
    }
    return opinion;
  });
  const activeBrainConflicts = brainConflictSignals.map((conflict, index) => ({
    ...conflict,
    topic: index === 0 ? `${selectedChapter.area}: ${conflict.topic}` : conflict.topic
  }));
  const activeBrainEvidence = brainEvidenceSignals.map((evidence, index) => ({
    ...evidence,
    usage: index === 1 ? `Used for ${selectedChapter.title} progress and selected clause focus.` : evidence.usage
  }));
  const activeWizardHelp = wizardHelp[activeWizardStep];
  const navItems = [
    { id: "workspace-dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "workspace-roadmap", label: "Road Plan", icon: <Route size={18} /> },
    { id: "workspace-document", label: "Authoring", icon: <FileText size={18} /> },
    { id: "workspace-references", label: "References", icon: <Database size={18} /> },
    { id: "workspace-milestones", label: "Milestones", icon: <Milestone size={18} /> },
    { id: "workspace-schedule", label: "Schedule", icon: <CalendarDays size={18} /> },
    { id: "workspace-members", label: "Members", icon: <Users size={18} /> }
  ];
  const developmentStages = ["PWI", "NP", "WD", "CD", "DIS", "FDIS", "Publish"];
  const currentStage = standardSetup.currentStage === "Pre-project"
    ? "PWI"
    : standardSetup.currentStage || editableProjectDraft.stage || "PWI";
  const stageIndex = Math.max(0, developmentStages.findIndex((stage) => stage === currentStage));
  const stageProgress = Math.round(((stageIndex + 1) / developmentStages.length) * 100);
  const nDocumentStageCounts = developmentStages.reduce<Record<string, number>>((counts, stage) => {
    counts[stage] = nDocuments.filter((documentRecord) => documentRecord.stage === stage).length;
    return counts;
  }, {});
  const openNDocument = nDocuments.find((documentRecord) => documentRecord.id === openNDocumentId) || nDocuments[0];
  const agentButtonStyle = floatingControlPosition.ready
    ? ({ left: `${floatingControlPosition.agentLeft}px`, top: `${floatingControlPosition.agentTop}px`, right: "auto", bottom: "auto" } as CSSProperties)
    : undefined;
  const topButtonStyle = floatingControlPosition.ready
    ? ({ left: `${floatingControlPosition.topLeft}px`, top: `${floatingControlPosition.topTop}px`, right: "auto", bottom: "auto" } as CSSProperties)
    : undefined;
  const renderSuperAgentChat = (className = "") => (
    <div className={`super-agent-chat ${className}`.trim()}>
      <div className="super-agent-chat-head">
        <strong>AI Commander</strong>
        <span>Preview decision room</span>
      </div>
      <div className="super-agent-message-list" ref={superAgentListRef}>
        {superAgentMessages.map((message) => (
          <article className={`super-agent-message ${message.speaker}`} key={message.id}>
            <span>{message.speaker === "super-agent" ? "Super Agent" : "User"}</span>
            <p>{message.text}</p>
          </article>
        ))}
      </div>
      <div className="super-agent-input-row">
        <textarea
          value={superAgentInput}
          onChange={(event) => setSuperAgentInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              sendSuperAgentMessage();
            }
          }}
          placeholder="Ask in English or Korean. 예: 다음 회의 안건을 정리해줘."
        />
        <button type="button" onClick={() => sendSuperAgentMessage()}>Send</button>
      </div>
      <div className="super-agent-quick-actions">
        <button type="button" onClick={() => sendSuperAgentMessage("Create project from current setup and identify missing evidence.")}>Create project</button>
        <button type="button" onClick={() => sendSuperAgentMessage("Review uploaded plenary or meeting evidence and update next actions.")}>Review evidence</button>
        <button type="button" onClick={() => sendSuperAgentMessage("Check reference readiness and source-use risks.")}>Check references</button>
        <button type="button" onClick={() => sendSuperAgentMessage("Build the next schedule and decision agenda.")}>Build schedule</button>
      </div>
    </div>
  );

  return (
    <main className="app-shell" style={{ "--sidebar-width": `${sidebarWidth}px` } as CSSProperties}>
      <aside className="sidebar">
        <button
          className="sidebar-resize-handle"
          type="button"
          onPointerDown={startSidebarResize}
          aria-label="Resize right menu frame"
          title="Resize menu frame"
        />
        <div className="brand">
          <BookOpenCheck size={28} />
          <div>
            <strong>UCONAI ISO</strong>
            <span>Standard Development AI</span>
          </div>
        </div>
        <nav className="nav-list" aria-label="ISO workspace sections">
          {navItems.map((item) => (
            <button
              className={`nav-item ${activeSection === item.id ? "active" : ""}`}
              type="button"
              onClick={() => handleNavItemClick(item.id)}
              key={item.id}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        {renderSuperAgentChat("sidebar-ai-chat")}
      </aside>

      <section className={`workspace ${isWizardPageOpen ? "wizard-mode" : ""}`}>
        <header className="topbar" id="workspace-dashboard">
          <div>
            <p className="eyebrow">HP-native new development</p>
            <h1>ISO Project Control Room</h1>
          </div>
          <div className="route-pill">/iso/</div>
        </header>

        <section className="panel dashboard-summary-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Dashboard</p>
              <h2>Read-only project status</h2>
            </div>
            <LayoutDashboard size={22} />
          </div>
          <p className="dashboard-readonly-note">
            Dashboard is read-only. To edit project fields, upload N-documents, or run AI Commander decisions, open the Start Wizard settings page.
          </p>
          <p className="dashboard-readonly-note engine-note">
            {stageEngineMessage}
          </p>
          <div className="dashboard-summary-grid">
            <article className="dashboard-summary-card super-agent-entry">
              <span>Settings and AI Commander</span>
              <strong>Start Wizard</strong>
              <p>Project setup, field edits, document uploads, history restore and major decision support are managed on the wizard page.</p>
              <button type="button" onClick={openSuperAgentRoom}>Start Wizard</button>
            </article>
            <article className="dashboard-summary-card">
              <span>Current stage</span>
              <strong>{currentStage} / {stageProgress}% overall</strong>
              <p>{nDocuments.length} N-documents are registered as source evidence for the progress view.</p>
            </article>
            <article className="dashboard-summary-card">
              <span>Latest evidence analysis</span>
              <strong>{regulationAnalysis.detectedStage}</strong>
              <p>{regulationAnalysis.summary}</p>
            </article>
          </div>
          <div className="stage-progress-panel">
            <div className="stage-progress-head">
              <div>
                <span>Stage position</span>
                <strong>{currentStage} / {stageProgress}% overall</strong>
              </div>
              <em>PWI to Publish</em>
            </div>
            <div className="stage-line" aria-label={`Current stage ${currentStage}, overall progress ${stageProgress}%`}>
              {developmentStages.map((stage, index) => (
                <div className={`stage-node ${index <= stageIndex ? "active" : ""} ${index === stageIndex ? "current" : ""}`} key={stage}>
                  <span>{stage}</span>
                  {nDocumentStageCounts[stage] > 0 && <em>{nDocumentStageCounts[stage]} docs</em>}
                </div>
              ))}
            </div>
          </div>
          <div className="regulation-analysis-panel">
            <div className="regulation-analysis-head">
              <div>
                <span>Evidence status</span>
                <strong>{regulationAnalysis.fileName}</strong>
                <p>{regulationAnalysis.summary}</p>
              </div>
            </div>
            <div className="analysis-status-grid">
              <article>
                <span>Detected stage</span>
                <strong>{regulationAnalysis.detectedStage}</strong>
                <em>{regulationAnalysis.confidence} confidence</em>
              </article>
              <article>
                <span>Done</span>
                <ul>
                  {regulationAnalysis.done.map((item) => <li key={`done-${item}`}>{item}</li>)}
                </ul>
              </article>
              <article>
                <span>To do</span>
                <ul>
                  {regulationAnalysis.todo.map((item) => <li key={`todo-${item}`}>{item}</li>)}
                </ul>
              </article>
            </div>
          </div>
          <div className="project-control-snapshot-panel">
            <div className="regulation-analysis-head">
              <div>
                <span>Project control snapshot</span>
                <strong>N-document driven command queue</strong>
                <p>Extracted actions, risks, schedules and reference signals are used by AI Commander before general advice.</p>
              </div>
            </div>
            <div className="analysis-status-grid">
              <article>
                <span>Commander brief</span>
                <ul>
                  {projectControlSnapshot.commanderBrief.slice(0, 4).map((item) => <li key={`brief-${item}`}>{item}</li>)}
                </ul>
              </article>
              <article>
                <span>Action items</span>
                <ul>
                  {projectControlSnapshot.actionItems.slice(0, 5).map((item) => <li key={`action-${item}`}>{item}</li>)}
                </ul>
              </article>
              <article>
                <span>Risks and schedule</span>
                <ul>
                  {[...projectControlSnapshot.risks, ...projectControlSnapshot.scheduleSignals, ...projectControlSnapshot.dates].slice(0, 6).map((item) => <li key={`risk-schedule-${item}`}>{item}</li>)}
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className={`panel api-probe-panel ${apiProbe.status}`}>
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Runtime Probe</p>
              <h2>Preview connection state</h2>
            </div>
            <ServerCog size={22} />
          </div>
          <div className="api-probe-grid">
            <div>
              <span>Status</span>
              <strong>{apiProbe.status}</strong>
            </div>
            <div>
              <span>Health</span>
              <strong>{apiProbe.health}</strong>
            </div>
            <div>
              <span>Routes</span>
              <strong>{apiProbe.routes}</strong>
            </div>
            <div>
              <span>Progress</span>
              <strong>{apiProbe.progress === null ? "static" : `${apiProbe.progress}%`}</strong>
            </div>
          </div>
          <p className="api-probe-message">{apiProbe.message}</p>
        </section>

        <section className="metrics-grid" aria-label="Project metrics">
          {metrics.map((metric) => (
            <article key={metric.label} className={`metric ${metric.tone}`}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </article>
          ))}
        </section>

        <section className="panel standard-wizard-panel" id="workspace-start-wizard">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Start Wizard / Super Agent</p>
              <h2>Project setup, live evidence, references and decision room</h2>
            </div>
            <div className="wizard-page-actions">
              <span className="muted">Settings page</span>
              <button type="button" onClick={() => setIsWizardPageOpen(false)}>Back to dashboard</button>
            </div>
          </div>
          <div className="wizard-editable-panel primary">
            <div className="linked-document-head">
              <span>Editable command room fields</span>
              <strong>Edit these fields first. Dashboard and document fields update live.</strong>
            </div>
            <div className="wizard-field-grid two">
              <label>
                <span>AI model name</span>
                <input value={standardSetup.aiModelName} onChange={(event) => updateStandardSetup("aiModelName", event.target.value, "suggested")} />
              </label>
              <label>
                <span>Committee name</span>
                <input value={standardSetup.committeeName} onChange={(event) => updateStandardSetup("committeeName", event.target.value, "suggested")} />
              </label>
              <label>
                <span>Developer names</span>
                <textarea value={standardSetup.developerNames} onChange={(event) => updateStandardSetup("developerNames", event.target.value, "suggested")} />
              </label>
              <label>
                <span>Development lead</span>
                <textarea value={standardSetup.developmentLead} onChange={(event) => updateStandardSetup("developmentLead", event.target.value, "suggested")} />
              </label>
              <label>
                <span>Development committee</span>
                <textarea value={standardSetup.developmentCommittee} onChange={(event) => updateStandardSetup("developmentCommittee", event.target.value, "suggested")} />
              </label>
              <label>
                <span>Advanced information memo</span>
                <textarea value={standardSetup.advancedInfoMemo} onChange={(event) => updateStandardSetup("advancedInfoMemo", event.target.value, "suggested")} />
              </label>
              <label>
                <span>Real-time status memo</span>
                <textarea value={standardSetup.realTimeStatusMemo} onChange={(event) => updateStandardSetup("realTimeStatusMemo", event.target.value, "suggested")} />
              </label>
              <label>
                <span>Evidence memo</span>
                <textarea value={standardSetup.evidenceMemo} onChange={(event) => updateStandardSetup("evidenceMemo", event.target.value, "suggested")} />
              </label>
            </div>
          </div>
          <div className="n-document-registry" id="wizard-n-document-registry">
            <div className="n-document-head">
              <div>
                <span>N-document event registry</span>
                <strong>Upload and reopen source documents</strong>
              </div>
              <label className="document-upload-button">
                Upload N-documents
                <input
                  type="file"
                  multiple
                  accept=".txt,.md,.csv,.json,.html,.pdf,.docx"
                  onChange={(event) => {
                    void uploadNDocuments(event.target.files);
                    event.currentTarget.value = "";
                  }}
                />
              </label>
            </div>
            <div className="n-document-layout">
              <div className="n-document-list">
                {nDocuments.length === 0 && (
                  <article className="n-document-empty">
                    Upload event-related N-documents to mark the progress line and keep original evidence reopenable.
                  </article>
                )}
                {nDocuments.map((documentRecord) => (
                  <button
                    className={openNDocument?.id === documentRecord.id ? "active" : ""}
                    type="button"
                    key={documentRecord.id}
                    onClick={() => setOpenNDocumentId(documentRecord.id)}
                  >
                    <span>{nDocumentEventLabels[documentRecord.eventType]} / {documentRecord.stage} / {documentRecord.confidence || "low"}</span>
                    <strong>{documentRecord.fileName}</strong>
                    <em>{documentRecord.uploadedAt}</em>
                  </button>
                ))}
              </div>
              <article className="n-document-preview">
                <span>Original document preview</span>
                <strong>{openNDocument?.fileName || "No N-document selected"}</strong>
                <p>{openNDocument?.summary || "Upload an N-document to reopen its source content here."}</p>
                {openNDocument?.storageRef && <p>Server evidence ref: {openNDocument.storageRef}</p>}
                <pre>{openNDocument?.contentPreview || "Waiting for uploaded source."}</pre>
              </article>
            </div>
          </div>
          <div className="wizard-section-label">
            <span>Basic setup fields</span>
            <strong>Use these inputs to shape the Super Agent project context.</strong>
          </div>
          <div className="linked-document-sync-panel">
            <div className="linked-document-preview">
              <div className="linked-document-head">
                <span>Live document field sync</span>
                <strong>Wizard inputs update the actual document fields below.</strong>
              </div>
              <div className="linked-document-grid">
                {editableDocumentSections.slice(0, 4).map((section) => (
                  <article className={`linked-document-card ${section.state}`} key={section.id}>
                    <span>{section.number}</span>
                    <strong>{section.title}</strong>
                    <p>{section.memo}</p>
                    <em>{section.progress}%</em>
                  </article>
                ))}
              </div>
            </div>
            <div className="wizard-history-panel">
              <div className="linked-document-head">
                <span>Version history</span>
                <strong>Restore a previous wizard/document state.</strong>
              </div>
              <div className="wizard-history-list">
                {wizardHistory.length === 0 && <p>No previous wizard versions yet.</p>}
                {wizardHistory.slice(0, 6).map((entry) => (
                  <button type="button" key={entry.id} onClick={() => restoreWizardHistory(entry)}>
                    <span>{entry.createdAt}</span>
                    <strong>{entry.label}</strong>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="wizard-layout">
            <div className="wizard-step-list">
              {wizardSteps.map((step) => (
                <button
                  className={activeWizardStep === step.id ? "active" : ""}
                  type="button"
                  key={step.id}
                  onClick={() => setActiveWizardStep(step.id)}
                >
                  <span>{step.label}</span>
                  <strong>{step.title}</strong>
                  <em>{step.detail}</em>
                </button>
              ))}
            </div>

            <div className="wizard-form">
              {activeWizardStep === "fit" && (
                <div className="wizard-card">
                  <h3>1. Basic project intake</h3>
                  <div className="wizard-field-grid">
                    <label>
                      <span>Project title <em className={fieldStatus("projectTitle")}>!</em></span>
                      <input value={standardSetup.projectTitle} onChange={(event) => updateStandardSetup("projectTitle", event.target.value)} />
                    </label>
                    <label>
                      <span>Candidate standard title <em className={fieldStatus("standardTitle")}>!</em></span>
                      <input value={standardSetup.standardTitle} onChange={(event) => updateStandardSetup("standardTitle", event.target.value)} />
                    </label>
                    <label>
                      <span>Problem statement <em className={fieldStatus("problemStatement")}>!</em></span>
                      <textarea value={standardSetup.problemStatement} onChange={(event) => updateStandardSetup("problemStatement", event.target.value)} />
                    </label>
                    <label>
                      <span>Standardization need <em className={fieldStatus("standardizationNeed")}>!</em></span>
                      <textarea value={standardSetup.standardizationNeed} onChange={(event) => updateStandardSetup("standardizationNeed", event.target.value)} />
                    </label>
                    <label>
                      <span>Target users</span>
                      <input value={standardSetup.targetUsers} onChange={(event) => updateStandardSetup("targetUsers", event.target.value)} />
                    </label>
                    <label>
                      <span>Keywords</span>
                      <input value={standardSetup.keywords} onChange={(event) => updateStandardSetup("keywords", event.target.value)} />
                    </label>
                  </div>
                </div>
              )}

              {activeWizardStep === "classification" && (
                <div className="wizard-card">
                  <h3>2. Standard classification</h3>
                  <div className="wizard-field-grid three">
                    <label>
                      <span>Standard level <em className={fieldStatus("standardClass")}>!</em></span>
                      <select value={standardSetup.standardClass} onChange={(event) => updateStandardSetup("standardClass", event.target.value, event.target.value === "undecided" ? "undecided" : "unverified")}>
                        <option value="undecided">undecided</option>
                        <option value="international">international</option>
                        <option value="regional">regional</option>
                        <option value="national">national</option>
                        <option value="association">association</option>
                        <option value="industry">industry</option>
                        <option value="company">company</option>
                        <option value="de_facto">de facto</option>
                      </select>
                    </label>
                    <label>
                      <span>Organization <em className={fieldStatus("organization")}>!</em></span>
                      <select value={standardSetup.organization} onChange={(event) => updateStandardSetup("organization", event.target.value, event.target.value === "undecided" ? "undecided" : "unverified")}>
                        <option value="undecided">undecided</option>
                        <option value="ISO">ISO</option>
                        <option value="IEC">IEC</option>
                        <option value="ISO/IEC">ISO/IEC</option>
                        <option value="IEEE">IEEE</option>
                        <option value="ITU">ITU</option>
                        <option value="ASTM">ASTM</option>
                        <option value="KS/KATS">KS/KATS</option>
                        <option value="association">association</option>
                        <option value="other">other</option>
                      </select>
                    </label>
                    <label>
                      <span>Joint structure</span>
                      <select value={standardSetup.jointStructure} onChange={(event) => updateStandardSetup("jointStructure", event.target.value)}>
                        <option value="undecided">undecided</option>
                        <option value="standalone">standalone</option>
                        <option value="ISO/IEC JTC">ISO/IEC JTC</option>
                        <option value="other">other</option>
                      </select>
                    </label>
                  </div>
                </div>
              )}

              {activeWizardStep === "committee" && (
                <div className="wizard-card">
                  <h3>3. Committee and deliverable path</h3>
                  <div className="wizard-field-grid three">
                    <label>
                      <span>Committee type <em className={fieldStatus("committeeType")}>!</em></span>
                      <select value={standardSetup.committeeType} onChange={(event) => updateStandardSetup("committeeType", event.target.value)}>
                        <option value="undecided">undecided</option>
                        <option value="TC">TC</option>
                        <option value="JTC">JTC</option>
                        <option value="SC">SC</option>
                        <option value="WG">WG</option>
                        <option value="AHG">AHG</option>
                        <option value="other">other</option>
                      </select>
                    </label>
                    <label><span>TC/JTC</span><input value={standardSetup.tc} onChange={(event) => updateStandardSetup("tc", event.target.value)} /></label>
                    <label><span>SC</span><input value={standardSetup.sc} onChange={(event) => updateStandardSetup("sc", event.target.value)} /></label>
                    <label><span>WG</span><input value={standardSetup.wg} onChange={(event) => updateStandardSetup("wg", event.target.value)} /></label>
                    <label><span>Deliverable</span><select value={standardSetup.deliverableType} onChange={(event) => updateStandardSetup("deliverableType", event.target.value)}>
                      <option value="undecided">undecided</option>
                      <option value="IS">IS</option>
                      <option value="TS">TS</option>
                      <option value="TR">TR</option>
                      <option value="PAS">PAS</option>
                      <option value="IWA">IWA</option>
                      <option value="Guide">Guide</option>
                    </select></label>
                    <label><span>Track</span><select value={standardSetup.developmentTrack} onChange={(event) => updateStandardSetup("developmentTrack", event.target.value)}>
                      <option value="undecided">undecided</option>
                      <option value="36">36 months</option>
                      <option value="24">24 months</option>
                      <option value="18">18 months</option>
                    </select></label>
                  </div>
                </div>
              )}

              {activeWizardStep === "scope" && (
                <div className="wizard-card">
                  <h3>4. Scope builder</h3>
                  <div className="scope-guide-box">
                    <strong>Scope pattern</strong>
                    <p>This document specifies [what is standardized] for [domain/context]. It includes [included items]. It does not cover [excluded items].</p>
                  </div>
                  <div className="wizard-field-grid">
                    <label><span>Scope draft <em className={fieldStatus("scopeDraft")}>!</em></span><textarea value={standardSetup.scopeDraft} onChange={(event) => updateStandardSetup("scopeDraft", event.target.value)} /></label>
                    <label><span>Included scope</span><textarea value={standardSetup.includedScope} onChange={(event) => updateStandardSetup("includedScope", event.target.value)} /></label>
                    <label><span>Excluded scope</span><textarea value={standardSetup.excludedScope} onChange={(event) => updateStandardSetup("excludedScope", event.target.value)} /></label>
                    <label><span>Differentiation statement</span><textarea value={standardSetup.differentiationStatement} onChange={(event) => updateStandardSetup("differentiationStatement", event.target.value)} /></label>
                  </div>
                </div>
              )}

            </div>

            <aside className="wizard-side-panel">
              <div className="wizard-help-card">
                <strong>Official learning links</strong>
                {activeWizardHelp.links.map((link) => (
                  <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label}</a>
                ))}
              </div>
              <div className="wizard-help-card">
                <strong>{wizardSteps.find((step) => step.id === activeWizardStep)?.title} FAQ</strong>
                {activeWizardHelp.faq.map((item) => <p key={item}>{item}</p>)}
              </div>
              <div className="wizard-help-card">
                <strong>Ask AI about this step</strong>
                <textarea value={wizardQuestion} onChange={(event) => setWizardQuestion(event.target.value)} placeholder={activeWizardHelp.prompt} />
                <button type="button" onClick={askWizard}>Ask</button>
                <p>{wizardAnswer}</p>
              </div>
            </aside>
          </div>
          {activeWizardStep === "review" && (
            <div className="wizard-card setup-review-panel">
              <h3>5. Setup review</h3>
              <p className="setup-review-intro">Full-width review of every setup field, current value and validation state before moving into workspace operations.</p>
              <div className="setup-review-grid">
                {(Object.keys(standardSetup) as Array<keyof StandardSetup>).map((key) => (
                  <article className={`setup-review-item ${fieldStatus(key)}`} key={String(key)}>
                    <span>{String(key)}</span>
                    <strong>{standardSetup[key] || "empty"}</strong>
                    <em>{fieldStatus(key)}</em>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="panel workspace-ops-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Workspace Operations</p>
              <h2>Editable state, autosave and transfer JSON</h2>
            </div>
            <span className="muted">Saved: {lastSavedAt}</span>
          </div>
          <div className="workspace-ops-grid">
            <div className="workspace-ops-actions">
              <button type="button" onClick={exportWorkspace}>Export JSON</button>
              <button type="button" onClick={importWorkspace}>Import JSON</button>
              <button type="button" onClick={resetWorkspace}>Reset workspace</button>
            </div>
            <label className="workspace-json-field">
              <span>{workspaceMessage}</span>
              <textarea
                value={workspaceJson}
                onChange={(event) => setWorkspaceJson(event.target.value)}
                placeholder="Exported workspace JSON appears here. Paste JSON here to import a saved working state."
              />
            </label>
          </div>
        </section>

        <section className="panel live-module-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Live Module Editor</p>
              <h2>Make every operational panel editable</h2>
            </div>
            <span className="muted">{String(activeModuleKey)}</span>
          </div>
          <div className="live-module-layout">
            <div className="module-key-list">
              {(Object.keys(operationalModules) as Array<keyof OperationalModules>).map((key) => (
                <button
                  className={activeModuleKey === key ? "active" : ""}
                  type="button"
                  key={String(key)}
                  onClick={() => loadOperationalModule(key)}
                >
                  {String(key)}
                </button>
              ))}
            </div>
            <div className="module-json-editor">
              <textarea
                value={moduleJson}
                onChange={(event) => setModuleJson(event.target.value)}
                aria-label={`${String(activeModuleKey)} JSON`}
              />
              <div className="module-actions">
                <button type="button" onClick={applyOperationalModule}>Apply to panel</button>
                <button type="button" onClick={() => setModuleJson(JSON.stringify(operationalModules[activeModuleKey], null, 2))}>Reload current</button>
                <button type="button" onClick={resetOperationalModule}>Reset module</button>
              </div>
            </div>
          </div>
        </section>

        <section className="panel chapter-workspace-panel" id="workspace-chapters">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Chapter Blocks</p>
              <h2>Work on one chapter without expanding the whole document</h2>
            </div>
            <button className="chapter-add-button" type="button" onClick={addChapterBlock}>Add block</button>
          </div>
          <div className="chapter-workspace-layout">
            <div className="chapter-block-list" aria-label="Chapter block list">
              {chapterBlocks.map((block, index) => {
                const expanded = expandedChapterIds.includes(block.id);
                const selected = selectedChapter.id === block.id;
                return (
                  <article className={`chapter-block ${block.status} ${selected ? "selected" : ""}`} key={block.id}>
                    <button className="chapter-block-main" type="button" onClick={() => selectChapter(block.id)}>
                      <span>Ch. {block.chapter}</span>
                      <strong>{block.title}</strong>
                      <em>{block.area} / {block.progress}%</em>
                    </button>
                    <div className="chapter-block-actions">
                      <button type="button" onClick={() => toggleChapter(block.id)} aria-label={`Toggle ${block.title}`}>
                        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      <button type="button" onClick={() => moveChapter(block.id, -1)} disabled={index === 0} aria-label={`Move ${block.title} up`}>Up</button>
                      <button type="button" onClick={() => moveChapter(block.id, 1)} disabled={index === chapterBlocks.length - 1} aria-label={`Move ${block.title} down`}>Down</button>
                      <button type="button" onClick={() => deleteChapter(block.id)} disabled={chapterBlocks.length <= 1} aria-label={`Delete ${block.title}`}>Delete</button>
                    </div>
                    {expanded && (
                      <div className="chapter-block-expanded">
                        <p>{block.focus}</p>
                        <div className="mini-progress" aria-label={`${block.title} ${block.progress}%`}>
                          <span style={{ width: `${block.progress}%` }} />
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            <article className={`chapter-focus-card ${selectedChapter.status}`}>
              <div className="chapter-focus-top">
                <span>Chapter {selectedChapter.chapter}</span>
                <em>{selectedChapter.status}</em>
              </div>
              <label className="inline-editor-field">
                <span>Chapter title</span>
                <input
                  value={selectedChapter.title}
                  onChange={(event) => updateChapterBlock(selectedChapter.id, { title: event.target.value })}
                />
              </label>
              <label className="inline-editor-field">
                <span>Focus</span>
                <textarea
                  value={selectedChapter.focus}
                  onChange={(event) => updateChapterBlock(selectedChapter.id, { focus: event.target.value })}
                />
              </label>
              <div className="chapter-control-grid">
                <label className="inline-editor-field">
                  <span>Area</span>
                  <input
                    value={selectedChapter.area}
                    onChange={(event) => updateChapterBlock(selectedChapter.id, { area: event.target.value })}
                  />
                </label>
                <label className="inline-editor-field">
                  <span>Status</span>
                  <select
                    value={selectedChapter.status}
                    onChange={(event) => updateChapterBlock(selectedChapter.id, { status: event.target.value as ChapterWorkspaceBlock["status"] })}
                  >
                    <option value="ready">ready</option>
                    <option value="watch">watch</option>
                    <option value="blocked">blocked</option>
                  </select>
                </label>
                <label className="inline-editor-field">
                  <span>Progress</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={selectedChapter.progress}
                    onChange={(event) => updateChapterBlock(selectedChapter.id, { progress: Number(event.target.value) })}
                  />
                </label>
              </div>
              <label className="inline-editor-field">
                <span>Section chips</span>
                <input
                  value={selectedChapter.sections.join(", ")}
                  onChange={(event) => updateChapterBlock(selectedChapter.id, {
                    sections: event.target.value.split(",").map((item) => item.trim()).filter(Boolean)
                  })}
                />
              </label>
              <div className="chapter-section-chips">
                {selectedChapter.sections.map((section) => (
                  <span key={`${selectedChapter.id}-${section}`}>{section}</span>
                ))}
              </div>
              <div className="clause-outline-editor">
                <div className="clause-outline-head">
                  <strong>Auto numbering</strong>
                  <button type="button" onClick={() => addClause()}>Add clause</button>
                </div>
                <div className="clause-list">
                  {numberedClauses.map((clause, index) => (
                    <div className={`clause-row ${clause.status} ${selectedClauseId === clause.id ? "selected" : ""}`} key={clause.id} style={{ "--clause-depth": clause.depth } as CSSProperties}>
                      <button className="clause-number" type="button" onClick={() => addChildClause(clause.id)}>{clause.number}</button>
                      <label className="clause-title-editor">
                        <input
                          value={clause.title}
                          onFocus={() => setSelectedClauseId(clause.id)}
                          onChange={(event) => updateClauseTitle(clause.id, event.target.value)}
                        />
                        <span>Level {clause.depth}</span>
                      </label>
                      <div className="clause-actions">
                        <select
                          value={clause.status}
                          onChange={(event) => setClauseDrafts((current) => current.map((item) => (
                            item.id === clause.id ? { ...item, status: event.target.value as ClauseDraft["status"] } : item
                          )))}
                          aria-label={`${clause.title} status`}
                        >
                          <option value="draft">draft</option>
                          <option value="watch">watch</option>
                          <option value="ready">ready</option>
                        </select>
                        <button type="button" onClick={() => changeClauseDepth(clause.id, -1)} disabled={clause.depth === 1}>Out</button>
                        <button type="button" onClick={() => changeClauseDepth(clause.id, 1)} disabled={clause.depth === 4}>In</button>
                        <button type="button" onClick={() => moveClause(clause.id, -1)} disabled={index === 0}>Up</button>
                        <button type="button" onClick={() => moveClause(clause.id, 1)} disabled={index === numberedClauses.length - 1}>Down</button>
                        <button type="button" onClick={() => deleteClause(clause.id)} disabled={numberedClauses.length <= 1}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <dl>
                <div>
                  <dt>Mission</dt>
                  <dd>
                    <textarea
                      value={selectedChapter.mission}
                      onChange={(event) => updateChapterBlock(selectedChapter.id, { mission: event.target.value })}
                      aria-label={`${selectedChapter.title} mission`}
                    />
                  </dd>
                </div>
                <div>
                  <dt>Guide</dt>
                  <dd>
                    <textarea
                      value={selectedChapter.guide}
                      onChange={(event) => updateChapterBlock(selectedChapter.id, { guide: event.target.value })}
                      aria-label={`${selectedChapter.title} guide`}
                    />
                  </dd>
                </div>
              </dl>
            </article>
          </div>
        </section>

        <section className="split" id="workspace-milestones">
          <article className="panel large">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Milestones</p>
                <h2>Zero-to-completion plan</h2>
              </div>
              <span className="muted">Source scaffold phase</span>
            </div>
            <div className="milestone-table">
              <div className="table-row table-head">
                <span>No.</span>
                <span>Chapter</span>
                <span>Milestone</span>
                <span>Status</span>
                <span>Progress</span>
              </div>
              {milestones.map((item) => (
                <div className="table-row" key={`${item.id}-${item.section}`}>
                  <span>{item.section}</span>
                  <span>{item.chapter}</span>
                  <span>{item.title}</span>
                  <span className={statusClass[item.status]}>{statusLabel[item.status]}</span>
                  <span>{item.progress}%</span>
                </div>
              ))}
            </div>
          </article>

          <aside className="panel agent-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Guardrails</p>
                <h2>Runtime locks</h2>
              </div>
              <LockKeyhole size={22} />
            </div>
            <ul className="guard-list">
              <li><AlertTriangle size={16} /> DB creation is blocked until schema review.</li>
              <li><AlertTriangle size={16} /> Caddy route changes are outside the ISO product.</li>
              <li><AlertTriangle size={16} /> Services must not be started as production yet.</li>
              <li><AlertTriangle size={16} /> Paid AI providers are disabled by default.</li>
            </ul>
          </aside>
        </section>

        <section className="document-grid" id="workspace-document">
          <article className="panel document-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Document Workspace</p>
                <h2>Core sections</h2>
              </div>
              <span className="muted">Structured, not HTML blob</span>
            </div>
            <div className="section-list">
              {editableDocumentSections.map((section) => (
                <div className="section-item" key={section.id}>
                  <input
                    className="section-number-input"
                    value={section.number}
                    onChange={(event) => updateDocumentSection(section.id, { number: event.target.value })}
                    aria-label={`${section.title} number`}
                  />
                  <div className="section-edit-stack">
                    <input
                      value={section.title}
                      onChange={(event) => updateDocumentSection(section.id, { title: event.target.value })}
                      aria-label={`${section.title} title`}
                    />
                    <textarea
                      value={section.memo}
                      onChange={(event) => updateDocumentSection(section.id, { memo: event.target.value })}
                      aria-label={`${section.title} memo`}
                    />
                  </div>
                  <div className="section-state-controls">
                    <select
                      value={section.state}
                      onChange={(event) => updateDocumentSection(section.id, { state: event.target.value as DocumentSection["state"] })}
                      aria-label={`${section.title} state`}
                    >
                      <option value="locked">locked</option>
                      <option value="draft">draft</option>
                      <option value="warning">warning</option>
                      <option value="ready">ready</option>
                    </select>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={section.progress}
                      onChange={(event) => updateDocumentSection(section.id, { progress: Number(event.target.value) })}
                      aria-label={`${section.title} progress`}
                    />
                  </div>
                  <button type="button" onClick={() => deleteDocumentSection(section.id)} disabled={editableDocumentSections.length <= 1}>Delete</button>
                </div>
              ))}
            </div>
            <button className="section-add-button" type="button" onClick={addDocumentSection}>Add document section</button>
          </article>

          <article className="panel guardrail-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Cross-check</p>
                <h2>Safety gates</h2>
              </div>
              <AlertTriangle size={22} />
            </div>
            <div className="guardrail-cards">
              {guardrails.map((item) => (
                <div className={`guardrail-card ${item.severity}`} key={item.id}>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="command-grid">
          <article className="panel command-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Document Commands</p>
                <h2>Editor action flow</h2>
              </div>
              <FileText size={22} />
            </div>
            <div className="command-list">
              {documentCommandSteps.map((step) => (
                <div className={`command-item ${step.state}`} key={step.id}>
                  <div>
                    <strong>{step.command}</strong>
                    <span>{step.actor}</span>
                  </div>
                  <ol>
                    {step.sequence.map((item) => (
                      <li key={`${step.id}-${item}`}>{item}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </article>

          <article className="panel impact-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Impact Preview</p>
                <h2>Before canonical write</h2>
              </div>
              <PanelRight size={22} />
            </div>
            <div className="impact-list">
              {documentImpactPreview.map((item) => (
                <div className={`impact-item ${item.severity}`} key={item.id}>
                  <div>
                    <strong>{item.area}</strong>
                    <span>{item.current}</span>
                  </div>
                  <p>{item.impact}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="panel change-impact-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Change Impact Report</p>
              <h2>Stage-aware edit risk before submit</h2>
            </div>
            <PanelRight size={22} />
          </div>
          <div className="change-impact-grid">
            {changeImpactSignals.map((signal) => (
              <article className={`change-impact-card ${signal.risk}`} key={signal.id}>
                <div>
                  <strong>{signal.element}</strong>
                  <span>{signal.stage} / {signal.risk}</span>
                </div>
                <p>{signal.checks}</p>
                <em>{signal.action}</em>
              </article>
            ))}
          </div>
        </section>

        <section className="panel section-risk-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Section Risk Matrix</p>
              <h2>OSD-sensitive text areas</h2>
            </div>
            <AlertTriangle size={22} />
          </div>
          <div className="section-risk-grid">
            {sectionRiskSignals.map((signal) => (
              <article className={`section-risk-card ${signal.risk}`} key={signal.id}>
                <div className="section-risk-top">
                  <strong>{signal.section}</strong>
                  <span>{signal.risk}</span>
                </div>
                <p>{signal.warning}</p>
                <dl>
                  <div>
                    <dt>OSD focus</dt>
                    <dd>{signal.osdFocus}</dd>
                  </div>
                  <div>
                    <dt>Control</dt>
                    <dd>{signal.control}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="panel state-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Workspace State</p>
              <h2>Editor, history and AI proposal status</h2>
            </div>
            <LockKeyhole size={22} />
          </div>
          <div className="state-grid">
            {workspaceStateSignals.map((signal) => (
              <article className={`state-card ${signal.status}`} key={signal.id}>
                <span>{signal.label}</span>
                <strong>{signal.value}</strong>
                <p>{signal.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel project-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Project Workspace</p>
              <h2>Draft project setup</h2>
            </div>
            <span className="muted">Browser-saved working state</span>
          </div>
          <div className="project-form-grid">
            <label className="field-preview editable">
              <span>title</span>
              <input value={editableProjectDraft.title} onChange={(event) => updateProjectDraft("title", event.target.value)} />
            </label>
            <label className="field-preview editable">
              <span>deliverableType</span>
              <select value={editableProjectDraft.deliverableType} onChange={(event) => updateProjectDraft("deliverableType", event.target.value)}>
                <option value="IS">IS</option>
                <option value="TS">TS</option>
                <option value="TR">TR</option>
                <option value="PAS/IWA">PAS/IWA</option>
              </select>
            </label>
            <label className="field-preview editable">
              <span>stage</span>
              <select value={editableProjectDraft.stage} onChange={(event) => updateProjectDraft("stage", event.target.value)}>
                <option value="PWI">PWI</option>
                <option value="NP">NP</option>
                <option value="WD">WD</option>
                <option value="CD">CD</option>
                <option value="DIS">DIS</option>
                <option value="FDIS">FDIS</option>
              </select>
            </label>
            <label className="field-preview editable">
              <span>track</span>
              <select value={editableProjectDraft.track} onChange={(event) => updateProjectDraft("track", event.target.value)}>
                <option value="MONTHS_36">MONTHS_36</option>
                <option value="MONTHS_24">MONTHS_24</option>
                <option value="MONTHS_18">MONTHS_18</option>
              </select>
            </label>
            <label className="field-preview editable">
              <span>committee</span>
              <input value={editableProjectDraft.committee} onChange={(event) => updateProjectDraft("committee", event.target.value)} />
            </label>
          </div>
        </section>

        <section className="panel workspace-contract-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Workspace Contract</p>
              <h2>Independent ISO project surfaces</h2>
            </div>
            <Network size={22} />
          </div>
          <div className="surface-grid">
            {workspaceSurfaces.map((surface) => (
              <article className={`surface-card ${surface.status}`} key={surface.id}>
                <strong>{surface.title}</strong>
                <span>{surface.status}</span>
                <div className="mini-progress" aria-label={`${surface.title} target ${surface.target}%`}>
                  <span style={{ width: `${surface.target}%` }} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel deliverable-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Deliverable Types</p>
              <h2>IS, TS, TR and accelerated route guidance</h2>
            </div>
            <BookOpenCheck size={22} />
          </div>
          <div className="deliverable-grid">
            {deliverableGuidelineSignals.map((signal) => (
              <article className={`deliverable-card ${signal.status}`} key={signal.type}>
                <div className="deliverable-top">
                  <span>{signal.type}</span>
                  <em>{signal.track}</em>
                </div>
                <strong>{signal.label}</strong>
                <p>{signal.warning}</p>
                <dl>
                  <div>
                    <dt>Posture</dt>
                    <dd>{signal.posture}</dd>
                  </div>
                  <div>
                    <dt>Export focus</dt>
                    <dd>{signal.exportFocus}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="wide-grid" id="workspace-roadmap">
          <article className="panel roadmap-diary">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Roadmap Diary</p>
                <h2>Stage mission themes</h2>
              </div>
              <Route size={22} />
            </div>
            <div className="timeline-list">
              {roadmapEvents.map((event) => (
                <div className="timeline-item" key={event.id}>
                  <div className="timeline-stage">{event.stage}</div>
                  <div>
                    <strong>{event.mission}</strong>
                    <span>{event.timing}</span>
                  </div>
                  <div className="mini-progress" aria-label={`${event.stage} progress ${event.progress}%`}>
                    <span style={{ width: `${event.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="panel runtime-panel" id="workspace-hp">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Runtime Gates</p>
                <h2>Enablement status</h2>
              </div>
              <KeyRound size={22} />
            </div>
            <div className="runtime-list">
              {runtimeGates.map((gate) => (
                <div className={`runtime-item ${gate.status}`} key={gate.id}>
                  <strong>{gate.target}</strong>
                  <span>{gate.risk}</span>
                  <em>{gate.status}</em>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="roadmap-control-grid">
          <article className="panel track-risk-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Track Compression</p>
                <h2>18/24/36 month change risk</h2>
              </div>
              <Route size={22} />
            </div>
            <div className="track-risk-list">
              {trackRiskSignals.map((signal) => (
                <div className={`track-risk-item ${signal.risk}`} key={signal.id}>
                  <div>
                    <strong>{signal.stage}</strong>
                    <span>{signal.dateDelta}</span>
                  </div>
                  <p>{signal.mission}</p>
                  <em>{signal.readiness}</em>
                </div>
              ))}
            </div>
          </article>

          <article className="panel procedure-window-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Procedure Windows</p>
                <h2>Verified duration inputs</h2>
              </div>
              <AlertTriangle size={22} />
            </div>
            <div className="window-list">
              {procedureWindows.map((window) => (
                <div className="window-item" key={window.id}>
                  <strong>{window.label}</strong>
                  <span>{window.status}</span>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="panel calendar-mission-panel" id="workspace-schedule">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Calendar Mission Overlay</p>
              <h2>Meeting and decision checkpoint priorities</h2>
            </div>
            <Route size={22} />
          </div>
          <div className="calendar-mission-grid">
            {calendarMissionSignals.map((signal) => (
              <article className={`calendar-mission-card ${signal.urgency}`} key={signal.id}>
                <div className="calendar-mission-top">
                  <span>{signal.stage}</span>
                  <strong>{signal.daysUntil}d</strong>
                </div>
                <h3>{signal.checkpoint}</h3>
                <p>{signal.mission}</p>
                <em>{signal.missing}</em>
              </article>
            ))}
          </div>
        </section>

        <section className="panel participation-panel" id="workspace-members">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Participation Ledger</p>
              <h2>Meeting missions and objection posture</h2>
            </div>
            <Network size={22} />
          </div>
          <div className="participation-grid">
            {meetingLedgerSignals.map((signal) => (
              <article className={`participation-card ${signal.status}`} key={signal.id}>
                <div className="participation-top">
                  <span>{signal.stage}</span>
                  <em>{signal.status}</em>
                </div>
                <strong>{signal.meeting}</strong>
                <p>{signal.participation}</p>
                <dl>
                  <div>
                    <dt>Intent</dt>
                    <dd>{signal.objectionIntent}</dd>
                  </div>
                  <div>
                    <dt>Boundary</dt>
                    <dd>{signal.cooperationBoundary}</dd>
                  </div>
                  <div>
                    <dt>Mission</dt>
                    <dd>{signal.nextMission}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="panel supporting-panel" id="workspace-references">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Supporting Materials</p>
              <h2>References, terms and editable sources</h2>
            </div>
            <Database size={22} />
          </div>
          <div className="supporting-grid">
            {supportingMaterialSignals.map((signal) => (
              <article className={`supporting-card ${signal.status}`} key={signal.id}>
                <div>
                  <strong>{signal.area}</strong>
                  <span>{signal.score}% ready</span>
                </div>
                <p>{signal.detail}</p>
                <div className="mini-progress" aria-label={`${signal.area} ${signal.score}%`}>
                  <span style={{ width: `${signal.score}%` }} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel source-use-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Source Use Decisions</p>
              <h2>Reference influence before bibliography binding</h2>
            </div>
            <Database size={22} />
          </div>
          <div className="source-use-grid">
            {sourceUseSignals.map((signal) => (
              <article className={`source-use-card ${signal.status}`} key={signal.id}>
                <div>
                  <strong>{signal.source}</strong>
                  <span>{signal.mode}</span>
                </div>
                <p>{signal.target}</p>
                <em>{signal.trace}</em>
              </article>
            ))}
          </div>
        </section>

        <section className="panel export-gate-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Export Gate</p>
              <h2>DOCX, OSD and source package readiness</h2>
            </div>
            <FileText size={22} />
          </div>
          <div className="export-gate-grid">
            {exportGateSignals.map((signal) => (
              <article className={`export-gate-card ${signal.status}`} key={signal.id}>
                <strong>{signal.label}</strong>
                <p>{signal.detail}</p>
                <span>{signal.status}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="panel formal-package-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Formal Package</p>
              <h2>DIS and publication evidence map</h2>
            </div>
            <BookOpenCheck size={22} />
          </div>
          <div className="formal-package-grid">
            {formalPackageSignals.map((signal) => (
              <article className={`formal-package-card ${signal.status}`} key={signal.id}>
                <div>
                  <strong>{signal.label}</strong>
                  <span>{signal.status}</span>
                </div>
                <p>{signal.evidence}</p>
                <em>{signal.blocker}</em>
              </article>
            ))}
          </div>
        </section>

        <section className="panel ai-gate-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">AI Preflight</p>
              <h2>Provider, budget and source policy gates</h2>
            </div>
            <Sparkles size={22} />
          </div>
          <div className="ai-gate-grid">
            {aiGateSignals.map((signal) => (
              <article className={`ai-gate-card ${signal.status}`} key={signal.id}>
                <div>
                  <strong>{signal.label}</strong>
                  <span>{signal.provider}</span>
                </div>
                <p>{signal.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel chief-agent-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Chief Agent Council</p>
              <h2>Specialist coordination and generated agents</h2>
            </div>
            <Sparkles size={22} />
          </div>
          <div className="chief-agent-grid">
            {activeChiefSignals.map((signal) => (
              <article className={`chief-agent-card ${signal.activation}`} key={signal.id}>
                <div>
                  <strong>{signal.label}</strong>
                  <span>{signal.activation}</span>
                </div>
                <p>{signal.scope}</p>
                <em>{signal.brief}</em>
              </article>
            ))}
          </div>
        </section>

        <section className="panel brain-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Agent Brain Panel</p>
              <h2>Chief summary, conflicts, missions and decisions</h2>
            </div>
            <Sparkles size={22} />
          </div>
          <div className="brain-panel-layout">
            <div className="brain-summary-grid">
              {activeBrainSignals.map((signal) => (
                <article className={`brain-summary-card ${signal.status}`} key={signal.id}>
                  <span>{signal.label}</span>
                  <strong>{signal.value}</strong>
                  <p>{signal.detail}</p>
                </article>
              ))}
            </div>
            <div className="brain-mission-board">
              <div className="brain-board-section">
                <strong>Specialist opinions</strong>
                <div className="brain-opinion-grid">
                  {activeBrainOpinions.map((opinion) => (
                    <article className={`brain-opinion-card ${opinion.stance}`} key={opinion.id}>
                      <div>
                        <strong>{opinion.specialist}</strong>
                        <span>{opinion.stance}</span>
                      </div>
                      <p>{opinion.finding}</p>
                      <em>{opinion.recommendation}</em>
                    </article>
                  ))}
                </div>
              </div>
              <div className="brain-board-section">
                <strong>Conflict board</strong>
                <div className="brain-conflict-list">
                  {activeBrainConflicts.map((conflict) => (
                    <article className={`brain-conflict-item ${conflict.severity}`} key={conflict.id}>
                      <div>
                        <strong>{conflict.topic}</strong>
                        <span>{conflict.severity}</span>
                      </div>
                      <p>{conflict.tension}</p>
                      <em>{conflict.chiefResolution}</em>
                    </article>
                  ))}
                </div>
              </div>
              <div className="brain-board-section">
                <strong>Evidence links</strong>
                <div className="brain-evidence-list">
                  {activeBrainEvidence.map((evidence) => (
                    <article className={`brain-evidence-item ${evidence.sourceType}`} key={evidence.id}>
                      <span>{evidence.sourceType}</span>
                      <strong>{evidence.label}</strong>
                      <p>{evidence.usage}</p>
                    </article>
                  ))}
                </div>
              </div>
              <div className="brain-board-section">
                <strong>Mission queue</strong>
                <div className="brain-mission-list">
                  {activeBrainMissions.map((mission) => (
                    <div className={`brain-mission-item ${mission.priority}`} key={mission.id}>
                      <span>{mission.priority}</span>
                      <strong>{mission.title}</strong>
                      <em>{mission.owner} / {mission.status}</em>
                    </div>
                  ))}
                </div>
              </div>
              <div className="brain-decision-strip">
                <button type="button" onClick={() => recordBrainDecision("Accept proposal", "Move proposal into editor review queue.")}>Accept proposal</button>
                <button type="button" onClick={() => recordBrainDecision("Defer", "Hold finding until specialist review improves evidence.")}>Defer</button>
                <button type="button" onClick={() => recordBrainDecision("Memo", "Create a review memo for the active clause.")}>Memo</button>
                <button type="button" onClick={() => recordBrainDecision("Assign specialist", "Create a specialist task for the active chapter.")}>Assign specialist</button>
              </div>
              <p className="brain-decision-note">{brainDecision}</p>
              <div className="brain-board-section">
                <strong>Action log</strong>
                <div className="brain-action-log">
                  {brainDecisionLog.map((item) => (
                    <article className="brain-action-item" key={item.id}>
                      <span>{item.action}</span>
                      <strong>{item.target}</strong>
                      <p>{item.result}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="panel ai-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">AI Agent Layer</p>
              <h2>Pre-OSD authoring assistants</h2>
            </div>
            <Sparkles size={22} />
          </div>
          <div className="ai-grid">
            {aiCapabilities.map((capability) => (
              <article className={`ai-card ${capability.status}`} key={capability.id}>
                <PanelRight size={18} />
                <strong>{capability.title}</strong>
                <p>{capability.purpose}</p>
                <span>{capability.provider}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="panel acceptance-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Delivery Map</p>
              <h2>25 chapter completion control</h2>
            </div>
            <Route size={22} />
          </div>
          <div className="delivery-map-grid">
            {deliveryMapSignals.map((item) => (
              <article className={`delivery-map-card ${item.status}`} key={`${item.chapter}-${item.phase}`}>
                <div className="delivery-map-top">
                  <span>Ch. {item.chapter}</span>
                  <em>Phase {item.phase}</em>
                </div>
                <strong>{item.title}</strong>
                <div className="mini-progress" aria-label={`${item.title} ${item.progress}%`}>
                  <span style={{ width: `${item.progress}%` }} />
                </div>
                <p>{item.next}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel acceptance-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Acceptance Gates</p>
              <h2>Evidence before production claims</h2>
            </div>
            <BookOpenCheck size={22} />
          </div>
          <div className="acceptance-grid">
            {acceptanceGateSignals.map((gate) => (
              <article className={`acceptance-card ${gate.status}`} key={gate.id}>
                <div>
                  <strong>{gate.label}</strong>
                  <span>Blocks: {gate.blocks}</span>
                </div>
                <div className="mini-progress" aria-label={`${gate.label} ${gate.progress}%`}>
                  <span style={{ width: `${gate.progress}%` }} />
                </div>
                <em>{gate.progress}% evidence</em>
              </article>
            ))}
          </div>
        </section>

        <section className="panel view-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Editor View</p>
              <h2>Page layout modes</h2>
            </div>
            <span className="muted">Active: {activeViewMode}</span>
          </div>
          <div className="view-mode-grid">
            {viewModes.map((mode) => (
              <button
                className={`view-mode ${activeViewMode === mode.id ? "active" : ""}`}
                key={mode.id}
                type="button"
                onClick={() => setActiveViewMode(mode.id as ViewMode)}
              >
                <strong>{mode.label}</strong>
                <span>{mode.pages} page workspace preview</span>
              </button>
            ))}
          </div>
          <div className={`page-preview-grid mode-${activeViewMode}`}>
            {Array.from({ length: viewModes.find((mode) => mode.id === activeViewMode)?.pages || 1 }).map((_, index) => (
              <article className="page-preview" key={`page-${index}`}>
                <span>Page {index + 1}</span>
                <strong>{selectedChapter.title}</strong>
                <p>{selectedClause.number} {selectedClause.title}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className="site-footer">
          UCONAI STANDARD 2026
        </footer>
      </section>
      <button className="back-to-top" type="button" onClick={scrollToTop} aria-label="Move to top" style={topButtonStyle}>
        <ChevronUp size={20} />
      </button>
      <button
        className={`mobile-agent-toggle ${isMobileAgentOpen ? "active" : ""}`}
        type="button"
        onClick={() => setIsMobileAgentOpen((current) => !current)}
        aria-label="Open AI Commander"
        aria-expanded={isMobileAgentOpen}
        style={agentButtonStyle}
      >
        <Sparkles size={20} />
      </button>
      <div className={`mobile-agent-drawer ${isMobileAgentOpen ? "open" : ""}`}>
        <div className="mobile-agent-drawer-head">
          <strong>AI Commander</strong>
          <button type="button" onClick={() => setIsMobileAgentOpen(false)}>Close</button>
        </div>
        {renderSuperAgentChat("mobile-ai-chat")}
      </div>
    </main>
  );
}

