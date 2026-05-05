import { Router } from "express";
import { ok } from "../http/respond.js";
import {
  createStarterDocument,
  buildDocumentGovernanceContract,
  buildSectionRiskMatrix,
  elementTypes,
  generateNumberingPreview,
  validateDocumentOutline,
  validateElementDraft
} from "../services/documentStructure.js";
import {
  buildBulkDocumentCommandPlan,
  buildDocumentCommandPlan,
  buildDocumentImpactPreview,
  documentCommands,
  validateDocumentCommand
} from "../services/documentCommandPolicy.js";
import { buildDocumentWorkspaceState, validateWorkspaceSubmitReadiness } from "../services/documentWorkspaceState.js";

export const documentsRouter = Router();

documentsRouter.get("/element-types", (_req, res) => {
  ok(res, { elementTypes });
});

documentsRouter.get("/starter", (_req, res) => {
  ok(res, {
    persistence: "disabled-until-db-enabled",
    elements: createStarterDocument()
  });
});

documentsRouter.get("/governance-contract", (req, res) => {
  ok(res, buildDocumentGovernanceContract({ stage: req.query?.stage }));
});

documentsRouter.post("/section-risk-matrix", (req, res) => {
  ok(res, buildSectionRiskMatrix(req.body || {}));
});

documentsRouter.get("/commands", (_req, res) => {
  ok(res, { commands: documentCommands, persistence: "disabled-until-db-enabled" });
});

documentsRouter.post("/commands/validate", (req, res) => {
  ok(res, validateDocumentCommand(req.body || {}));
});

documentsRouter.post("/commands/plan", (req, res) => {
  ok(res, buildDocumentCommandPlan(req.body || {}));
});

documentsRouter.post("/commands/bulk-plan", (req, res) => {
  ok(res, buildBulkDocumentCommandPlan(req.body || {}));
});

documentsRouter.post("/impact-preview", (req, res) => {
  ok(res, buildDocumentImpactPreview(req.body || {}));
});

documentsRouter.post("/workspace-state-preview", (req, res) => {
  ok(res, buildDocumentWorkspaceState(req.body || {}));
});

documentsRouter.post("/submit-readiness/validate", (req, res) => {
  ok(res, validateWorkspaceSubmitReadiness(req.body || {}));
});

documentsRouter.post("/validate-element", (req, res) => {
  ok(res, validateElementDraft(req.body || {}));
});

documentsRouter.post("/validate-outline", (req, res) => {
  ok(res, validateDocumentOutline(req.body?.elements || []));
});

documentsRouter.post("/numbering-preview", (req, res) => {
  ok(res, {
    numbering: generateNumberingPreview(req.body?.elements || createStarterDocument()),
    persistence: "disabled-until-db-enabled"
  });
});


