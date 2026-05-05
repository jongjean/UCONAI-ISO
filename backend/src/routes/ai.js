import { Router } from "express";
import { operationLocked } from "../http/errors.js";
import { ok } from "../http/respond.js";
import { runAiCommander } from "../services/aiCommander.js";
import {
  aiAgents,
  aiProviders,
  buildAiExecutionEnvelope,
  buildAiPreflightGate,
  buildModelSelectionPolicy,
  buildProviderRoutingMatrix,
  buildUnifiedComputePolicy,
  validateAiRequest
} from "../services/aiGatewayPolicy.js";

export const aiRouter = Router();

aiRouter.get("/providers", (_req, res) => {
  ok(res, { providers: aiProviders, agents: aiAgents });
});

aiRouter.post("/validate", (req, res) => {
  ok(res, validateAiRequest(req.body || {}));
});

aiRouter.post("/model-selection-policy", (req, res) => {
  ok(res, buildModelSelectionPolicy(req.body || {}));
});

aiRouter.post("/execution-envelope", (req, res) => {
  ok(res, buildAiExecutionEnvelope(req.body || {}));
});

aiRouter.post("/preflight-gate", (req, res) => {
  ok(res, buildAiPreflightGate(req.body || {}));
});

aiRouter.post("/provider-routing-matrix", (req, res) => {
  ok(res, buildProviderRoutingMatrix(req.body || {}));
});

aiRouter.post("/unified-compute-policy", (req, res) => {
  ok(res, buildUnifiedComputePolicy(req.body || {}));
});

aiRouter.post("/commander", async (req, res, next) => {
  try {
    ok(res, await runAiCommander(req.body || {}));
  } catch (error) {
    next(error);
  }
});

aiRouter.post("/run", (req, _res, next) => {
  const validation = validateAiRequest(req.body || {});
  next(operationLocked(
    "AI execution is blocked until Ollama/internal provider endpoint and usage logging are configured.",
    {
      reviewType: "admin-review",
      validation
    }
  ));
});


