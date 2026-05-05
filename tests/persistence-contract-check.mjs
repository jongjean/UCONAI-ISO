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

const contracts = read("backend/src/repositories/contracts.js");
for (const token of [
  "repositoryContracts",
  "repositoryContractById",
  "listRepositoryModels",
  "StandardProject",
  "DocumentElement",
  "DocumentVersionSnapshot",
  "EditOwnershipLock",
  "ReferenceDocument",
  "FigureAsset",
  "AiInteraction",
  "ExportJob",
  "CreditAccount",
  "AuditLog",
  "SecurityEvent"
]) {
  if (!contracts.includes(token)) {
    fail(`Missing repository contract token: ${token}`);
  }
}

const disabled = read("backend/src/repositories/disabledRepository.js");
for (const token of [
  "createDisabledRepository",
  "enabled: false",
  "disabled-until-db-enabled"
]) {
  if (!disabled.includes(token)) {
    fail(`Missing disabled repository token: ${token}`);
  }
}

const service = read("backend/src/services/persistenceContracts.js");
for (const token of [
  "listPersistenceContracts",
  "validatePersistenceOperation",
  "buildRepositoryImplementationPlan",
  "createWorkspaceSnapshot",
  "listWorkspaceSnapshots",
  "buildStorageBackupEvidence",
  "storage-backed-json-snapshot",
  "executionAllowed: false",
  "PERSISTENT_WRITE_DISABLED",
  "No canonical document write without active edit lock"
]) {
  if (!service.includes(token)) {
    fail(`Missing persistence service token: ${token}`);
  }
}

const route = read("backend/src/routes/persistence.js");
for (const token of [
  'get("/contracts"',
  'get("/implementation-plan"',
  'post("/operation/validate"',
  'post("/workspace-snapshots"',
  'post("/workspace-snapshots/list"',
  'post("/backup-evidence"'
]) {
  if (!route.includes(token)) {
    fail(`Missing persistence route token: ${token}`);
  }
}

const app = read("backend/src/app.js");
if (!app.includes('app.use("/api/v1/persistence"')) {
  fail("Persistence router is not mounted");
}

const manifest = read("backend/src/routeManifest.js");
for (const endpoint of [
  "/api/v1/persistence/contracts",
  "/api/v1/persistence/implementation-plan",
  "/api/v1/persistence/operation/validate",
  "/api/v1/persistence/workspace-snapshots",
  "/api/v1/persistence/workspace-snapshots/list",
  "/api/v1/persistence/backup-evidence"
]) {
  if (!manifest.includes(endpoint)) {
    fail(`Missing persistence manifest endpoint: ${endpoint}`);
  }
}

const doc = read("docs/05A_REPOSITORY_AND_PERSISTENCE_CONTRACT.md");
for (const token of [
  "Repository Groups",
  "Write Boundary",
  "API Contract",
  "Implementation Sequence",
  "Required Invariants"
]) {
  if (!doc.includes(token)) {
    fail(`Missing persistence document token: ${token}`);
  }
}

console.log("ISO persistence contract check passed");
