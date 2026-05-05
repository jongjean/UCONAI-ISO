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
