import { Router } from "express";
import { operationLocked } from "../http/errors.js";
import { ok } from "../http/respond.js";
import {
  billingPolicy,
  buildCreditLedgerPreview,
  buildPaymentModelComparison,
  buildPremiumExecutionBudgetGate,
  buildUsageSummaryPreview,
  estimateUsageCost,
  validateEntitlement,
  validateUsageEvent
} from "../services/billingPolicy.js";

export const billingRouter = Router();

billingRouter.get("/policy", (_req, res) => {
  ok(res, billingPolicy());
});

billingRouter.get("/payment-models", (_req, res) => {
  ok(res, buildPaymentModelComparison());
});

billingRouter.post("/usage/validate", (req, res) => {
  ok(res, validateUsageEvent(req.body || {}));
});

billingRouter.post("/entitlement/validate", (req, res) => {
  ok(res, validateEntitlement(req.body || {}));
});

billingRouter.post("/usage/estimate", (req, res) => {
  ok(res, estimateUsageCost(req.body || {}));
});

billingRouter.post("/usage/summary-preview", (req, res) => {
  ok(res, buildUsageSummaryPreview(req.body || {}));
});

billingRouter.post("/credits/ledger-preview", (req, res) => {
  ok(res, buildCreditLedgerPreview(req.body || {}));
});

billingRouter.post("/premium-execution-budget-gate", (req, res) => {
  ok(res, buildPremiumExecutionBudgetGate(req.body || {}));
});

billingRouter.post("/usage", (_req, _res, next) => {
  next(operationLocked(
    "Usage ledger persistence is blocked until billing model and DB schema are enabled.",
    { reviewType: "admin-review", blockedResource: "usage_ledger" }
  ));
});


