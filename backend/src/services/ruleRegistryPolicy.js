import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const currentFile = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(currentFile), "../../..");
const registryPath = path.join(projectRoot, "ai-services", "rule-registry.json");

function readRuleRegistry() {
  return JSON.parse(fs.readFileSync(registryPath, "utf8"));
}

function collectCoverage(registry) {
  const domains = new Map(registry.ruleIdPolicy.domains.map((domain) => [domain, 0]));
  const sourceClasses = new Map(registry.ruleClasses.map((ruleClass) => [ruleClass, 0]));
  const severities = new Map(registry.severityLevels.map((severity) => [severity.code, 0]));
  const workflowEffects = new Map(registry.workflowEffects.map((effect) => [effect, 0]));
  const stages = new Map(registry.stages.map((stage) => [stage, 0]));
  const deliverables = new Map(registry.deliverables.map((deliverable) => [deliverable.code, 0]));
  const documentAreas = new Map(registry.applicability.documentAreas.map((area) => [area, 0]));

  for (const rule of registry.rules) {
    const domain = rule.id.split("-")[1];
    domains.set(domain, (domains.get(domain) || 0) + 1);
    sourceClasses.set(rule.class, (sourceClasses.get(rule.class) || 0) + 1);
    severities.set(rule.severity, (severities.get(rule.severity) || 0) + 1);
    workflowEffects.set(rule.workflowEffect, (workflowEffects.get(rule.workflowEffect) || 0) + 1);

    for (const stage of rule.appliesTo.stages) stages.set(stage, (stages.get(stage) || 0) + 1);
    for (const deliverable of rule.appliesTo.deliverables) deliverables.set(deliverable, (deliverables.get(deliverable) || 0) + 1);
    for (const area of rule.appliesTo.documentAreas) documentAreas.set(area, (documentAreas.get(area) || 0) + 1);
  }

  return {
    domains: Object.fromEntries(domains),
    sourceClasses: Object.fromEntries(sourceClasses),
    severities: Object.fromEntries(severities),
    workflowEffects: Object.fromEntries(workflowEffects),
    stages: Object.fromEntries(stages),
    deliverables: Object.fromEntries(deliverables),
    documentAreas: Object.fromEntries(documentAreas)
  };
}

function validateRuleRegistry(registry) {
  const issues = [];
  const sourceIds = new Set(registry.sources.map((source) => source.id));
  const ruleClasses = new Set(registry.ruleClasses);
  const severities = new Set(registry.severityLevels.map((severity) => severity.code));
  const workflowEffects = new Set(registry.workflowEffects);
  const stages = new Set(registry.stages);
  const deliverables = new Set(registry.deliverables.map((deliverable) => deliverable.code));
  const documentAreas = new Set(registry.applicability.documentAreas);
  const ruleIdPattern = new RegExp(registry.ruleIdPolicy.pattern);
  const seenRuleIds = new Set();

  for (const rule of registry.rules) {
    if (!ruleIdPattern.test(rule.id)) issues.push({ ruleId: rule.id, issue: "rule-id-pattern" });
    if (seenRuleIds.has(rule.id)) issues.push({ ruleId: rule.id, issue: "duplicate-rule-id" });
    seenRuleIds.add(rule.id);
    if (!ruleClasses.has(rule.class)) issues.push({ ruleId: rule.id, issue: "unknown-rule-class" });
    if (!severities.has(rule.severity)) issues.push({ ruleId: rule.id, issue: "unknown-severity" });
    if (!workflowEffects.has(rule.workflowEffect)) issues.push({ ruleId: rule.id, issue: "unknown-workflow-effect" });

    for (const sourceId of rule.sourceIds || []) {
      if (!sourceIds.has(sourceId)) issues.push({ ruleId: rule.id, issue: "unknown-source", value: sourceId });
    }
    for (const stage of rule.appliesTo?.stages || []) {
      if (!stages.has(stage)) issues.push({ ruleId: rule.id, issue: "unknown-stage", value: stage });
    }
    for (const deliverable of rule.appliesTo?.deliverables || []) {
      if (!deliverables.has(deliverable)) issues.push({ ruleId: rule.id, issue: "unknown-deliverable", value: deliverable });
    }
    for (const area of rule.appliesTo?.documentAreas || []) {
      if (!documentAreas.has(area)) issues.push({ ruleId: rule.id, issue: "unknown-document-area", value: area });
    }
  }

  return {
    valid: issues.length === 0,
    issues,
    checkedRules: registry.rules.length,
    boundary: "read-only source registry validation; does not fetch external sources or write product state"
  };
}

export function buildRuleRegistrySummary() {
  const registry = readRuleRegistry();
  return {
    version: registry.version,
    updatedAt: registry.updatedAt,
    ruleIdPolicy: registry.ruleIdPolicy,
    sourcePolicy: registry.sourcePolicy,
    counts: {
      sources: registry.sources.length,
      deliverables: registry.deliverables.length,
      stages: registry.stages.length,
      rules: registry.rules.length
    },
    coverage: collectCoverage(registry),
    validation: validateRuleRegistry(registry),
    persistence: "source-registry-read-only"
  };
}

export function buildRuleRegistryValidation() {
  return validateRuleRegistry(readRuleRegistry());
}
