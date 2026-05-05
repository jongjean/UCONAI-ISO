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

const aiPolicy = read("backend/src/services/aiGatewayPolicy.js");
for (const token of [
  "premium-large-context",
  "code-first-generator",
  "buildModelSelectionPolicy",
  "buildUnifiedComputePolicy",
  "unified-compute-policy-only-until-provider-config-enabled",
  "agentSpecificGpuAllocation: false",
  "buildAiExecutionEnvelope",
  "buildAiPreflightGate",
  "buildProviderRoutingMatrix",
  "PREMIUM_PREFLIGHT_BILLING_REQUIRED",
  "RESTRICTED_SOURCE_LOCAL_ONLY",
  "AI_OUTPUT_REVIEW_REQUIRED",
  "PREMIUM_BILLING_NOT_ENABLED",
  "AI_CANONICAL_WRITE_BLOCKED",
  "externalTransmissionAllowed",
  "canonicalWriteAllowed: false"
]) {
  if (!aiPolicy.includes(token)) {
    fail(`Missing AI phase-6 token: ${token}`);
  }
}

const agentContracts = read("backend/src/services/agentContracts.js");
for (const token of [
  "buildAgentOrchestrationPreview",
  "buildAgentBrainPanelPreview",
  "buildSecondCheckpointSnapshot",
  "second-checkpoint-preview-only-until-db-storage-worker-enabled",
  "brain-panel-preview-only-until-provider-config-enabled",
  "buildChiefAgentControlPlan",
  "chief-agent-plan-only-until-provider-config-enabled",
  "chiefMayCreateSpecialistWhenGapDetected",
  "Title & Scope Specialist",
  "Terms & Abbreviations Specialist",
  "Form 4 & Draft Specialist",
  "OSD & Directives Specialist",
  "premiumProviderRequiresBilling",
  "writesCanonicalText: false",
  "User dialogue language can differ from canonical ISO document language"
]) {
  if (!agentContracts.includes(token)) {
    fail(`Missing agent phase-6 token: ${token}`);
  }
}

const authoringGuidance = read("backend/src/services/authoringGuidance.js");
for (const token of [
  "guidanceChannels",
  "buildAuthoringGuidance",
  "buildAgentWorkbenchPreview",
  "directives-osd",
  "standards-style",
  "scope-similarity",
  "editable-source",
  "canonicalWriteAllowed: false"
]) {
  if (!authoringGuidance.includes(token)) {
    fail(`Missing authoring guidance token: ${token}`);
  }
}

const billingPolicy = read("backend/src/services/billingPolicy.js");
for (const token of [
  "buildPaymentModelComparison",
  "buildCreditLedgerPreview",
  "buildPremiumExecutionBudgetGate",
  "uconai-integrated-credits",
  "bring-your-own-key",
  "hard quota stop",
  "PREMIUM_BILLING_REQUIRED",
  "PROJECTED_CREDIT_DEFICIT",
  "hardQuotaStop",
  "blockedIfNegative"
]) {
  if (!billingPolicy.includes(token)) {
    fail(`Missing billing phase-6 token: ${token}`);
  }
}

const routes = [
  ["backend/src/routes/ai.js", 'post("/model-selection-policy"'],
  ["backend/src/routes/ai.js", 'post("/execution-envelope"'],
  ["backend/src/routes/ai.js", 'post("/preflight-gate"'],
  ["backend/src/routes/ai.js", 'post("/provider-routing-matrix"'],
  ["backend/src/routes/ai.js", 'post("/unified-compute-policy"'],
  ["backend/src/routes/agents.js", 'post("/orchestration-preview"'],
  ["backend/src/routes/agents.js", 'post("/chief-control-plan"'],
  ["backend/src/routes/agents.js", 'post("/brain-panel-preview"'],
  ["backend/src/routes/agents.js", 'post("/second-checkpoint-snapshot"'],
  ["backend/src/routes/agents.js", 'post("/authoring-guidance-preview"'],
  ["backend/src/routes/agents.js", 'post("/workbench-preview"'],
  ["backend/src/routes/billing.js", 'get("/payment-models"'],
  ["backend/src/routes/billing.js", 'post("/credits/ledger-preview"'],
  ["backend/src/routes/billing.js", 'post("/premium-execution-budget-gate"']
];

for (const [file, token] of routes) {
  if (!read(file).includes(token)) {
    fail(`Missing route token ${token} in ${file}`);
  }
}

const manifest = read("backend/src/routeManifest.js");
for (const route of [
  "/api/v1/ai/model-selection-policy",
  "/api/v1/ai/execution-envelope",
  "/api/v1/ai/preflight-gate",
  "/api/v1/ai/provider-routing-matrix",
  "/api/v1/ai/unified-compute-policy",
  "/api/v1/agents/orchestration-preview",
  "/api/v1/agents/chief-control-plan",
  "/api/v1/agents/brain-panel-preview",
  "/api/v1/agents/second-checkpoint-snapshot",
  "/api/v1/agents/authoring-guidance-preview",
  "/api/v1/agents/workbench-preview",
  "/api/v1/billing/payment-models",
  "/api/v1/billing/credits/ledger-preview",
  "/api/v1/billing/premium-execution-budget-gate"
]) {
  if (!manifest.includes(route)) {
    fail(`Missing phase-6 route manifest entry: ${route}`);
  }
}

const doc = read("docs/12_13_20_PHASE6_AI_AGENT_BILLING.md");
for (const token of [
  "Provider Selection Policy",
  "AI Preflight and Budget Gate",
  "Agent Policy",
  "Billing Policy",
  "Phase 6 Cross-check"
]) {
  if (!doc.includes(token)) {
    fail(`Missing phase-6 document token: ${token}`);
  }
}

const agentDoc = read("docs/13_AI_AGENT_FUNCTIONS.md");
for (const token of [
  "Chief Agent Council",
  "Chief standard development agent",
  "Authoring Guidance Preview",
  "Directives and OSD",
  "Standards style",
  "Scope and similarity",
  "Editable source"
]) {
  if (!agentDoc.includes(token)) {
    fail(`Missing agent function document token: ${token}`);
  }
}

const frontendData = read("frontend/src/data.ts");
const frontendTypes = read("frontend/src/types.ts");
const app = read("frontend/src/App.tsx");
const styles = read("frontend/src/styles.css");
for (const token of [
  "AiGateSignal",
  "ChiefAgentSignal",
  "BrainPanelSignal",
  "BrainMissionSignal",
  "BrainOpinionSignal",
  "BrainConflictSignal",
  "BrainEvidenceSignal",
  "BrainDecisionLogSignal",
  "aiGateSignals"
  ,"chiefAgentSignals"
  ,"brainPanelSignals"
  ,"brainMissionSignals"
  ,"brainOpinionSignals"
  ,"brainConflictSignals"
  ,"brainEvidenceSignals"
  ,"brainDecisionLogSignals"
]) {
  if (!`${frontendData}\n${frontendTypes}`.includes(token)) {
    fail(`Missing frontend AI gate token: ${token}`);
  }
}

for (const token of [
  "AI Preflight",
  "Chief Agent Council",
  "Agent Brain Panel",
  "Second checkpoint to Phase 7",
  "activeBrainSignals",
  "activeChiefSignals",
  "activeBrainMissions",
  "activeBrainOpinions",
  "activeBrainConflicts",
  "activeBrainEvidence",
  "brainDecisionLog",
  "brainDecision",
  "selectedClause",
  "ai-gate-grid",
  "chief-agent-grid",
  "brain-panel-layout",
  "brain-opinion-grid",
  "brain-conflict-list",
  "brain-evidence-list",
  "brain-action-log",
  "aiGateSignals.map"
  ,"chiefAgentSignals.map"
  ,"brainPanelSignals.map"
  ,"brainMissionSignals.map"
]) {
  if (!`${app}\n${styles}`.includes(token)) {
    fail(`Missing frontend AI gate rendering token: ${token}`);
  }
}

console.log("ISO phase-6 AI agent billing check passed");
