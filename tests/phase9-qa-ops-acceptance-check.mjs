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

const qa = read("docs/21_TESTING_AND_QA.md");
for (const token of [
  "QA Layers",
  "Acceptance Gate Names",
  "source-contract",
  "runtime-readiness",
  "export-readiness"
]) {
  if (!qa.includes(token)) fail(`Missing QA token: ${token}`);
}

const production = read("docs/23_PRODUCTION_DEPLOYMENT.md");
for (const token of [
  "Release Gates",
  "Rollback Requirements",
  "Source gate",
  "Caddy gate",
  "Public gate"
]) {
  if (!production.includes(token)) fail(`Missing production token: ${token}`);
}

const ops = read("docs/24_OPERATIONS_AND_MAINTENANCE.md");
for (const token of [
  "Operational Controls",
  "Maintenance Rhythm",
  "Incident response",
  "AI usage",
  "Restore"
]) {
  if (!ops.includes(token)) fail(`Missing operations token: ${token}`);
}

const acceptance = read("docs/25_FINAL_ACCEPTANCE.md");
for (const token of [
  "Final Acceptance Matrix",
  "Handover Package",
  "Export verification samples",
  "The project is not final-complete"
]) {
  if (!acceptance.includes(token)) fail(`Missing final acceptance token: ${token}`);
}

const phaseDoc = read("docs/21_23_24_25_PHASE9_QA_OPS_ACCEPTANCE.md");
for (const token of [
  "Phase 9 Objective",
  "Acceptance Gates",
  "Evidence Rule",
  "Current Phase Boundary",
  "Phase 9 Cross-check"
]) {
  if (!phaseDoc.includes(token)) fail(`Missing phase-9 document token: ${token}`);
}

const acceptancePolicy = read("backend/src/services/acceptancePolicy.js");
for (const token of [
  "acceptanceGateDefinitions",
  "buildAcceptanceGateMatrix",
  "buildReleaseEvidenceChecklist",
  "buildOperationalRunbookPreview",
  "buildDevelopmentProgressMap",
  "source-contract",
  "final-acceptance",
  "source-acceptance-policy-only"
]) {
  if (!acceptancePolicy.includes(token)) fail(`Missing acceptance policy token: ${token}`);
}

const policyRoute = read("backend/src/routes/policy.js");
for (const token of [
  'post("/acceptance-gate-matrix"',
  'post("/release-evidence-checklist"',
  'post("/operational-runbook-preview"',
  'post("/development-progress-map"'
]) {
  if (!policyRoute.includes(token)) fail(`Missing policy route token: ${token}`);
}

const manifest = read("backend/src/routeManifest.js");
for (const route of [
  "/api/v1/policy/acceptance-gate-matrix",
  "/api/v1/policy/release-evidence-checklist",
  "/api/v1/policy/operational-runbook-preview",
  "/api/v1/policy/development-progress-map"
]) {
  if (!manifest.includes(route)) fail(`Missing phase-9 route manifest entry: ${route}`);
}

const frontendData = read("frontend/src/data.ts");
const frontendTypes = read("frontend/src/types.ts");
const app = read("frontend/src/App.tsx");
const styles = read("frontend/src/styles.css");
for (const token of [
  "AcceptanceGateSignal",
  "acceptanceGateSignals"
]) {
  if (!`${frontendData}\n${frontendTypes}`.includes(token)) fail(`Missing frontend acceptance token: ${token}`);
}

for (const token of [
  "Acceptance Gates",
  "acceptance-grid",
  "acceptanceGateSignals.map"
]) {
  if (!`${app}\n${styles}`.includes(token)) fail(`Missing frontend acceptance rendering token: ${token}`);
}

console.log("ISO phase-9 QA ops acceptance check passed");
