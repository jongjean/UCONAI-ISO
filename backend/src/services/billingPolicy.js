export function validateUsageEvent(input = {}) {
  const errors = [];

  if (!input.projectId) errors.push({ field: "projectId", code: "PROJECT_REQUIRED", message: "Project ID is required." });
  if (!input.userId) errors.push({ field: "userId", code: "USER_REQUIRED", message: "User ID is required." });
  if (!input.provider) errors.push({ field: "provider", code: "PROVIDER_REQUIRED", message: "Provider is required." });
  if (!input.purpose) errors.push({ field: "purpose", code: "PURPOSE_REQUIRED", message: "Usage purpose is required." });

  return {
    ok: errors.length === 0,
    errors,
    billingMode: "uconai-integrated-credits",
    premiumRequiresBilling: true
  };
}

export function billingPolicy() {
  return {
    defaultMode: "ollama-basic-included",
    premiumMode: "uconai-integrated-credits",
    bringYourOwnKey: "future-enterprise-option",
    browserDirectProviderCalls: false,
    ledgerRequiredFields: ["projectId", "userId", "provider", "model", "purpose", "estimatedCost", "createdAt"]
  };
}

export function validateEntitlement(input = {}) {
  const plan = input.plan || "BASIC";
  const feature = input.feature || "local-ai";
  const premiumFeatures = ["premium-ai", "external-reference-analysis", "large-export-batch"];
  const errors = [];
  const warnings = [];

  if (premiumFeatures.includes(feature) && plan === "BASIC") {
    errors.push({
      field: "plan",
      code: "PLAN_UPGRADE_REQUIRED",
      message: "This feature requires premium entitlement."
    });
  }

  if (premiumFeatures.includes(feature) && input.billingEnabled !== true) {
    errors.push({
      field: "billingEnabled",
      code: "PREMIUM_BILLING_REQUIRED",
      message: "Premium feature activation requires enabled billing and credit policy."
    });
  }

  if (input.remainingCredits !== undefined && Number(input.remainingCredits) <= 0) {
    errors.push({
      field: "remainingCredits",
      code: "NO_CREDITS",
      message: "No remaining premium credits."
    });
  }

  if (feature === "local-ai") {
    warnings.push({
      code: "LOCAL_AI_NOT_BILLED",
      message: "Local Ollama use is intended as included/basic usage, subject to infrastructure policy."
    });
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    feature,
    plan,
    billingMode: premiumFeatures.includes(feature) ? "uconai-integrated-credits" : "included-basic"
  };
}

export function estimateUsageCost(input = {}) {
  const provider = input.provider || "ollama";
  const units = Number(input.units || 0);
  const rates = {
    ollama: 0,
    "premium-api": 1,
    "premium-large-context": 3
  };
  const unitRate = rates[provider] ?? 1;

  return {
    provider,
    units,
    unitRate,
    estimatedCredits: units * unitRate,
    billable: unitRate > 0,
    requiresLedger: unitRate > 0,
    persistence: "disabled-until-billing-db-enabled"
  };
}

export function buildUsageSummaryPreview(input = {}) {
  const events = Array.isArray(input.events) ? input.events : [];
  const rows = events.map((event, index) => ({
    index,
    validation: validateUsageEvent(event),
    estimate: estimateUsageCost(event)
  }));

  return {
    totalEvents: events.length,
    billableEvents: rows.filter((row) => row.estimate.billable).length,
    estimatedCredits: rows.reduce((sum, row) => sum + row.estimate.estimatedCredits, 0),
    invalidEvents: rows.filter((row) => !row.validation.ok).length,
    rows,
    persistence: "disabled-until-billing-db-enabled"
  };
}

export function buildPaymentModelComparison() {
  return {
    recommendedDefault: "uconai-integrated-credits",
    models: [
      {
        id: "uconai-integrated-credits",
        label: "UCONAI integrated credits",
        userExperience: "User subscribes or buys credits inside UCONAI; UCONAI manages provider keys and total usage.",
        strengths: ["simple UX", "central usage control", "membership packaging", "provider abstraction"],
        risks: ["UCONAI carries provider billing exposure", "needs ledger accuracy", "requires quota and abuse controls"]
      },
      {
        id: "bring-your-own-key",
        label: "User-owned provider key",
        userExperience: "User pays AI provider directly and stores/configures their own provider credentials.",
        strengths: ["lower UCONAI billing exposure", "user controls provider account"],
        risks: ["harder onboarding", "key custody complexity", "inconsistent model availability"]
      },
      {
        id: "local-basic",
        label: "Included local Ollama/basic usage",
        userExperience: "Default included AI help through configured local/workstation endpoint.",
        strengths: ["low marginal cost", "privacy-friendly for routine work"],
        risks: ["quality and context limits", "requires workstation availability"]
      }
    ],
    requiredControls: [
      "per-user and per-project credit ledger",
      "provider/model/purpose usage records",
      "cost estimate before premium execution",
      "hard quota stop when credits are exhausted",
      "separate policy for restricted reference files"
    ],
    persistence: "disabled-until-billing-db-enabled"
  };
}

export function buildCreditLedgerPreview(input = {}) {
  const events = Array.isArray(input.events) ? input.events : [];
  let balance = Number(input.openingBalance || 0);
  const rows = events.map((event, index) => {
    const amount = Number(event.amount || estimateUsageCost(event).estimatedCredits || 0);
    const direction = event.type === "credit" ? 1 : -1;
    balance += amount * direction;
    return {
      index,
      type: event.type || "debit",
      provider: event.provider || "ollama",
      purpose: event.purpose || "unspecified",
      amount,
      balanceAfter: balance
    };
  });

  return {
    openingBalance: Number(input.openingBalance || 0),
    closingBalance: balance,
    rows,
    blockedIfNegative: balance < 0,
    persistence: "disabled-until-billing-db-enabled"
  };
}

export function buildPremiumExecutionBudgetGate(input = {}) {
  const entitlement = validateEntitlement({
    plan: input.plan,
    feature: input.feature || "premium-ai",
    billingEnabled: input.billingEnabled,
    remainingCredits: input.remainingCredits
  });
  const estimate = estimateUsageCost({
    provider: input.provider || "premium-api",
    units: input.units || 0
  });
  const remainingCredits = Number(input.remainingCredits || 0);
  const projectedBalance = remainingCredits - estimate.estimatedCredits;
  const blockers = [
    ...entitlement.errors.map((error) => ({
      area: "entitlement",
      code: error.code,
      message: error.message
    }))
  ];

  if (estimate.billable && projectedBalance < 0) {
    blockers.push({
      area: "credits",
      code: "PROJECTED_CREDIT_DEFICIT",
      message: "Estimated premium usage exceeds remaining credits."
    });
  }

  return {
    executionAllowed: false,
    budgetGateOpen: blockers.length === 0,
    entitlement,
    estimate,
    remainingCredits,
    projectedBalance,
    blockers,
    ledgerRequired: estimate.requiresLedger,
    hardQuotaStop: true,
    persistence: "disabled-until-billing-db-enabled"
  };
}

