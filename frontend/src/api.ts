export type ApiProbeState = {
  status: "checking" | "connected" | "offline";
  baseUrl: string;
  health: string;
  routes: number;
  progress: number | null;
  message: string;
};

const defaultProbeState: ApiProbeState = {
  status: "checking",
  baseUrl: "/iso/api/v1",
  health: "checking",
  routes: 0,
  progress: null,
  message: "Checking ISO API preview connection."
};

export type AiCommanderRequest = {
  prompt: string;
  messages: Array<{ speaker: "user" | "super-agent"; text: string }>;
  context: object;
};

export type AiCommanderResponse = {
  provider: string;
  model: string;
  text: string;
  grounding?: EvidenceGroundingResponse;
  projectMemory?: ProjectMemorySnapshotResponse;
};

export type NDocumentAnalysisResponse = {
  id: string;
  fileName: string;
  uploadedAt: string;
  eventType: "presentation" | "decision" | "meeting" | "plenary" | "circulation" | "vote" | "regulation" | "reference";
  stage: string;
  confidence: "low" | "medium" | "high";
  summary: string;
  contentPreview: string;
  done: string[];
  todo: string[];
  risks: string[];
  scheduleSignals: string[];
  referenceSignals: string[];
  dates: string[];
  chunks: Array<{
    id: string;
    fileName: string;
    text: string;
    keywords: string[];
    stageHints: string[];
    eventHints: string[];
  }>;
  matchedTerms: Array<{ stage: string; terms: string[] }>;
  storageRef?: string;
};

export type StageAssessmentResponse = {
  currentStage: string;
  progress: number;
  stageEvidence: Record<string, number>;
  latestEvidence: null | {
    fileName: string;
    eventType: string;
    stage: string;
    summary: string;
  };
  nextActions: string[];
  missingEvidence: string[];
};

export type ProjectControlSnapshotResponse = {
  stageAssessment: StageAssessmentResponse;
  actionItems: string[];
  risks: string[];
  scheduleSignals: string[];
  referenceSignals: string[];
  dates: string[];
  commanderBrief: string[];
};

export type EvidenceGroundingResponse = {
  query: string;
  sourceCount: number;
  grounded: boolean;
  answerBasis: Array<{ fileName: string; stage: string; eventType: string; excerpt: string }>;
  requiredResponseContract: string[];
};

export type ProjectMemorySnapshotResponse = {
  id: string;
  createdAt: string;
  setupCompletion: number;
  stageAssessment: StageAssessmentResponse;
  fieldLedger: {
    totalFields: number;
    filledFields: number;
    emptyFields: string[];
    recentChanges: Array<{ id: string; field: string; previousValue: string; nextValue: string; changedAt: string; source: "wizard" | "ai" | "import" }>;
  };
  evidenceLedger: Array<{ id: string; fileName: string; stage: string; eventType: string; summary: string }>;
  decisionLedger: Array<{ id: string; question: string; answer: string; createdAt: string; basisCount: number }>;
  restoreContract: {
    recoverable: boolean;
    restoreTargets: string[];
    note: string;
  };
};

function timeoutSignal(milliseconds: number) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), milliseconds);
  return { signal: controller.signal, cancel: () => window.clearTimeout(timer) };
}

async function fetchJson(path: string, options: RequestInit = {}, timeoutMs = 2500) {
  const guard = timeoutSignal(timeoutMs);
  try {
    const response = await fetch(path, { ...options, signal: guard.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } finally {
    guard.cancel();
  }
}

export async function runAiCommander(request: AiCommanderRequest): Promise<AiCommanderResponse> {
  const baseUrl = (import.meta.env.VITE_ISO_API_BASE_URL || "/iso/api/v1").replace(/\/$/, "");
  const payload = await fetchJson(`${baseUrl}/ai/commander`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(request)
  }, 45000);
  return payload.data as AiCommanderResponse;
}

export async function analyzeNDocument(request: {
  fileName: string;
  contentText: string;
  fallbackStage: string;
}): Promise<NDocumentAnalysisResponse> {
  const baseUrl = (import.meta.env.VITE_ISO_API_BASE_URL || "/iso/api/v1").replace(/\/$/, "");
  const payload = await fetchJson(`${baseUrl}/n-documents/analyze`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(request)
  }, 15000);
  return payload.data as NDocumentAnalysisResponse;
}

export async function buildStageAssessment(request: {
  currentStage: string;
  nDocuments: object[];
}): Promise<StageAssessmentResponse> {
  const baseUrl = (import.meta.env.VITE_ISO_API_BASE_URL || "/iso/api/v1").replace(/\/$/, "");
  const payload = await fetchJson(`${baseUrl}/n-documents/stage-assessment`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(request)
  }, 8000);
  return payload.data as StageAssessmentResponse;
}

export async function buildProjectControlSnapshot(request: {
  currentStage: string;
  nDocuments: object[];
}): Promise<ProjectControlSnapshotResponse> {
  const baseUrl = (import.meta.env.VITE_ISO_API_BASE_URL || "/iso/api/v1").replace(/\/$/, "");
  const payload = await fetchJson(`${baseUrl}/n-documents/project-control-snapshot`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(request)
  }, 8000);
  return payload.data as ProjectControlSnapshotResponse;
}

export async function queryNDocumentKnowledge(request: {
  query: string;
  nDocuments: object[];
}): Promise<{
  query: string;
  queryKeywords: string[];
  results: object[];
  answerBasis: Array<{ fileName: string; stage: string; eventType: string; excerpt: string }>;
}> {
  const baseUrl = (import.meta.env.VITE_ISO_API_BASE_URL || "/iso/api/v1").replace(/\/$/, "");
  const payload = await fetchJson(`${baseUrl}/n-documents/rag-query`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(request)
  }, 8000);
  return payload.data;
}

export async function buildEvidenceGrounding(request: {
  query: string;
  nDocuments: object[];
}): Promise<EvidenceGroundingResponse> {
  const baseUrl = (import.meta.env.VITE_ISO_API_BASE_URL || "/iso/api/v1").replace(/\/$/, "");
  const payload = await fetchJson(`${baseUrl}/n-documents/evidence-grounding`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(request)
  }, 8000);
  return payload.data as EvidenceGroundingResponse;
}

export async function buildProjectMemorySnapshot(request: {
  currentStage: string;
  standardSetup: object;
  projectDraft: object;
  nDocuments: object[];
  fieldChangeLog: object[];
  decisions: object[];
}): Promise<ProjectMemorySnapshotResponse> {
  const baseUrl = (import.meta.env.VITE_ISO_API_BASE_URL || "/iso/api/v1").replace(/\/$/, "");
  const payload = await fetchJson(`${baseUrl}/n-documents/project-memory-snapshot`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(request)
  }, 8000);
  return payload.data as ProjectMemorySnapshotResponse;
}

export async function probeIsoApi(): Promise<ApiProbeState> {
  const baseUrl = (import.meta.env.VITE_ISO_API_BASE_URL || "/iso/api/v1").replace(/\/$/, "");

  try {
    const [health, routes, progress] = await Promise.all([
      fetchJson(`${baseUrl.replace(/\/api\/v1$/, "")}/health`),
      fetchJson(`${baseUrl}/routes`),
      fetchJson(`${baseUrl}/policy/development-progress-map`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ evidence: ["chapter-21"] })
      })
    ]);

    return {
      status: "connected",
      baseUrl,
      health: health.status || "ok",
      routes: Array.isArray(routes.data?.routes) ? routes.data.routes.length : 0,
      progress: typeof progress.data?.totalProgress === "number" ? progress.data.totalProgress : null,
      message: "API preview is responding. Source-only runtime checks are available."
    };
  } catch {
    return {
      ...defaultProbeState,
      status: "offline",
      baseUrl,
      health: "offline",
      message: "Frontend preview is open, but the ISO API preview is not connected on this browser path."
    };
  }
}
