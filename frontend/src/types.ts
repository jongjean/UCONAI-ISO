export type MilestoneStatus = "planned" | "blocked" | "ready" | "done";

export type Milestone = {
  id: string;
  chapter: string;
  section: string;
  title: string;
  owner: string;
  status: MilestoneStatus;
  progress: number;
};

export type DashboardMetric = {
  label: string;
  value: string;
  tone: "neutral" | "good" | "warn" | "danger";
};

export type DocumentSection = {
  id: string;
  number: string;
  title: string;
  state: "locked" | "draft" | "warning" | "ready";
  progress: number;
  memo: string;
};

export type ChapterWorkspaceBlock = {
  id: string;
  chapter: number;
  title: string;
  area: string;
  progress: number;
  status: "ready" | "watch" | "blocked";
  focus: string;
  sections: string[];
  mission: string;
  guide: string;
};

export type Guardrail = {
  id: string;
  title: string;
  detail: string;
  severity: "info" | "warning" | "blocked";
};

export type RuntimeGate = {
  id: string;
  target: string;
  risk: string;
  status: "locked" | "ready" | "later";
};

export type WorkspaceSurface = {
  id: string;
  title: string;
  status: "preview-ready" | "contract-ready" | "locked";
  target: number;
};

export type AiCapability = {
  id: string;
  title: string;
  purpose: string;
  provider: string;
  status: "design" | "blocked" | "ready";
};

export type RoadmapEvent = {
  id: string;
  stage: string;
  mission: string;
  timing: string;
  progress: number;
};

export type CalendarMissionSignal = {
  id: string;
  stage: string;
  checkpoint: string;
  daysUntil: number;
  urgency: "ready" | "watch" | "urgent" | "overdue";
  missing: string;
  mission: string;
};

export type ProjectDraft = {
  title: string;
  deliverableType: string;
  stage: string;
  track: string;
  committee: string;
};

export type DeliverableGuidelineSignal = {
  type: string;
  label: string;
  posture: string;
  track: string;
  warning: string;
  exportFocus: string;
  status: "ready" | "watch" | "blocked";
};

export type ViewMode = "one" | "two" | "four";

export type DocumentCommandStep = {
  id: string;
  command: string;
  actor: string;
  sequence: string[];
  state: "ready" | "blocked" | "watch";
};

export type DocumentImpactItem = {
  id: string;
  area: string;
  current: string;
  impact: string;
  severity: "info" | "warning" | "blocked";
};

export type ChangeImpactSignal = {
  id: string;
  element: string;
  stage: string;
  risk: "low" | "medium" | "high";
  checks: string;
  action: string;
};

export type SectionRiskSignal = {
  id: string;
  section: string;
  osdFocus: string;
  control: string;
  warning: string;
  risk: "medium" | "high";
};

export type WorkspaceStateSignal = {
  id: string;
  label: string;
  value: string;
  detail: string;
  status: "active" | "watch" | "locked";
};

export type TrackRiskSignal = {
  id: string;
  stage: string;
  dateDelta: string;
  readiness: string;
  mission: string;
  risk: "low" | "medium" | "high";
};

export type MeetingLedgerSignal = {
  id: string;
  meeting: string;
  stage: string;
  participation: string;
  objectionIntent: string;
  cooperationBoundary: string;
  nextMission: string;
  status: "ready" | "watch" | "blocked";
};

export type SupportingMaterialSignal = {
  id: string;
  area: string;
  score: number;
  detail: string;
  status: "ready" | "watch" | "blocked";
};

export type SourceUseSignal = {
  id: string;
  source: string;
  mode: "exclude" | "summarize" | "compare" | "limited-quote" | "pending";
  target: string;
  trace: string;
  status: "ready" | "watch" | "blocked";
};

export type ExportGateSignal = {
  id: string;
  label: string;
  detail: string;
  status: "ready" | "watch" | "blocked";
};

export type FormalPackageSignal = {
  id: string;
  label: string;
  evidence: string;
  blocker: string;
  status: "ready" | "watch" | "blocked";
};

export type AiGateSignal = {
  id: string;
  label: string;
  provider: string;
  detail: string;
  status: "ready" | "watch" | "blocked";
};

export type ChiefAgentSignal = {
  id: string;
  label: string;
  scope: string;
  activation: "always-on" | "active" | "watch" | "standby";
  brief: string;
};

export type BrainPanelSignal = {
  id: string;
  label: string;
  value: string;
  detail: string;
  status: "ready" | "watch" | "blocked";
};

export type BrainMissionSignal = {
  id: string;
  title: string;
  owner: string;
  priority: "high" | "medium" | "low";
  status: "open" | "ready" | "deferred";
};

export type BrainOpinionSignal = {
  id: string;
  specialist: string;
  stance: "support" | "revise" | "hold";
  finding: string;
  recommendation: string;
};

export type BrainConflictSignal = {
  id: string;
  topic: string;
  tension: string;
  chiefResolution: string;
  severity: "low" | "medium" | "high";
};

export type BrainEvidenceSignal = {
  id: string;
  label: string;
  sourceType: "rule" | "project" | "reference" | "meeting";
  usage: string;
};

export type BrainDecisionLogSignal = {
  id: string;
  action: string;
  target: string;
  result: string;
};

export type AcceptanceGateSignal = {
  id: string;
  label: string;
  progress: number;
  blocks: string;
  status: "ready" | "watch" | "blocked";
};

export type DeliveryMapSignal = {
  chapter: string;
  title: string;
  phase: string;
  progress: number;
  status: "ready" | "watch" | "blocked";
  next: string;
};

