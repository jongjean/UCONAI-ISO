import fs from "fs";
import path from "path";

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function fail(message) {
  console.error(`Stage 1 engine check failed: ${message}`);
  process.exit(1);
}

const app = read("backend/src/app.js");
const manifest = read("backend/src/routeManifest.js");
const service = read("backend/src/services/nDocumentEngine.js");
const commander = read("backend/src/services/aiCommander.js");
const frontendApi = read("frontend/src/api.ts");
const frontendApp = read("frontend/src/App.tsx");

[
  'app.use("/api/v1/n-documents", nDocumentsRouter)',
  'path: "/api/v1/n-documents/analyze"',
  'path: "/api/v1/n-documents/stage-assessment"',
  'path: "/api/v1/n-documents/knowledge-index"',
  'path: "/api/v1/n-documents/rag-query"',
  'path: "/api/v1/n-documents/project-control-snapshot"',
  'path: "/api/v1/n-documents/evidence-grounding"',
  'path: "/api/v1/n-documents/project-memory-snapshot"',
  "export function analyzeNDocument",
  "export function buildStageAssessment",
  "export function buildKnowledgeIndex",
  "export function queryKnowledgeIndex",
  "export function buildProjectControlSnapshot",
  "export function buildEvidenceGrounding",
  "export function buildProjectMemorySnapshot",
  "isoProcedureKnowledge",
  "procedureKnowledgeCount",
  "projectMemory",
  "stageAssessment",
  "projectControl",
  "AI evidence grounding",
  "Project memory and recovery ledger",
  "Never claim a stage is final without source evidence",
  "function termMatches",
  "escapeRegExp",
  "analyzeNDocument",
  "requestStageAssessment",
  "buildProjectControlSnapshot",
  "queryNDocumentKnowledge"
].forEach((token) => {
  const haystack = [
    app,
    manifest,
    service,
    commander,
    frontendApi,
    frontendApp
  ].join("\n");
  if (!haystack.includes(token)) fail(`missing token: ${token}`);
});

const stages = ["PWI", "NP", "WD", "CD", "DIS", "FDIS", "Publish"];
for (const stage of stages) {
  if (!service.includes(`"${stage}"`)) fail(`missing stage rule for ${stage}`);
}

console.log("ISO Stage 1 engine check passed");
