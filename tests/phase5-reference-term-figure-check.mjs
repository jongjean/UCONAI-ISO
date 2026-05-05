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

const referencePolicy = read("backend/src/services/referencePolicy.js");
for (const token of [
  "buildReferenceGovernanceMatrix",
  "buildEndnoteBindingPlan",
  "buildSourceUseDecisionReport",
  "classifyReferenceUse",
  "sourceUseDecisionFor",
  "referenceActionFor",
  "AI_USE_MODE_REQUIRED",
  "source-use-decision-only-until-db-enabled",
  "CLAUSE_2_LINK_REQUIRED",
  "BIBLIOGRAPHY_LINK_RECOMMENDED",
  "ENDNOTE_BINDING_INCOMPLETE",
  "binding-plan-only-until-db-enabled"
]) {
  if (!referencePolicy.includes(token)) {
    fail(`Missing reference phase-5 token: ${token}`);
  }
}

const terminologyPolicy = read("backend/src/services/terminologyPolicy.js");
for (const token of [
  "buildTerminologyConsistencyReport",
  "TERM_NOT_USED_IN_BODY",
  "duplicateTerms",
  "requirementBoundary",
  "changeControl"
]) {
  if (!terminologyPolicy.includes(token)) {
    fail(`Missing terminology phase-5 token: ${token}`);
  }
}

const figurePolicy = read("backend/src/services/figurePolicy.js");
for (const token of [
  "PPTX_SHAPES",
  "SVG_EDITABLE",
  "MERMAID",
  "XLSX_CHART",
  "DOCX_DRAWING",
  "RASTER_ONLY_PPTX",
  "buildEditableDiagramPlan",
  "buildEditableFigureSourceBlueprint",
  "buildFigureAuthoringGuidance",
  "rasterWarning",
  "editableText: true",
  "connectorEditable: true",
  "blueprint-only-until-storage-enabled",
  "source-manifest.json"
]) {
  if (!figurePolicy.includes(token)) {
    fail(`Missing figure phase-5 token: ${token}`);
  }
}

const supportingMaterials = read("backend/src/services/supportingMaterialsReadiness.js");
for (const token of [
  "buildSupportingMaterialsReadiness",
  "buildReferenceGovernanceMatrix",
  "buildTerminologyConsistencyReport",
  "buildFigureReadinessReport",
  "clauseBindings",
  "figureSources",
  "disabled-until-db-and-storage-enabled"
]) {
  if (!supportingMaterials.includes(token)) {
    fail(`Missing supporting materials token: ${token}`);
  }
}

const routes = [
  ["backend/src/routes/references.js", 'post("/governance-matrix"'],
  ["backend/src/routes/references.js", 'post("/endnote-binding-plan"'],
  ["backend/src/routes/references.js", 'post("/source-use-decision-report"'],
  ["backend/src/routes/references.js", 'post("/supporting-materials-readiness"'],
  ["backend/src/routes/terms.js", 'post("/consistency-report"'],
  ["backend/src/routes/figures.js", 'post("/diagram-plan"'],
  ["backend/src/routes/figures.js", 'post("/source-blueprint"'],
  ["backend/src/routes/figures.js", 'post("/authoring-guidance"']
];

for (const [file, token] of routes) {
  if (!read(file).includes(token)) {
    fail(`Missing route token ${token} in ${file}`);
  }
}

const manifest = read("backend/src/routeManifest.js");
for (const route of [
  "/api/v1/references/governance-matrix",
  "/api/v1/references/endnote-binding-plan",
  "/api/v1/references/source-use-decision-report",
  "/api/v1/references/supporting-materials-readiness",
  "/api/v1/terms/consistency-report",
  "/api/v1/figures/diagram-plan",
  "/api/v1/figures/source-blueprint",
  "/api/v1/figures/authoring-guidance"
]) {
  if (!manifest.includes(route)) {
    fail(`Missing phase-5 route manifest entry: ${route}`);
  }
}

const doc = read("docs/15_16_17_PHASE5_REFERENCES_TERMS_FIGURES.md");
for (const token of [
  "Reference Governance",
  "Source Use Decision Report",
  "Endnote binding",
  "Terminology Governance",
  "Editable Figure Governance",
  "Editable Source Blueprint",
  "Supporting Materials Readiness",
  "Phase 5 Cross-check"
]) {
  if (!doc.includes(token)) {
    fail(`Missing phase-5 document token: ${token}`);
  }
}

const frontendData = read("frontend/src/data.ts");
const frontendTypes = read("frontend/src/types.ts");
const app = read("frontend/src/App.tsx");
const styles = read("frontend/src/styles.css");
for (const token of [
  "SupportingMaterialSignal",
  "SourceUseSignal",
  "supportingMaterialSignals"
  ,"sourceUseSignals"
]) {
  if (!`${frontendData}\n${frontendTypes}`.includes(token)) {
    fail(`Missing frontend supporting material token: ${token}`);
  }
}

for (const token of [
  "Supporting Materials",
  "Source Use Decisions",
  "supporting-grid",
  "source-use-grid",
  "supportingMaterialSignals.map"
  ,"sourceUseSignals.map"
]) {
  if (!`${app}\n${styles}`.includes(token)) {
    fail(`Missing frontend supporting material rendering token: ${token}`);
  }
}

console.log("ISO phase-5 reference term figure check passed");
