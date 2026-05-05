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

const exportPolicy = read("backend/src/services/exportPolicy.js");
for (const token of [
  "buildDocxAssemblyPlan",
  "buildOsdCompanionReportPreview",
  "buildFinalPackageChecklist",
  "buildDocxStyleMap",
  "buildFormalExportGateReport",
  "buildSourcePackageBindingReport",
  "buildOsdEntryChecklist",
  "hardcodedNumberingBlocked",
  "docxStyleFor",
  "SOURCE_VERSION_BINDING_MISSING",
  "EDITABLE_FIGURE_SOURCE_REF_MISSING",
  "HARDCODED_NUMBERING_RISK",
  "source-version-map.json",
  "figure-source-package.zip",
  "source-manifest.json",
  "FIGURE_SOURCE_BINDING_INCOMPLETE",
  "binding-report-only-until-storage-worker-enabled"
]) {
  if (!exportPolicy.includes(token)) {
    fail(`Missing export phase-7 token: ${token}`);
  }
}

const routes = read("backend/src/routes/exports.js");
for (const token of [
  'post("/docx-assembly-plan"',
  'post("/osd-companion-report-preview"',
  'post("/final-package-checklist"',
  'post("/docx-style-map"',
  'post("/formal-gate-report"',
  'post("/source-package-binding-report"'
]) {
  if (!routes.includes(token)) {
    fail(`Missing export route token: ${token}`);
  }
}

const manifest = read("backend/src/routeManifest.js");
for (const route of [
  "/api/v1/exports/docx-assembly-plan",
  "/api/v1/exports/osd-companion-report-preview",
  "/api/v1/exports/final-package-checklist",
  "/api/v1/exports/docx-style-map",
  "/api/v1/exports/formal-gate-report",
  "/api/v1/exports/source-package-binding-report"
]) {
  if (!manifest.includes(route)) {
    fail(`Missing phase-7 route manifest entry: ${route}`);
  }
}

const doc = read("docs/19_PHASE7_DOCX_OSD_EXPORT_CONTRACT.md");
for (const token of [
  "Phase 7 Objective",
  "Export Types",
  "Binding Rules",
  "OSD Companion Report",
  "Formal Export Gate",
  "Source package binding",
  "Phase 7 Cross-check"
]) {
  if (!doc.includes(token)) {
    fail(`Missing phase-7 document token: ${token}`);
  }
}

const frontendData = read("frontend/src/data.ts");
const frontendTypes = read("frontend/src/types.ts");
const app = read("frontend/src/App.tsx");
const styles = read("frontend/src/styles.css");
for (const token of [
  "ExportGateSignal",
  "exportGateSignals",
  "FormalPackageSignal",
  "formalPackageSignals"
]) {
  if (!`${frontendData}\n${frontendTypes}`.includes(token)) {
    fail(`Missing frontend export gate token: ${token}`);
  }
}

for (const token of [
  "Export Gate",
  "export-gate-grid",
  "exportGateSignals.map",
  "Formal Package",
  "secondCheckpointSnapshot",
  "checkpoint-progress-grid",
  "formal-package-grid",
  "formalPackageSignals.map"
]) {
  if (!`${app}\n${styles}`.includes(token)) {
    fail(`Missing frontend export rendering token: ${token}`);
  }
}

console.log("ISO phase-7 export contract check passed");
