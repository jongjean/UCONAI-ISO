import { Router } from "express";
import { operationLocked } from "../http/errors.js";
import { ok } from "../http/respond.js";
import {
  buildAgentMatrix,
  buildAgentOrchestrationPreview,
  buildAgentTaskPlan,
  buildAgentBrainPanelPreview,
  buildChiefAgentControlPlan,
  buildSecondCheckpointSnapshot,
  loadAgentContracts,
  validateAgentTask
} from "../services/agentContracts.js";
import { buildAgentWorkbenchPreview, buildAuthoringGuidance } from "../services/authoringGuidance.js";

export const agentsRouter = Router();

agentsRouter.get("/", (_req, res) => {
  ok(res, loadAgentContracts());
});

agentsRouter.get("/matrix", (_req, res) => {
  ok(res, buildAgentMatrix());
});

agentsRouter.post("/validate", (req, res) => {
  ok(res, validateAgentTask(req.body || {}));
});

agentsRouter.post("/plan", (req, res) => {
  ok(res, buildAgentTaskPlan(req.body || {}));
});

agentsRouter.post("/orchestration-preview", (req, res) => {
  ok(res, buildAgentOrchestrationPreview(req.body || {}));
});

agentsRouter.post("/chief-control-plan", (req, res) => {
  ok(res, buildChiefAgentControlPlan(req.body || {}));
});

agentsRouter.post("/brain-panel-preview", (req, res) => {
  ok(res, buildAgentBrainPanelPreview(req.body || {}));
});

agentsRouter.post("/second-checkpoint-snapshot", (req, res) => {
  ok(res, buildSecondCheckpointSnapshot(req.body || {}));
});

agentsRouter.post("/authoring-guidance-preview", (req, res) => {
  ok(res, buildAuthoringGuidance(req.body || {}));
});

agentsRouter.post("/workbench-preview", (req, res) => {
  ok(res, buildAgentWorkbenchPreview(req.body || {}));
});

agentsRouter.post("/run", (req, _res, next) => {
  const validation = validateAgentTask(req.body || {});
  next(operationLocked(
    "AI agent execution is blocked until the provider gateway is configured by an administrator.",
    { reviewType: "admin-review", validation }
  ));
});


