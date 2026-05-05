import fs from "fs";
import path from "path";

const requiredFiles = [
  "package.json",
  "README.md",
  "CONTRIBUTING.md",
  "docs/00_MASTER_EXECUTION_MAP.md",
  "docs/01_PROJECT_GOVERNANCE.md",
  "docs/01A_AUTH_SESSION_ROLE_CONTRACT.md",
  "docs/02_HP_INFRASTRUCTURE_POLICY.md",
  "docs/03_ISO_RULE_FOUNDATION.md",
  "docs/04_PRODUCT_ARCHITECTURE.md",
  "docs/05_DATABASE_AND_DATA_MODEL.md",
  "docs/05A_REPOSITORY_AND_PERSISTENCE_CONTRACT.md",
  "docs/03_04_05_PHASE1_CONTRACTS.md",
  "docs/06_BACKEND_FOUNDATION.md",
  "docs/07_FRONTEND_FOUNDATION.md",
  "docs/08_PROJECT_WORKSPACE.md",
  "docs/06_07_08_PHASE2_WORKSPACE_CONTRACTS.md",
  "docs/09_STRUCTURED_DOCUMENT_ENGINE.md",
  "docs/09A_DOCUMENT_COMMAND_MODEL.md",
  "docs/10_VERSION_HISTORY.md",
  "docs/11_EDIT_OWNERSHIP_AND_COLLABORATION.md",
  "docs/09_10_11_PHASE3_DOCUMENT_GOVERNANCE.md",
  "docs/12_AI_PROVIDER_GATEWAY.md",
  "docs/13_AI_AGENT_FUNCTIONS.md",
  "docs/12_13_20_PHASE6_AI_AGENT_BILLING.md",
  "docs/14_ROADMAP_AND_PROCEDURE_ENGINE.md",
  "docs/14_18_PHASE4_ROADMAP_CONSENSUS.md",
  "docs/15_REFERENCE_AND_BIBLIOGRAPHY_MANAGEMENT.md",
  "docs/16_TERMS_AND_DEFINITIONS.md",
  "docs/17_FIGURES_TABLES_AND_EDITABLE_SOURCES.md",
  "docs/15_16_17_PHASE5_REFERENCES_TERMS_FIGURES.md",
  "docs/18_REVIEW_COMMENTS_AND_CONSENSUS.md",
  "docs/19_DOCX_AND_OSD_EXPORT.md",
  "docs/19_PHASE7_DOCX_OSD_EXPORT_CONTRACT.md",
  "docs/20_BILLING_AND_PREMIUM_AI.md",
  "docs/21_TESTING_AND_QA.md",
  "docs/21_23_24_25_PHASE9_QA_OPS_ACCEPTANCE.md",
  "docs/22_PHASE8_HP_EXECUTION_READINESS.md",
  "docs/23_PRODUCTION_DEPLOYMENT.md",
  "docs/24_OPERATIONS_AND_MAINTENANCE.md",
  "docs/25_FINAL_ACCEPTANCE.md",
  "tests/api-contract-check.mjs",
  "tests/runtime-source-contract-check.mjs",
  "tests/api-runtime-preview-check.mjs",
  "tests/development-progress-map-check.mjs",
  "tests/frontend-runtime-probe-check.mjs",
  "tests/persistence-contract-check.mjs",
  "tests/auth-contract-check.mjs",
  "tests/document-command-contract-check.mjs",
  "tests/phase1-contract-check.mjs",
  "tests/phase2-workspace-check.mjs",
  "tests/phase3-document-governance-check.mjs",
  "tests/phase4-roadmap-consensus-check.mjs",
  "tests/phase5-reference-term-figure-check.mjs",
  "tests/phase6-ai-agent-billing-check.mjs",
  "tests/phase7-export-contract-check.mjs",
  "tests/phase8-hp-readiness-check.mjs",
  "tests/phase9-qa-ops-acceptance-check.mjs",
  "tests/source-noise-check.mjs",
  "backend/src/app.js",
  "backend/src/server.js",
  "backend/src/contracts.js",
  "backend/src/routeManifest.js",
  "backend/src/repositories/contracts.js",
  "backend/src/repositories/disabledRepository.js",
  "backend/src/services/persistenceContracts.js",
  "backend/src/services/acceptancePolicy.js",
  "backend/src/services/authPolicy.js",
  "backend/src/services/authoringGuidance.js",
  "backend/src/services/documentCommandPolicy.js",
  "backend/src/services/documentWorkspaceState.js",
  "backend/src/services/supportingMaterialsReadiness.js",
  "backend/src/routes/persistence.js",
  "backend/src/routes/auth.js",
  "backend/prisma/schema.prisma",
  "frontend/src/App.tsx",
  "frontend/src/api.ts",
  "frontend/src/vite-env.d.ts",
  "ai-services/rule-registry.json",
  "ai-services/agent-contracts.json",
  "tools/iso_db_bootstrap_plan.py",
  "tools/iso_hp_preflight.py",
  "infra/iso-api.service.draft",
  "infra/Caddyfile.iso.draft"
];

const root = process.cwd();
const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));

if (missing.length > 0) {
  console.error("Missing required files:");
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

JSON.parse(fs.readFileSync(path.join(root, "ai-services/rule-registry.json"), "utf8"));
JSON.parse(fs.readFileSync(path.join(root, "ai-services/agent-contracts.json"), "utf8"));

const schema = fs.readFileSync(path.join(root, "backend/prisma/schema.prisma"), "utf8");
const requiredModels = [
  "User",
  "StandardProject",
  "DocumentElement",
  "DocumentVersionSnapshot",
  "EditOwnershipLock",
  "ReferenceDocument",
  "NormativeReference",
  "BibliographyLinkCandidate",
  "FigureAsset",
  "AssetSourceValidation",
  "CommitteeActor",
  "CommentDisposition",
  "DecisionRecord",
  "AiInteraction",
  "AiProviderUsage",
  "ExportJob",
  "CreditAccount",
  "BillingEvent",
  "UsageLedger",
  "AuditLog",
  "SecurityEvent"
];

const missingModels = requiredModels.filter((model) => !schema.includes(`model ${model} `));
if (missingModels.length > 0) {
  console.error("Missing required Prisma models:");
  for (const model of missingModels) console.error(`- ${model}`);
  process.exit(1);
}

const server = fs.readFileSync(path.join(root, "backend/src/app.js"), "utf8");
const requiredRoutes = [
  "/api/v1/agents",
  "/api/v1/ai",
  "/api/v1/architecture",
  "/api/v1/auth",
  "/api/v1/billing",
  "/api/v1/config-status",
  "/api/v1/documents",
  "/api/v1/exports",
  "/api/v1/figures",
  "/api/v1/locks",
  "/api/v1/policy",
  "/api/v1/projects",
  "/api/v1/references",
  "/api/v1/reviews",
  "/api/v1/roadmap",
  "/api/v1/routes",
  "/api/v1/terms",
  "/api/v1/versions"
];

const missingRoutes = requiredRoutes.filter((route) => !server.includes(`"${route}"`));
if (missingRoutes.length > 0) {
  console.error("Missing required API route mounts:");
  for (const route of missingRoutes) console.error(`- ${route}`);
  process.exit(1);
}

const routeManifest = fs.readFileSync(path.join(root, "backend/src/routeManifest.js"), "utf8");
for (const route of requiredRoutes) {
  if (!routeManifest.includes(`path: "${route}`)) {
    console.error(`Missing route manifest entry for ${route}`);
    process.exit(1);
  }
}

const roadmapEngine = fs.readFileSync(path.join(root, "backend/src/services/roadmapEngine.js"), "utf8");
for (const token of ["buildTrackChangePreview", "minimumWindow", "consensusFocus", "ACCELERATED_TRACK"]) {
  if (!roadmapEngine.includes(token)) {
    console.error(`Missing roadmap engine token ${token}`);
    process.exit(1);
  }
}

const agentContracts = fs.readFileSync(path.join(root, "backend/src/services/agentContracts.js"), "utf8");
for (const token of ["buildAgentTaskPlan", "buildAgentMatrix", "canonicalTextWriteBlocked", "inputChecklistFor"]) {
  if (!agentContracts.includes(token)) {
    console.error(`Missing agent contract token ${token}`);
    process.exit(1);
  }
}

const documentStructure = fs.readFileSync(path.join(root, "backend/src/services/documentStructure.js"), "utf8");
for (const token of ["validateDocumentOutline", "generateNumberingPreview", "buildSectionRiskMatrix", "BULLET_STYLE_REVIEW", "EDITABLE_FIGURE_SOURCE_MISSING"]) {
  if (!documentStructure.includes(token)) {
    console.error(`Missing document structure token ${token}`);
    process.exit(1);
  }
}

const projectPolicy = fs.readFileSync(path.join(root, "backend/src/services/projectPolicy.js"), "utf8");
for (const token of ["buildProjectPreview", "buildProjectDashboardPreview", "buildDeliverableGuidelineMatrix", "validateArchiveRequest", "dialogueLanguage"]) {
  if (!projectPolicy.includes(token)) {
    console.error(`Missing project policy token ${token}`);
    process.exit(1);
  }
}

const referencePolicy = fs.readFileSync(path.join(root, "backend/src/services/referencePolicy.js"), "utf8");
for (const token of ["buildReferenceReadinessReport", "buildBibliographyLinkPreview", "buildEndnoteBindingPlan", "NORMATIVE_REFERENCE_UNLINKED"]) {
  if (!referencePolicy.includes(token)) {
    console.error(`Missing reference policy token ${token}`);
    process.exit(1);
  }
}

const reviewPolicy = fs.readFileSync(path.join(root, "backend/src/services/reviewPolicy.js"), "utf8");
for (const token of ["buildStakeholderMap", "buildCommentResponsePlan", "buildMeetingMissionPlan", "buildMeetingParticipationLedger", "cooperationPathFor"]) {
  if (!reviewPolicy.includes(token)) {
    console.error(`Missing review policy token ${token}`);
    process.exit(1);
  }
}

const figurePolicy = fs.readFileSync(path.join(root, "backend/src/services/figurePolicy.js"), "utf8");
for (const token of ["buildFigureReadinessReport", "buildEditableSourcePackagePreview", "buildEditableFigureSourceBlueprint", "EDITABLE_FIGURE_SOURCE_REQUIRED"]) {
  if (!figurePolicy.includes(token)) {
    console.error(`Missing figure policy token ${token}`);
    process.exit(1);
  }
}

const exportPolicy = fs.readFileSync(path.join(root, "backend/src/services/exportPolicy.js"), "utf8");
for (const token of ["buildExportReadinessReport", "buildExportManifestPreview", "buildSourcePackageBindingReport", "figure-source-package.zip"]) {
  if (!exportPolicy.includes(token)) {
    console.error(`Missing export policy token ${token}`);
    process.exit(1);
  }
}

const billingPolicySource = fs.readFileSync(path.join(root, "backend/src/services/billingPolicy.js"), "utf8");
for (const token of ["validateEntitlement", "estimateUsageCost", "buildUsageSummaryPreview", "PLAN_UPGRADE_REQUIRED"]) {
  if (!billingPolicySource.includes(token)) {
    console.error(`Missing billing policy token ${token}`);
    process.exit(1);
  }
}

const authPolicySource = fs.readFileSync(path.join(root, "backend/src/services/authPolicy.js"), "utf8");
for (const token of ["validateRegistrationDraft", "validateRoleAssignment", "EDITOR_LOCK_POLICY_APPLIES"]) {
  if (!authPolicySource.includes(token)) {
    console.error(`Missing auth policy token ${token}`);
    process.exit(1);
  }
}

const versionPolicy = fs.readFileSync(path.join(root, "backend/src/services/versionPolicy.js"), "utf8");
for (const token of ["buildVersionDateBrowser", "buildVersionDiffPreview", "buildExportVersionBindingPreview", "buildChangeImpactReport"]) {
  if (!versionPolicy.includes(token)) {
    console.error(`Missing version policy token ${token}`);
    process.exit(1);
  }
}

const editLockPolicy = fs.readFileSync(path.join(root, "backend/src/services/editLockPolicy.js"), "utf8");
for (const token of ["validateTransferRequest", "validateProposalDraft", "validateStaleEdit", "STALE_EDIT_REJECTED"]) {
  if (!editLockPolicy.includes(token)) {
    console.error(`Missing edit lock policy token ${token}`);
    process.exit(1);
  }
}

const dbBootstrapPlan = fs.readFileSync(path.join(root, "tools/iso_db_bootstrap_plan.py"), "utf8");
for (const token of ["not_executed_by_this_tool", "Separate DB execution review", "uconai_iso"]) {
  if (!dbBootstrapPlan.includes(token)) {
    console.error(`Missing DB bootstrap safety token ${token}`);
    process.exit(1);
  }
}

const executionMap = fs.readFileSync(path.join(root, "docs/00_MASTER_EXECUTION_MAP.md"), "utf8");
for (const token of ["Reordered Development Phases", "Phase 1 Work Breakdown", "Cross-check Gate Between Phases"]) {
  if (!executionMap.includes(token)) {
    console.error(`Missing execution map token ${token}`);
    process.exit(1);
  }
}

console.log("ISO smoke check passed");

