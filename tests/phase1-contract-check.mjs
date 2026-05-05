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

const ruleRegistry = JSON.parse(read("ai-services/rule-registry.json"));
const sourceIds = new Set(ruleRegistry.sources.map((source) => source.id));
const deliverables = new Set(ruleRegistry.deliverables.map((deliverable) => deliverable.code));
const stages = new Set(ruleRegistry.stages);
const ruleClasses = new Set(ruleRegistry.ruleClasses);
const severityLevels = new Set(ruleRegistry.severityLevels.map((severity) => severity.code));
const workflowEffects = new Set(ruleRegistry.workflowEffects);
const documentAreas = new Set(ruleRegistry.applicability.documentAreas);
const ruleIdPattern = new RegExp(ruleRegistry.ruleIdPolicy.pattern);

if (!ruleRegistry.ruleIdPolicy || ruleRegistry.ruleIdPolicy.format !== "ISO-{DOMAIN}-{NNN}") {
  fail("Missing or invalid rule ID policy");
}

if (!Array.isArray(ruleRegistry.rules) || ruleRegistry.rules.length < 10) {
  fail("Expected at least 10 phase-1 rules in the rule registry");
}

const seenRuleIds = new Set();
for (const rule of ruleRegistry.rules) {
  if (!ruleIdPattern.test(rule.id)) {
    fail(`Rule ID does not match policy: ${rule.id}`);
  }
  if (seenRuleIds.has(rule.id)) {
    fail(`Duplicate rule ID: ${rule.id}`);
  }
  seenRuleIds.add(rule.id);

  if (!ruleClasses.has(rule.class)) {
    fail(`Invalid rule class for ${rule.id}: ${rule.class}`);
  }
  if (!severityLevels.has(rule.severity)) {
    fail(`Invalid severity for ${rule.id}: ${rule.severity}`);
  }
  if (!workflowEffects.has(rule.workflowEffect)) {
    fail(`Invalid workflow effect for ${rule.id}: ${rule.workflowEffect}`);
  }
  for (const sourceId of rule.sourceIds) {
    if (!sourceIds.has(sourceId)) {
      fail(`Rule ${rule.id} references unknown source ${sourceId}`);
    }
  }
  for (const deliverable of rule.appliesTo.deliverables) {
    if (!deliverables.has(deliverable)) {
      fail(`Rule ${rule.id} references unknown deliverable ${deliverable}`);
    }
  }
  for (const stage of rule.appliesTo.stages) {
    if (!stages.has(stage)) {
      fail(`Rule ${rule.id} references unknown stage ${stage}`);
    }
  }
  for (const area of rule.appliesTo.documentAreas) {
    if (!documentAreas.has(area)) {
      fail(`Rule ${rule.id} references unknown document area ${area}`);
    }
  }
}

const contracts = read("backend/src/contracts.js");
for (const token of [
  "apiContractPolicy",
  "schemaContractPolicy",
  "eventVocabularyPolicy",
  "responseEnvelope",
  "errorEnvelope",
  "runtimeGates",
  "blockedPrefixes"
]) {
  if (!contracts.includes(token)) {
    fail(`Missing product contract token: ${token}`);
  }
}

for (const blockedPrefix of ["external-control.", "operator-bridge.", "message-bridge.", "agent-runner."]) {
  if (!contracts.includes(`"${blockedPrefix}"`)) {
    fail(`Missing blocked event prefix: ${blockedPrefix}`);
  }
}

const schema = read("backend/prisma/schema.prisma");
for (const token of [
  "Do not run migrations before the ISO database execution plan is reviewed.",
  "createdSnapshots   DocumentVersionSnapshot[]",
  "heldLocks          EditOwnershipLock[]",
  "createdBy User? @relation(fields: [createdById], references: [id])",
  "holder  User            @relation(fields: [holderId], references: [id])",
  "reference ReferenceDocument? @relation(fields: [referenceId], references: [id])",
  "element DocumentElement? @relation(fields: [elementId], references: [id])",
  "@@index([projectId, parentId])",
  "@@index([projectId, status])",
  "@@index([projectId, createdAt])",
  "@@unique([ownerType, ownerId])"
]) {
  if (!schema.includes(token)) {
    fail(`Missing phase-1 schema token: ${token}`);
  }
}

const phaseDoc = read("docs/03_04_05_PHASE1_CONTRACTS.md");
for (const token of [
  "Rule Registry Contract",
  "API Contract Policy",
  "Schema Contract Review",
  "Cross-check Gate"
]) {
  if (!phaseDoc.includes(token)) {
    fail(`Missing phase-1 document token: ${token}`);
  }
}

const policyRoute = read("backend/src/routes/policy.js");
for (const token of [
  "buildRuleRegistrySummary",
  "buildRuleRegistryValidation",
  'get("/rule-registry-summary"',
  'post("/rule-registry/validate"'
]) {
  if (!policyRoute.includes(token)) {
    fail(`Missing rule registry policy route token: ${token}`);
  }
}

const ruleRegistryPolicy = read("backend/src/services/ruleRegistryPolicy.js");
for (const token of [
  "buildRuleRegistrySummary",
  "buildRuleRegistryValidation",
  "source-registry-read-only",
  "read-only source registry validation"
]) {
  if (!ruleRegistryPolicy.includes(token)) {
    fail(`Missing rule registry policy service token: ${token}`);
  }
}

const routeManifest = read("backend/src/routeManifest.js");
for (const token of [
  "/api/v1/policy/rule-registry-summary",
  "/api/v1/policy/rule-registry/validate"
]) {
  if (!routeManifest.includes(token)) {
    fail(`Missing rule registry manifest route: ${token}`);
  }
}

console.log("ISO phase-1 contract check passed");
