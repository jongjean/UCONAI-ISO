export const aiProviders = [
  {
    id: "ollama",
    label: "Workstation Ollama",
    tier: "local-basic",
    default: true,
    requiresEndpointConfig: true,
    externalPaid: false
  },
  {
    id: "premium-api",
    label: "Premium API",
    tier: "premium",
    default: false,
    requiresEndpointConfig: true,
    externalPaid: true
  },
  {
    id: "premium-large-context",
    label: "Premium large-context API",
    tier: "premium",
    default: false,
    requiresEndpointConfig: true,
    externalPaid: true
  },
  {
    id: "code-first-generator",
    label: "Code-first editable artifact generator",
    tier: "tool",
    default: false,
    requiresEndpointConfig: true,
    externalPaid: false
  }
];

export const aiAgents = [
  "codesign",
  "drafting",
  "directives-osd-check",
  "style-check",
  "roadmap",
  "reference",
  "figure-source",
  "consensus"
];

export function validateAiRequest(input = {}) {
  const errors = [];
  const warnings = [];
  const provider = aiProviders.find((item) => item.id === input.provider) || aiProviders[0];

  if (!aiAgents.includes(input.agent)) {
    errors.push({
      field: "agent",
      code: "INVALID_AGENT",
      message: "AI agent is not registered."
    });
  }

  if (provider.externalPaid && input.billingEnabled !== true) {
    errors.push({
      field: "provider",
      code: "PREMIUM_BILLING_NOT_ENABLED",
      message: "Premium external API requires enabled billing and credit policy."
    });
  }

  if (input.includesRestrictedFile === true && input.externalTransmissionAllowed !== true) {
    errors.push({
      field: "files",
      code: "RESTRICTED_FILE_EXTERNAL_BLOCKED",
      message: "Restricted files cannot be sent externally unless the project policy explicitly permits it."
    });
  }

  if (input.writeCanonical === true) {
    errors.push({
      field: "writeCanonical",
      code: "AI_CANONICAL_WRITE_BLOCKED",
      message: "AI may propose text but cannot write canonical document content directly."
    });
  }

  if (provider.id === "ollama") {
    warnings.push({
      code: "LOCAL_PROVIDER_NOT_CONNECTED",
      message: "Ollama endpoint is planned but not connected yet."
    });
  }

  return {
    ok: errors.length === 0,
    provider,
    errors,
    warnings,
    usageLoggingRequired: true,
    canonicalWriteAllowed: false
  };
}

export function buildModelSelectionPolicy(input = {}) {
  const task = input.task || "drafting";
  const sensitivity = input.sensitivity || "normal";
  const requiresLargeContext = input.requiresLargeContext === true;
  const requiresEditableArtifact = input.requiresEditableArtifact === true;

  const recommendedProvider = requiresEditableArtifact
    ? "code-first-generator"
    : requiresLargeContext
      ? "premium-large-context"
      : "ollama";

  return {
    task,
    sensitivity,
    recommendedProvider,
    fallbackOrder: buildFallbackOrder({ requiresLargeContext, requiresEditableArtifact, sensitivity }),
    selectionRules: [
      "Use local Ollama/workstation first for routine drafting and advisory checks.",
      "Use premium API only for high-value reasoning, large context review, or complex comparison.",
      "Use code-first generation for editable figures, DOCX/PPTX artifacts, tables and diagrams.",
      "Never send restricted reference files externally unless the project policy explicitly permits it.",
      "AI output remains proposed text until an authorized editor accepts it."
    ],
    persistence: "disabled-until-provider-config-enabled"
  };
}

export function buildAiExecutionEnvelope(input = {}) {
  const validation = validateAiRequest(input);
  return {
    validation,
    executionAllowed: false,
    envelope: {
      requestId: input.requestId || "preview-only",
      provider: validation.provider.id,
      agent: input.agent || null,
      purpose: input.purpose || "unspecified",
      canonicalWriteAllowed: false,
      usageLoggingRequired: true,
      costEstimationRequired: validation.provider.externalPaid,
      sourcePolicyRequired: input.includesRestrictedFile === true
    },
    blockedReason: "AI execution is disabled until provider configuration, usage logging and entitlement checks are enabled."
  };
}

export function buildAiPreflightGate(input = {}) {
  const selection = buildModelSelectionPolicy(input);
  const envelope = buildAiExecutionEnvelope({
    ...input,
    provider: input.provider || selection.recommendedProvider
  });
  const blockers = [
    ...envelope.validation.errors.map((error) => ({
      area: "request",
      code: error.code,
      message: error.message,
      field: error.field
    })),
    ...preflightPolicyBlockers(input, selection)
  ];

  return {
    task: selection.task,
    recommendedProvider: selection.recommendedProvider,
    fallbackOrder: selection.fallbackOrder,
    executionAllowed: false,
    gateOpen: blockers.length === 0,
    envelope,
    blockers,
    warnings: envelope.validation.warnings,
    requiredBeforeExecution: [
      "provider endpoint configuration",
      "usage logging",
      "entitlement and credit check for premium providers",
      "restricted source transmission policy",
      "human review before canonical text write"
    ],
    canonicalWriteAllowed: false,
    persistence: "disabled-until-provider-config-enabled"
  };
}

export function buildProviderRoutingMatrix(input = {}) {
  const sensitivity = input.sensitivity || "normal";
  const tasks = Array.isArray(input.tasks) && input.tasks.length > 0
    ? input.tasks
    : ["drafting", "directives-osd-check", "scope-similarity", "figure-source", "consensus", "large-context-review"];

  return {
    sensitivity,
    routes: tasks.map((task) => {
      const selection = buildModelSelectionPolicy({
        task,
        sensitivity,
        requiresLargeContext: task === "large-context-review" || task === "scope-similarity",
        requiresEditableArtifact: task === "figure-source"
      });
      return {
        task,
        recommendedProvider: selection.recommendedProvider,
        fallbackOrder: selection.fallbackOrder,
        browserDirectCallAllowed: false,
        sourcePolicyRequired: sensitivity === "restricted" || task === "scope-similarity"
      };
    }),
    policy: {
      localFirst: true,
      premiumOnlyForHighValueReasoning: true,
      codeFirstForEditableArtifacts: true,
      browserDirectProviderCalls: false
    },
    persistence: "disabled-until-provider-config-enabled"
  };
}

export function buildUnifiedComputePolicy(input = {}) {
  const workload = input.workload || "agent-council-preview";
  const sensitivity = input.sensitivity || "normal";
  const expectedConcurrency = Number(input.expectedConcurrency || 1);
  const providerMatrix = buildProviderRoutingMatrix({
    sensitivity,
    tasks: input.tasks
  });

  return {
    workload,
    modelPolicy: {
      agentSpecificModels: false,
      routingUnit: "task-risk-context-budget",
      defaultProvider: "ollama",
      highValueFallback: "premium-api",
      largeContextFallback: "premium-large-context",
      editableArtifactRoute: "code-first-generator"
    },
    gpuPolicy: {
      agentSpecificGpuAllocation: false,
      singleWorkstationGpuPool: true,
      hpRunsHeavyModelInference: false,
      queueRequiredWhenConcurrencyExceeds: 1,
      expectedConcurrency,
      schedulingMode: expectedConcurrency > 1 ? "queued-shared-gpu" : "single-shared-gpu"
    },
    operationsBoundary: {
      hpRole: "source, policy, queue, storage and control surface",
      workstationRole: "Ollama, embedding, generation and optional fine-tune experiments",
      browserDirectProviderCalls: false,
      externalAutomationBelongsOutsideProductCode: true
    },
    routes: providerMatrix.routes,
    persistence: "unified-compute-policy-only-until-provider-config-enabled"
  };
}

function buildFallbackOrder({ requiresLargeContext, requiresEditableArtifact, sensitivity }) {
  if (requiresEditableArtifact) return ["code-first-generator", "ollama", "premium-api"];
  if (sensitivity === "restricted") return ["ollama"];
  if (requiresLargeContext) return ["premium-large-context", "premium-api", "ollama"];
  return ["ollama", "premium-api"];
}

function preflightPolicyBlockers(input, selection) {
  const blockers = [];
  if (selection.recommendedProvider.startsWith("premium") && input.billingEnabled !== true) {
    blockers.push({
      area: "billing",
      code: "PREMIUM_PREFLIGHT_BILLING_REQUIRED",
      message: "Premium model routing requires enabled billing and credit policy."
    });
  }
  if (input.includesRestrictedFile === true && input.externalTransmissionAllowed !== true && selection.recommendedProvider !== "ollama") {
    blockers.push({
      area: "source-policy",
      code: "RESTRICTED_SOURCE_LOCAL_ONLY",
      message: "Restricted sources should remain local unless external transmission is explicitly allowed."
    });
  }
  if (input.acceptAsCanonical === true) {
    blockers.push({
      area: "document",
      code: "AI_OUTPUT_REVIEW_REQUIRED",
      message: "AI output must remain a proposal until a human editor reviews and accepts it through document command flow."
    });
  }
  return blockers;
}

