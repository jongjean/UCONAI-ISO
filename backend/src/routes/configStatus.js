import { Router } from "express";
import { buildExecutionModeMatrix, buildHpReadinessGate, validateRuntimeConfig } from "../services/configValidation.js";
import { ok } from "../http/respond.js";

export const configStatusRouter = Router();

configStatusRouter.get("/", (_req, res) => {
  ok(res, validateRuntimeConfig());
});

configStatusRouter.get("/execution-modes", (_req, res) => {
  ok(res, buildExecutionModeMatrix());
});

configStatusRouter.post("/hp-readiness-gate", (req, res) => {
  ok(res, buildHpReadinessGate(req.body || {}));
});



