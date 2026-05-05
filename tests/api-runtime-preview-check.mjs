import { createServer } from "http";

function fail(message) {
  console.error(message);
  process.exit(1);
}

let createApp;
try {
  ({ createApp } = await import("../backend/src/app.js"));
} catch (error) {
  if (error?.code === "ERR_MODULE_NOT_FOUND") {
    console.log("ISO API runtime preview check skipped because backend dependencies are not installed locally");
    process.exit(0);
  }
  throw error;
}

const app = createApp();
const server = createServer(app);

function listen() {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve(server.address()));
  });
}

function close() {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

async function requestJson(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method || "GET",
    headers: { "content-type": "application/json" },
    body: options.body === undefined ? undefined : JSON.stringify(options.body)
  });
  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    fail(`Non-JSON response from ${path}: ${text.slice(0, 120)}`);
  }
  return { response, json };
}

const address = await listen();
const baseUrl = `http://${address.address}:${address.port}`;

try {
  const cases = [
    { path: "/health", expectStatus: 200, expectField: "status" },
    { path: "/api/v1/routes", expectStatus: 200, expectOk: true },
    { path: "/api/v1/config-status/execution-modes", expectStatus: 200, expectOk: true },
    {
      path: "/api/v1/documents/workspace-state-preview",
      method: "POST",
      body: { projectId: "preview", user: { id: "u1" }, lock: { id: "l1", userId: "u1" } },
      expectStatus: 200,
      expectOk: true
    },
    {
      path: "/api/v1/documents/section-risk-matrix",
      method: "POST",
      body: { stage: "DIS" },
      expectStatus: 200,
      expectOk: true
    },
    {
      path: "/api/v1/projects/deliverable-guidelines",
      method: "POST",
      body: { deliverableType: "TR", stage: "DIS" },
      expectStatus: 200,
      expectOk: true
    },
    {
      path: "/api/v1/ai/preflight-gate",
      method: "POST",
      body: { agent: "drafting", task: "drafting" },
      expectStatus: 200,
      expectOk: true
    },
    {
      path: "/api/v1/agents/chief-control-plan",
      method: "POST",
      body: {
        stage: "DIS",
        activeChapter: { chapter: 7, title: "Frontend foundation", area: "UI" },
        issues: [{ area: "UI", type: "consistency", message: "Chapter block work needs specialist review." }]
      },
      expectStatus: 200,
      expectOk: true
    },
    {
      path: "/api/v1/agents/brain-panel-preview",
      method: "POST",
      body: {
        stage: "DIS",
        activeChapter: { chapter: 17, title: "Figures, tables and editable sources", area: "Figures" },
        issues: [{ area: "Figures", type: "editable-source", message: "figure source blocker" }],
        evidence: [{ sourceType: "project-policy", title: "Editable source rule", targetElement: "Figure 1" }]
      },
      expectStatus: 200,
      expectOk: true
    },
    {
      path: "/api/v1/ai/unified-compute-policy",
      method: "POST",
      body: { workload: "agent-council-preview", expectedConcurrency: 1 },
      expectStatus: 200,
      expectOk: true
    },
    {
      path: "/api/v1/policy/acceptance-gate-matrix",
      method: "POST",
      body: { evidence: ["npm-check", "phase-checks", "source-noise-check"] },
      expectStatus: 200,
      expectOk: true
    },
    {
      path: "/api/v1/policy/development-progress-map",
      method: "POST",
      body: { evidence: ["chapter-21"] },
      expectStatus: 200,
      expectOk: true
    },
    {
      path: "/api/v1/figures/source-blueprint",
      method: "POST",
      body: {
        diagramType: "venn",
        title: "Editable Venn source",
        nodes: [
          { id: "a", text: "A", shape: "ellipse" },
          { id: "b", text: "B", shape: "ellipse" }
        ]
      },
      expectStatus: 200,
      expectOk: true
    },
    {
      path: "/api/v1/references/endnote-binding-plan",
      method: "POST",
      body: {
        stage: "DIS",
        candidates: [
          { title: "Reference A", elementStableKey: "clause-5", noteText: "Supports the requirement boundary." }
        ]
      },
      expectStatus: 200,
      expectOk: true
    },
    {
      path: "/api/v1/references/source-use-decision-report",
      method: "POST",
      body: {
        stage: "DIS",
        targetElements: [{ stableKey: "scope", section: "Scope" }],
        references: [
          { title: "Reference A", documentType: "ISO", aiUseMode: "COMPARE", bibliographyCandidate: true, linkedElementStableKey: "scope" },
          { title: "Reference B", documentType: "PAPER", aiUseMode: "EXCLUDE" }
        ]
      },
      expectStatus: 200,
      expectOk: true
    },
    {
      path: "/api/v1/reviews/meeting-participation-ledger",
      method: "POST",
      body: {
        stage: "CD",
        meetings: [{ title: "CD review", participants: ["Expert A"], presented: true, circulated: false }],
        actors: [{ name: "Expert A", posture: "OPPOSE", concernLevel: "high" }],
        comments: [{ meetingTitle: "CD review", origin: "Expert A", comment: "The scope is too broad." }]
      },
      expectStatus: 200,
      expectOk: true
    },
    {
      path: "/api/v1/roadmap/calendar-mission-overlay",
      method: "POST",
      body: {
        track: "MONTHS_24",
        startDate: "2026-01-01",
        today: "2026-05-04",
        meetings: [{ stage: "CD", title: "CD review", startsAt: "2026-05-20" }],
        evidence: { committeeDraft: true }
      },
      expectStatus: 200,
      expectOk: true
    },
    {
      path: "/api/v1/exports/source-package-binding-report",
      method: "POST",
      body: {
        stage: "FDIS",
        figures: [
          {
            label: "Figure 1",
            deliverables: ["preview.png", "source.pptx", "source-manifest.json"]
          }
        ]
      },
      expectStatus: 200,
      expectOk: true
    },
    {
      path: "/api/v1/versions/change-impact-report",
      method: "POST",
      body: {
        stage: "DIS",
        changes: [
          { elementStableKey: "scope", elementType: "SCOPE", field: "content", after: "Updated scope boundary." },
          { elementStableKey: "fig-1", elementType: "FIGURE", field: "content", after: "Updated figure text." }
        ]
      },
      expectStatus: 200
    }
  ];

  for (const item of cases) {
    const { response, json } = await requestJson(baseUrl, item.path, item);
    if (response.status !== item.expectStatus) {
      fail(`${item.path} returned ${response.status}, expected ${item.expectStatus}`);
    }
    if (item.expectOk === true && json.ok !== true) {
      fail(`${item.path} did not return ok=true`);
    }
    if (item.expectField && !(item.expectField in json)) {
      fail(`${item.path} missing field ${item.expectField}`);
    }
  }

  const notFound = await requestJson(baseUrl, "/api/v1/not-a-route");
  if (notFound.response.status !== 404 || notFound.json?.error?.code !== "NOT_FOUND") {
    fail("404 handler did not return NOT_FOUND");
  }

  console.log("ISO API runtime preview check passed");
} finally {
  await close();
}
