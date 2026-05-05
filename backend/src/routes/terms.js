import { Router } from "express";
import { operationLocked } from "../http/errors.js";
import { ok } from "../http/respond.js";
import {
  buildClause3Preview,
  buildTerminologyConsistencyReport,
  validateTermDraft
} from "../services/terminologyPolicy.js";

export const termsRouter = Router();

termsRouter.get("/", (_req, res) => {
  ok(res, {
    clause: "3 Terms and definitions",
    controls: ["existing-term-check", "definition-style-check", "source-check", "change-control"],
    persistence: "disabled-until-db-enabled"
  });
});

termsRouter.post("/validate", (req, res) => {
  ok(res, validateTermDraft(req.body || {}));
});

termsRouter.post("/clause-preview", (req, res) => {
  ok(res, buildClause3Preview(req.body?.terms || []), {
    persistence: "disabled-until-db-enabled"
  });
});

termsRouter.post("/consistency-report", (req, res) => {
  ok(res, buildTerminologyConsistencyReport(req.body || {}));
});

termsRouter.post("/", (_req, _res, next) => {
  next(operationLocked(
    "Term persistence is blocked until the document schema and terminology workflow are enabled.",
    { reviewType: "admin-review", blockedResource: "document_elements TERM" }
  ));
});


