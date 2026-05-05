import fs from "fs";
import path from "path";

const root = process.cwd();

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

const policy = read("backend/src/services/documentCommandPolicy.js");
for (const token of [
  "documentCommands",
  "validateDocumentCommand",
  "buildDocumentCommandPlan",
  "buildBulkDocumentCommandPlan",
  "buildDocumentImpactPreview",
  "ACTIVE_LOCK_REQUIRED",
  "AI_PROPOSAL_REVIEW_REQUIRED",
  "FORMAL_STAGE_CHANGE_RISK",
  "executionAllowed: false",
  "disabled-until-db-enabled"
]) {
  if (!policy.includes(token)) {
    fail(`Missing document command policy token: ${token}`);
  }
}

const workspaceState = read("backend/src/services/documentWorkspaceState.js");
for (const token of [
  "buildDocumentWorkspaceState",
  "validateWorkspaceSubmitReadiness",
  "buildAuthoringGuidance",
  "buildVersionDateBrowser",
  "canonicalWriteAllowed: false",
  "submitAllowedNow: false",
  "comment-and-proposal",
  "disabled-until-db-enabled"
]) {
  if (!workspaceState.includes(token)) {
    fail(`Missing document workspace state token: ${token}`);
  }
}

const route = read("backend/src/routes/documents.js");
for (const token of [
  'get("/commands"',
  'post("/commands/validate"',
  'post("/commands/plan"',
  'post("/commands/bulk-plan"',
  'post("/impact-preview"',
  'post("/workspace-state-preview"',
  'post("/submit-readiness/validate"',
  "buildDocumentImpactPreview"
]) {
  if (!route.includes(token)) {
    fail(`Missing document command route token: ${token}`);
  }
}

const manifest = read("backend/src/routeManifest.js");
for (const endpoint of [
  "/api/v1/documents/commands",
  "/api/v1/documents/commands/validate",
  "/api/v1/documents/commands/plan",
  "/api/v1/documents/commands/bulk-plan",
  "/api/v1/documents/impact-preview",
  "/api/v1/documents/workspace-state-preview",
  "/api/v1/documents/submit-readiness/validate"
]) {
  if (!manifest.includes(endpoint)) {
    fail(`Missing document command manifest endpoint: ${endpoint}`);
  }
}

const doc = read("docs/09A_DOCUMENT_COMMAND_MODEL.md");
for (const token of [
  "Document Editor Command Model",
  "Required Flow",
  "Guardrails",
  "API Contract",
  "Frontend Contract",
  "Workspace State Contract",
  "Current Boundary"
]) {
  if (!doc.includes(token)) {
    fail(`Missing document command document token: ${token}`);
  }
}

const frontendData = read("frontend/src/data.ts");
const frontendTypes = read("frontend/src/types.ts");
const app = read("frontend/src/App.tsx");
const styles = read("frontend/src/styles.css");
for (const token of [
  "DocumentCommandStep",
  "DocumentImpactItem",
  "WorkspaceStateSignal",
  "documentCommandSteps",
  "documentImpactPreview",
  "workspaceStateSignals"
]) {
  if (!`${frontendData}\n${frontendTypes}`.includes(token)) {
    fail(`Missing frontend command data token: ${token}`);
  }
}

for (const token of ["Document Commands", "Impact Preview", "Workspace State", "command-grid", "impact-list", "state-grid"]) {
  if (!`${app}\n${styles}`.includes(token)) {
    fail(`Missing frontend command rendering token: ${token}`);
  }
}

console.log("ISO document command contract check passed");
