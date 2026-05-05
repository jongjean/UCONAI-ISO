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

const projectPolicy = read("backend/src/services/projectPolicy.js");
for (const token of [
  "buildWorkspaceContract",
  "buildDeliverableGuidelineMatrix",
  "validateWorkspaceContract",
  "deliverableGuidelines",
  "noGenericIsAssumption",
  "guideline-matrix-only-until-db-enabled",
  "hpPaths",
  "surfaces",
  "runtimeGates",
  "editorLayout",
  "completionModel",
  "disabled-until-db-enabled"
]) {
  if (!projectPolicy.includes(token)) {
    fail(`Missing workspace policy token: ${token}`);
  }
}

for (const surface of ["roadmap", "document", "agent", "references", "figures", "exports"]) {
  if (!projectPolicy.includes(`id: "${surface}"`)) {
    fail(`Missing workspace surface: ${surface}`);
  }
}

for (const hpPath of [
  "/uconai/projects/iso",
  "/uconai/www/iso",
  "/uconai/data/iso/projects/",
  "/uconai/data/iso/storage/",
  "/uconai/data/iso/logs/"
]) {
  if (!projectPolicy.includes(hpPath)) {
    fail(`Missing HP path contract: ${hpPath}`);
  }
}

const projectsRoute = read("backend/src/routes/projects.js");
for (const token of [
  'get("/workspace-contract"',
  'post("/deliverable-guidelines"',
  'post("/workspace/validate"',
  "buildWorkspaceContract",
  "validateWorkspaceContract"
]) {
  if (!projectsRoute.includes(token)) {
    fail(`Missing projects route token: ${token}`);
  }
}

const manifest = read("backend/src/routeManifest.js");
for (const route of [
  "/api/v1/projects/workspace-contract",
  "/api/v1/projects/deliverable-guidelines",
  "/api/v1/projects/workspace/validate"
]) {
  if (!manifest.includes(route)) {
    fail(`Missing workspace route manifest entry: ${route}`);
  }
}

const frontendData = read("frontend/src/data.ts");
const frontendTypes = read("frontend/src/types.ts");
const app = read("frontend/src/App.tsx");
const styles = read("frontend/src/styles.css");
for (const token of [
  "WorkspaceSurface",
  "ChapterWorkspaceBlock",
  "DeliverableGuidelineSignal",
  "workspaceSurfaces",
  "chapterWorkspaceBlocks",
  "deliverableGuidelineSignals",
  "preview-ready",
  "contract-ready",
  "locked"
]) {
  if (!`${frontendData}\n${frontendTypes}`.includes(token)) {
    fail(`Missing frontend workspace data token: ${token}`);
  }
}

for (const token of [
  "Workspace Contract",
  "surface-grid",
  "workspaceSurfaces.map",
  "Chapter Blocks",
  "chapterBlocks.map",
  "addChapterBlock",
  "deleteChapter",
  "moveChapter",
  "Auto numbering",
  "numberForClause",
  "changeClauseDepth",
  "addChildClause",
  "clause-outline-editor",
  "Deliverable Types",
  "deliverable-grid",
  "deliverableGuidelineSignals.map"
]) {
  if (!app.includes(token) && !styles.includes(token)) {
    fail(`Missing frontend workspace rendering token: ${token}`);
  }
}

const doc = read("docs/06_07_08_PHASE2_WORKSPACE_CONTRACTS.md");
for (const token of [
  "Phase 2 Objective",
  "Workspace Surfaces",
  "HP Path Contract",
  "Layout Contract",
  "Chapter block workspace",
  "Clause outline editor",
  "Deliverable Guideline Matrix",
  "Phase 2 Cross-check"
]) {
  if (!doc.includes(token)) {
    fail(`Missing phase-2 document token: ${token}`);
  }
}

console.log("ISO phase-2 workspace check passed");
