import { Router } from "express";
import { hpPolicy } from "../config.js";
import { ok } from "../http/respond.js";
import {
  buildAcceptanceGateMatrix,
  buildDevelopmentProgressMap,
  buildFinalEngineCompletionSnapshot,
  buildOperationalRunbookPreview,
  buildReleaseEvidenceChecklist
} from "../services/acceptancePolicy.js";
import {
  buildRuleRegistrySummary,
  buildRuleRegistryValidation
} from "../services/ruleRegistryPolicy.js";

export const policyRouter = Router();

policyRouter.get("/", (_req, res) => {
  ok(res, {
    project: "iso",
    mode: "new-development",
    legacyDataImport: false,
    membershipDatabase: "iso-independent-postgresql",
    hpPolicy
  });
});

policyRouter.post("/acceptance-gate-matrix", (req, res) => {
  ok(res, buildAcceptanceGateMatrix(req.body || {}));
});

policyRouter.post("/release-evidence-checklist", (req, res) => {
  ok(res, buildReleaseEvidenceChecklist(req.body || {}));
});

policyRouter.post("/operational-runbook-preview", (req, res) => {
  ok(res, buildOperationalRunbookPreview(req.body || {}));
});

policyRouter.post("/final-engine-completion-snapshot", (req, res) => {
  ok(res, buildFinalEngineCompletionSnapshot(req.body || {}));
});

policyRouter.post("/development-progress-map", (req, res) => {
  ok(res, buildDevelopmentProgressMap(req.body || {}));
});

policyRouter.get("/rule-registry-summary", (_req, res) => {
  ok(res, buildRuleRegistrySummary());
});

policyRouter.post("/rule-registry/validate", (_req, res) => {
  ok(res, buildRuleRegistryValidation());
});
