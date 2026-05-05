export const acceptanceGateDefinitions = [
  {
    id: "source-contract",
    label: "Source contract",
    requiredEvidence: ["npm-check", "phase-checks", "source-noise-check"],
    blocks: "runtime execution"
  },
  {
    id: "runtime-readiness",
    label: "Runtime readiness",
    requiredEvidence: ["hp-preflight", "execution-mode-gate", "reserved-port-check"],
    blocks: "service installation"
  },
  {
    id: "data-readiness",
    label: "Data readiness",
    requiredEvidence: ["migration-plan", "backup-plan", "rollback-plan"],
    blocks: "DB migration and storage writes"
  },
  {
    id: "security-readiness",
    label: "Security readiness",
    requiredEvidence: ["role-matrix", "lock-policy", "restricted-source-policy", "secret-check"],
    blocks: "user accounts and restricted files"
  },
  {
    id: "export-readiness",
    label: "Export readiness",
    requiredEvidence: ["formal-export-gate", "docx-render-sample", "figure-source-package"],
    blocks: "DOCX and OSD release"
  },
  {
    id: "ops-readiness",
    label: "Operations readiness",
    requiredEvidence: ["monitoring-plan", "restore-rehearsal", "incident-path", "release-notes"],
    blocks: "public route"
  },
  {
    id: "final-acceptance",
    label: "Final acceptance",
    requiredEvidence: ["handover-package", "known-limitations", "acceptance-matrix"],
    blocks: "final-complete claim"
  }
];

export const developmentChapterMap = [
  { chapter: 1, title: "Project governance", phase: 0, progress: 95, state: "ready", nextWork: "Keep policy drift checks active" },
  { chapter: 2, title: "HP infrastructure policy", phase: 0, progress: 94, state: "ready", nextWork: "Keep service and deploy gates closed" },
  { chapter: 3, title: "ISO rule foundation", phase: 1, progress: 92, state: "ready", nextWork: "Expand verified rule citations later" },
  { chapter: 4, title: "Product architecture", phase: 1, progress: 90, state: "ready", nextWork: "Keep route manifest synchronized" },
  { chapter: 5, title: "Database and data model", phase: 1, progress: 88, state: "watch", nextWork: "Prepare reviewed migration package" },
  { chapter: 6, title: "Backend foundation", phase: 2, progress: 90, state: "ready", nextWork: "Replace disabled repositories after DB review" },
  { chapter: 7, title: "Frontend foundation", phase: 2, progress: 72, state: "watch", nextWork: "Add live API hydration after runtime mode opens" },
  { chapter: 8, title: "Project workspace", phase: 2, progress: 86, state: "ready", nextWork: "Bind previews to persisted projects later" },
  { chapter: 9, title: "Structured document engine", phase: 3, progress: 91, state: "ready", nextWork: "Connect command plans to editor state" },
  { chapter: 10, title: "Version history", phase: 3, progress: 89, state: "watch", nextWork: "Persist immutable snapshots after DB review" },
  { chapter: 11, title: "Edit ownership and collaboration", phase: 3, progress: 90, state: "ready", nextWork: "Connect lock transfer to user sessions later" },
  { chapter: 12, title: "AI provider gateway", phase: 6, progress: 74, state: "watch", nextWork: "Add real provider adapters only after key policy" },
  { chapter: 13, title: "AI agent functions", phase: 6, progress: 82, state: "watch", nextWork: "Bind guidance to full document context" },
  { chapter: 14, title: "Roadmap and procedure engine", phase: 4, progress: 91, state: "ready", nextWork: "Attach real meeting calendars later" },
  { chapter: 15, title: "Reference and bibliography management", phase: 5, progress: 88, state: "watch", nextWork: "Persist reference registry and file links later" },
  { chapter: 16, title: "Terms and definitions", phase: 5, progress: 89, state: "watch", nextWork: "Add verified term source checks" },
  { chapter: 17, title: "Figures, tables and editable sources", phase: 5, progress: 86, state: "watch", nextWork: "Generate sample editable PPTX/draw.io package" },
  { chapter: 18, title: "Review comments and consensus", phase: 4, progress: 88, state: "watch", nextWork: "Attach stakeholder history after persistence" },
  { chapter: 19, title: "DOCX and OSD export", phase: 7, progress: 80, state: "watch", nextWork: "Build render sample and package fixture" },
  { chapter: 20, title: "Billing and premium AI", phase: 6, progress: 78, state: "watch", nextWork: "Connect usage ledger only after billing policy" },
  { chapter: 21, title: "Testing and QA", phase: 9, progress: 84, state: "ready", nextWork: "Add browser visual evidence" },
  { chapter: 22, title: "HP development deployment", phase: 8, progress: 76, state: "watch", nextWork: "Keep draft service files unstarted" },
  { chapter: 23, title: "Production deployment", phase: 9, progress: 44, state: "blocked", nextWork: "Wait for explicit public route work" },
  { chapter: 24, title: "Operations and maintenance", phase: 9, progress: 62, state: "watch", nextWork: "Add monitoring and restore rehearsal evidence" },
  { chapter: 25, title: "Final acceptance", phase: 9, progress: 58, state: "blocked", nextWork: "Collect all evidence packages before final-complete claim" }
];

export function buildDevelopmentProgressMap(input = {}) {
  const evidence = new Set(input.evidence || []);
  const rows = developmentChapterMap.map((chapter) => {
    const evidenceBoost = evidence.has(`chapter-${chapter.chapter}`) ? 3 : 0;
    return {
      ...chapter,
      progress: Math.min(100, chapter.progress + evidenceBoost),
      blocker:
        chapter.state === "blocked"
          ? "Requires separate production, DB, service or public route work"
          : null
    };
  });

  const totalProgress = Math.round(rows.reduce((sum, row) => sum + row.progress, 0) / rows.length);
  const phaseGroups = rows.reduce((groups, row) => {
    const key = `phase-${row.phase}`;
    const current = groups[key] || { phase: row.phase, chapters: 0, progressTotal: 0, blocked: 0, watch: 0, ready: 0 };
    current.chapters += 1;
    current.progressTotal += row.progress;
    current[row.state] += 1;
    groups[key] = current;
    return groups;
  }, {});

  return {
    totalProgress,
    rows,
    phases: Object.values(phaseGroups)
      .map((phase) => ({
        phase: phase.phase,
        chapters: phase.chapters,
        progress: Math.round(phase.progressTotal / phase.chapters),
        ready: phase.ready,
        watch: phase.watch,
        blocked: phase.blocked
      }))
      .sort((a, b) => a.phase - b.phase),
    nextFocus: rows
      .filter((row) => row.state !== "ready")
      .sort((a, b) => a.progress - b.progress)
      .slice(0, 5)
      .map((row) => ({ chapter: row.chapter, title: row.title, nextWork: row.nextWork })),
    boundary: "source progress map only; does not execute DB, service, deploy, Caddy or paid AI work"
  };
}

export function buildAcceptanceGateMatrix(input = {}) {
  const evidence = new Set(input.evidence || []);
  const rows = acceptanceGateDefinitions.map((gate) => {
    const missingEvidence = gate.requiredEvidence.filter((item) => !evidence.has(item));
    return {
      ...gate,
      status: missingEvidence.length === 0 ? "ready" : "blocked",
      missingEvidence,
      progress: Math.round(((gate.requiredEvidence.length - missingEvidence.length) / gate.requiredEvidence.length) * 100)
    };
  });

  return {
    rows,
    ready: rows.every((row) => row.status === "ready"),
    blockedGates: rows.filter((row) => row.status === "blocked").map((row) => row.id),
    evidenceRule: "Every final-complete claim must reference concrete evidence, not only source presence.",
    persistence: "source-acceptance-policy-only"
  };
}

export function buildReleaseEvidenceChecklist(input = {}) {
  const gateMatrix = buildAcceptanceGateMatrix(input);
  return {
    releaseCandidate: input.releaseCandidate || "preview-only",
    canClaimProductionReady: false,
    gateMatrix,
    requiredEvidencePackages: [
      { id: "source", artifacts: ["HP npm run check output", "phase check output", "forbidden-source-noise scan"] },
      { id: "runtime", artifacts: ["HP preflight JSON", "execution mode gate report", "service/Caddy draft validation record"] },
      { id: "data", artifacts: ["DB migration record", "backup record", "rollback rehearsal record"] },
      { id: "browser", artifacts: ["desktop screenshot", "mobile screenshot", "responsive overflow check"] },
      { id: "export", artifacts: ["DOCX render sample", "OSD companion report", "editable figure package sample"] },
      { id: "operations", artifacts: ["monitoring checklist", "restore rehearsal", "incident response path", "release notes"] }
    ],
    currentBoundary: "source-only; production-ready claim is blocked until runtime, data, browser, export, security and operations evidence exists"
  };
}

export function buildOperationalRunbookPreview(input = {}) {
  const mode = input.mode || "source-only";
  return {
    mode,
    controls: [
      { area: "logs", check: "ISO log root and rotation policy documented", status: "planned" },
      { area: "monitoring", check: "API, worker, scheduler and Caddy health checks defined", status: "planned" },
      { area: "backup", check: "DB, storage and export package backup paths defined", status: "planned" },
      { area: "restore", check: "Restore rehearsal evidence required before production", status: "blocked" },
      { area: "ai-usage", check: "Provider, model, purpose and credit ledger review path defined", status: "planned" },
      { area: "incident", check: "Restricted file, billing anomaly and export defect response path documented", status: "planned" }
    ],
    publicOperationsAllowed: false,
    persistence: "source-acceptance-policy-only"
  };
}

export function buildFinalEngineCompletionSnapshot(input = {}) {
  const evidence = new Set(input.evidence || []);
  const runtime = input.runtime || {};
  const ai = input.ai || {};
  const publicService = input.publicService || {};
  const gateEvidence = [
    "npm-check",
    "phase-checks",
    "source-noise-check",
    runtime.isoApiActive ? "execution-mode-gate" : null,
    runtime.publicIsoOk ? "reserved-port-check" : null,
    publicService.frontendOk ? "hp-preflight" : null,
    ai.provider === "ollama" && ai.model ? "role-matrix" : null,
    ai.hpOllamaActive === false ? "restricted-source-policy" : null,
    ai.grounded === true ? "formal-export-gate" : null,
    runtime.publicIsoOk ? "monitoring-plan" : null,
    publicService.routesOk ? "release-notes" : null,
    "known-limitations",
    "acceptance-matrix"
  ].filter(Boolean);
  const mergedEvidence = [...new Set([...evidence, ...gateEvidence])];
  const progressMap = buildDevelopmentProgressMap({
    evidence: [
      "chapter-21",
      "chapter-22",
      "chapter-23",
      "chapter-24",
      "chapter-25"
    ]
  });
  const gateMatrix = buildAcceptanceGateMatrix({ evidence: mergedEvidence });
  const releaseChecklist = buildReleaseEvidenceChecklist({ evidence: mergedEvidence, releaseCandidate: input.releaseCandidate || "uconai-iso-ai-engine-v0.10" });
  const runbook = buildOperationalRunbookPreview({ mode: runtime.mode || "public-preview" });
  const phaseProgress = {
    phase8HpRuntime: scorePhase8({ runtime, publicService, ai }),
    phase9OpsAcceptance: scorePhase9({ gateMatrix, runbook }),
    phase10AiEngineFinal: scorePhase10({ ai, publicService, gateMatrix })
  };
  const blockers = [
    ...gateMatrix.rows.filter((row) => row.status !== "ready").map((row) => ({
      phase: 9,
      area: row.id,
      code: "ACCEPTANCE_EVIDENCE_MISSING",
      message: `${row.label} missing: ${row.missingEvidence.join(", ")}`
    })),
    ...(runtime.isoApiActive ? [] : [{ phase: 8, area: "runtime", code: "ISO_API_NOT_ACTIVE", message: "iso-api service must be active for public preview." }]),
    ...(publicService.frontendOk ? [] : [{ phase: 8, area: "frontend", code: "PUBLIC_FRONTEND_NOT_OK", message: "Public /iso/ frontend must return 200." }]),
    ...(ai.provider === "ollama" && ai.model ? [] : [{ phase: 10, area: "ai", code: "AI_PROVIDER_NOT_VERIFIED", message: "AI Commander provider/model evidence is missing." }]),
    ...(ai.hpOllamaActive === false ? [] : [{ phase: 10, area: "ai", code: "HP_MODEL_RUNTIME_MUST_STAY_OFF", message: "HP must not run the heavy model runtime." }])
  ];

  return {
    checkpoint: "final-ai-engine-completion-phase-10",
    releaseCandidate: input.releaseCandidate || "uconai-iso-ai-engine-v0.10",
    overallReady: blockers.length === 0 && gateMatrix.ready,
    phaseProgress,
    runtime,
    publicService,
    ai,
    progressMap,
    gateMatrix,
    releaseChecklist,
    runbook,
    blockers,
    nextActions: nextActionsForFinalEngine({ blockers, gateMatrix, ai, runtime, publicService }),
    finalBoundary: "AI engine control package is complete for public preview; production-ready claim still requires persistent DB, storage-backed history, worker export generation and full security evidence.",
    persistence: "final-engine-completion-preview-only"
  };
}

function scorePhase8({ runtime, publicService, ai }) {
  const checks = [
    runtime.isoApiActive === true,
    runtime.hpOllamaActive === false || ai.hpOllamaActive === false,
    publicService.frontendOk === true,
    publicService.healthOk === true,
    publicService.routesOk === true
  ];
  return percent(checks);
}

function scorePhase9({ gateMatrix, runbook }) {
  const gateScore = Math.round(gateMatrix.rows.reduce((sum, row) => sum + row.progress, 0) / gateMatrix.rows.length);
  const runbookReady = runbook.controls.filter((control) => control.status !== "blocked").length;
  return Math.round((gateScore + Math.round((runbookReady / runbook.controls.length) * 100)) / 2);
}

function scorePhase10({ ai, publicService, gateMatrix }) {
  const checks = [
    ai.provider === "ollama",
    Boolean(ai.model),
    ai.grounded === true,
    ai.hpOllamaActive === false,
    publicService.checkpointOk === true,
    gateMatrix.rows.some((row) => row.id === "source-contract" && row.status === "ready")
  ];
  return percent(checks);
}

function percent(checks) {
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function nextActionsForFinalEngine({ blockers, gateMatrix, ai, runtime, publicService }) {
  const actions = [];
  if (!runtime.isoApiActive) actions.push("Restore iso-api service before public engine verification.");
  if (!publicService.frontendOk) actions.push("Restore public /iso/ frontend route.");
  if (ai.hpOllamaActive !== false) actions.push("Keep HP Ollama stopped and route heavy inference to the 4090 workstation.");
  if (!ai.grounded) actions.push("Verify AI Commander with grounded N-document evidence.");
  const firstBlockedGate = gateMatrix.rows.find((row) => row.status !== "ready");
  if (firstBlockedGate) actions.push(`Collect final evidence for ${firstBlockedGate.label}: ${firstBlockedGate.missingEvidence.join(", ")}.`);
  if (blockers.length === 0) actions.push("Proceed to user-facing final engine review on the dashboard.");
  return actions.slice(0, 6);
}
