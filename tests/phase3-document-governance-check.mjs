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

const documentStructure = read("backend/src/services/documentStructure.js");
for (const token of [
  "buildDocumentGovernanceContract",
  "buildSectionRiskMatrix",
  "canonicalFlow",
  "noBlindPasteToOsd",
  "section-risk-matrix-only-until-db-enabled",
  "single-editor",
  "read-only-history",
  "historical-unlock",
  "numbering-preview",
  "stageCautionsFor"
]) {
  if (!documentStructure.includes(token)) {
    fail(`Missing document governance token: ${token}`);
  }
}

const workspaceState = read("backend/src/services/documentWorkspaceState.js");
for (const token of [
  "buildDocumentWorkspaceState",
  "validateWorkspaceSubmitReadiness",
  "validateStaleEdit",
  "buildSnapshotPreview",
  "activeEditor",
  "canComment: true",
  "canPropose: true"
]) {
  if (!workspaceState.includes(token)) {
    fail(`Missing workspace state token: ${token}`);
  }
}

const documentsRoute = read("backend/src/routes/documents.js");
for (const token of [
  'get("/governance-contract"',
  'post("/section-risk-matrix"',
  'post("/workspace-state-preview"',
  'post("/submit-readiness/validate"',
  'post("/validate-element"',
  'post("/validate-outline"',
  'post("/numbering-preview"'
]) {
  if (!documentsRoute.includes(token)) {
    fail(`Missing document route token: ${token}`);
  }
}

const versionPolicy = read("backend/src/services/versionPolicy.js");
for (const token of [
  "buildSnapshotPreview",
  "validateHistoricalUnlockRequest",
  "buildVersionDateBrowser",
  "buildVersionDiffPreview",
  "buildExportVersionBindingPreview",
  "buildChangeImpactReport",
  "impact-report-only-until-db-enabled",
  "HIGH_IMPACT_CHANGE_REVIEW",
  "editable: false",
  "PASSWORD_REQUIRED"
]) {
  if (!versionPolicy.includes(token)) {
    fail(`Missing version policy token: ${token}`);
  }
}

const editLockPolicy = read("backend/src/services/editLockPolicy.js");
for (const token of [
  "singleEditorOnly: true",
  "nonEditorsCanComment: true",
  "validateTransferRequest",
  "validateProposalDraft",
  "validateStaleEdit",
  "STALE_EDIT_REJECTED",
  "CANONICAL_WRITE_BLOCKED"
]) {
  if (!editLockPolicy.includes(token)) {
    fail(`Missing edit lock token: ${token}`);
  }
}

const manifest = read("backend/src/routeManifest.js");
for (const route of [
  "/api/v1/documents/element-types",
  "/api/v1/documents/governance-contract",
  "/api/v1/documents/section-risk-matrix",
  "/api/v1/documents/workspace-state-preview",
  "/api/v1/documents/submit-readiness/validate",
  "/api/v1/documents/validate-element",
  "/api/v1/versions/snapshot-preview",
  "/api/v1/versions/change-impact-report",
  "/api/v1/versions/historical-unlock/validate",
  "/api/v1/locks/policy",
  "/api/v1/locks/validate",
  "/api/v1/locks/stale-edit/validate"
]) {
  if (!manifest.includes(route)) {
    fail(`Missing phase-3 route manifest entry: ${route}`);
  }
}

const doc = read("docs/09_10_11_PHASE3_DOCUMENT_GOVERNANCE.md");
for (const token of [
  "Governance Contract",
  "Section Risk Matrix",
  "Canonical Text Flow",
  "Required Safeguards",
  "Stage Cautions",
  "Phase 3 Cross-check"
]) {
  if (!doc.includes(token)) {
    fail(`Missing phase-3 document token: ${token}`);
  }
}

console.log("ISO phase-3 document governance check passed");
