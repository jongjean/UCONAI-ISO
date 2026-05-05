import { Router } from "express";
import { operationLocked } from "../http/errors.js";
import { ok } from "../http/respond.js";
import {
  buildBibliographyLinkPreview,
  buildEndnoteBindingPlan,
  buildReferenceGovernanceMatrix,
  buildReferenceReadinessReport,
  buildSourceUseDecisionReport,
  describeBibliographyPolicy,
  validateReferenceDraft
} from "../services/referencePolicy.js";
import { buildSupportingMaterialsReadiness } from "../services/supportingMaterialsReadiness.js";

export const referencesRouter = Router();

referencesRouter.get("/policy", (_req, res) => {
  ok(res, describeBibliographyPolicy());
});

referencesRouter.post("/validate", (req, res) => {
  ok(res, validateReferenceDraft(req.body || {}));
});

referencesRouter.post("/readiness-report", (req, res) => {
  ok(res, buildReferenceReadinessReport(req.body || {}));
});

referencesRouter.post("/bibliography-link-preview", (req, res) => {
  ok(res, buildBibliographyLinkPreview(req.body || {}));
});

referencesRouter.post("/endnote-binding-plan", (req, res) => {
  ok(res, buildEndnoteBindingPlan(req.body || {}));
});

referencesRouter.post("/governance-matrix", (req, res) => {
  ok(res, buildReferenceGovernanceMatrix(req.body || {}));
});

referencesRouter.post("/source-use-decision-report", (req, res) => {
  ok(res, buildSourceUseDecisionReport(req.body || {}));
});

referencesRouter.post("/supporting-materials-readiness", (req, res) => {
  ok(res, buildSupportingMaterialsReadiness(req.body || {}));
});

referencesRouter.post("/", (_req, _res, next) => {
  next(operationLocked(
    "Reference persistence and file upload are blocked until storage and DB policies are enabled.",
    { reviewType: "admin-review", blockedResource: "reference_documents" }
  ));
});


