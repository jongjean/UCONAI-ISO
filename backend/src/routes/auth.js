import { Router } from "express";
import { operationLocked } from "../http/errors.js";
import { ok } from "../http/respond.js";
import {
  authPolicy,
  buildPermissionMatrix,
  buildSessionEnvelope,
  validatePermissionCheck,
  validateRegistrationDraft,
  validateRoleAssignment
} from "../services/authPolicy.js";

export const authRouter = Router();

authRouter.get("/policy", (_req, res) => {
  ok(res, authPolicy());
});

authRouter.post("/registration/validate", (req, res) => {
  ok(res, validateRegistrationDraft(req.body || {}));
});

authRouter.post("/roles/validate", (req, res) => {
  ok(res, validateRoleAssignment(req.body || {}));
});

authRouter.get("/permissions/matrix", (_req, res) => {
  ok(res, buildPermissionMatrix());
});

authRouter.post("/permissions/check", (req, res) => {
  ok(res, validatePermissionCheck(req.body || {}));
});

authRouter.post("/session/preview", (req, res) => {
  ok(res, buildSessionEnvelope(req.body || {}));
});

authRouter.post("/register", (_req, _res, next) => {
  next(operationLocked(
    "User registration persistence is blocked until ISO PostgreSQL auth schema is enabled.",
    { reviewType: "admin-review", blockedResource: "users" }
  ));
});
