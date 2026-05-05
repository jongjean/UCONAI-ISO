import { Router } from "express";
import { operationLocked } from "../http/errors.js";
import { ok } from "../http/respond.js";
import {
  buildChangeImpactReport,
  buildExportVersionBindingPreview,
  buildSnapshotPreview,
  buildVersionDateBrowser,
  buildVersionDiffPreview,
  validateHistoricalUnlockRequest
} from "../services/versionPolicy.js";

export const versionsRouter = Router();

versionsRouter.get("/policy", (_req, res) => {
  ok(res, {
    historicalSnapshotsReadOnly: true,
    unlockRequires: ["risk-confirmation", "specific-reason", "password-confirmation", "audit-log"],
    persistence: "disabled-until-db-enabled"
  });
});

versionsRouter.post("/snapshot-preview", (req, res) => {
  ok(res, buildSnapshotPreview(req.body?.element || {}, req.body?.user || {}), {
    persistence: "disabled-until-db-enabled"
  });
});

versionsRouter.post("/date-browser-preview", (req, res) => {
  ok(res, buildVersionDateBrowser(req.body || {}));
});

versionsRouter.post("/diff-preview", (req, res) => {
  ok(res, buildVersionDiffPreview(req.body || {}));
});

versionsRouter.post("/export-binding-preview", (req, res) => {
  ok(res, buildExportVersionBindingPreview(req.body || {}));
});

versionsRouter.post("/change-impact-report", (req, res) => {
  ok(res, buildChangeImpactReport(req.body || {}));
});

versionsRouter.post("/historical-unlock/validate", (req, res) => {
  ok(res, validateHistoricalUnlockRequest(req.body || {}));
});

versionsRouter.post("/historical-unlock", (_req, _res, next) => {
  next(operationLocked(
    "Historical version editing is blocked until DB, audit logging and high-risk administrator workflow are implemented.",
    {
      reviewType: "admin-review",
      risk: "historical-version-edit"
    }
  ));
});


