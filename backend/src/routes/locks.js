import { Router } from "express";
import { operationLocked } from "../http/errors.js";
import { ok } from "../http/respond.js";
import {
  describeCollaborationPolicy,
  validateLockRequest,
  validateProposalDraft,
  validateStaleEdit,
  validateTransferRequest
} from "../services/editLockPolicy.js";

export const locksRouter = Router();

locksRouter.get("/policy", (_req, res) => {
  ok(res, describeCollaborationPolicy());
});

locksRouter.post("/validate", (req, res) => {
  ok(res, validateLockRequest(req.body || {}));
});

locksRouter.post("/transfer/validate", (req, res) => {
  ok(res, validateTransferRequest(req.body || {}));
});

locksRouter.post("/proposal/validate", (req, res) => {
  ok(res, validateProposalDraft(req.body || {}));
});

locksRouter.post("/stale-edit/validate", (req, res) => {
  ok(res, validateStaleEdit(req.body || {}));
});

locksRouter.post("/acquire", (_req, _res, next) => {
  next(operationLocked(
    "Edit lock persistence is blocked until user membership and PostgreSQL schema are enabled.",
    { reviewType: "admin-review", blockedResource: "edit_ownership_locks" }
  ));
});

locksRouter.post("/transfer", (_req, _res, next) => {
  next(operationLocked(
    "Edit lock transfer is blocked until audit logging and membership persistence are enabled.",
    { reviewType: "admin-review", blockedResource: "edit_ownership_locks" }
  ));
});


