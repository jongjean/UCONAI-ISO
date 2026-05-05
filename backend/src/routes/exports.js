import { Router } from "express";
import { ok } from "../http/respond.js";
import { createExportJob } from "../services/exportWorker.js";
import {
  buildExportManifestPreview,
  buildExportReadinessReport,
  buildDocxAssemblyPlan,
  buildDocxStyleMap,
  buildFormalExportGateReport,
  buildFinalPackageChecklist,
  buildOsdCompanionReportPreview,
  buildReadinessChecklist,
  buildSourcePackageBindingReport,
  validateExportRequest
} from "../services/exportPolicy.js";

export const exportsRouter = Router();

exportsRouter.post("/validate", (req, res) => {
  ok(res, validateExportRequest(req.body || {}));
});

exportsRouter.post("/readiness", (req, res) => {
  ok(res, buildReadinessChecklist(req.body || {}));
});

exportsRouter.post("/readiness-report", (req, res) => {
  ok(res, buildExportReadinessReport(req.body || {}));
});

exportsRouter.post("/manifest-preview", (req, res) => {
  ok(res, buildExportManifestPreview(req.body || {}));
});

exportsRouter.post("/docx-assembly-plan", (req, res) => {
  ok(res, buildDocxAssemblyPlan(req.body || {}));
});

exportsRouter.post("/osd-companion-report-preview", (req, res) => {
  ok(res, buildOsdCompanionReportPreview(req.body || {}));
});

exportsRouter.post("/final-package-checklist", (req, res) => {
  ok(res, buildFinalPackageChecklist(req.body || {}));
});

exportsRouter.post("/docx-style-map", (req, res) => {
  ok(res, buildDocxStyleMap(req.body || {}));
});

exportsRouter.post("/formal-gate-report", (req, res) => {
  ok(res, buildFormalExportGateReport(req.body || {}));
});

exportsRouter.post("/source-package-binding-report", (req, res) => {
  ok(res, buildSourcePackageBindingReport(req.body || {}));
});

exportsRouter.post("/jobs", async (req, res, next) => {
  try {
    ok(res, await createExportJob(req.body || {}));
  } catch (error) {
    next(error);
  }
});


