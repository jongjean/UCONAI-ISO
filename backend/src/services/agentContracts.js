import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contractsPath = path.resolve(__dirname, "../../../ai-services/agent-contracts.json");

export function loadAgentContracts() {
  const raw = fs.readFileSync(contractsPath, "utf8");
  return JSON.parse(raw);
}

export function validateAgentTask(input = {}) {
  const contracts = loadAgentContracts();
  const agent = contracts.agents.find((item) => item.id === input.agent);
  const errors = [];
  const warnings = [];

  if (!agent) {
    errors.push({ field: "agent", code: "UNKNOWN_AGENT", message: "Agent is not registered." });
  }

  if (!input.projectContext) {
    warnings.push({ field: "projectContext", code: "PROJECT_CONTEXT_MISSING", message: "Project context improves ISO-specific guidance." });
  }

  if (input.writeMode === "canonical") {
    errors.push({ field: "writeMode", code: "CANONICAL_WRITE_BLOCKED", message: "AI agents may propose changes but must not write canonical text directly." });
  }

  return {
    ok: errors.length === 0,
    agent: agent || null,
    errors,
    warnings
  };
}

export function buildAgentTaskPlan(input = {}) {
  const validation = validateAgentTask(input);
  const agent = validation.agent;

  if (!agent) {
    return {
      validation,
      plan: null
    };
  }

  const plan = {
    agent: agent.id,
    label: agent.label,
    executionAllowed: false,
    blockedReason: "AI model execution requires configured provider gateway and usage logging.",
    canonicalWriteAllowed: false,
    inputChecklist: inputChecklistFor(agent.id),
    outputContract: outputContractFor(agent.id),
    reviewRequired: true,
    persistence: "disabled-until-db-enabled"
  };

  return {
    validation,
    plan
  };
}

export function buildAgentMatrix() {
  const contracts = loadAgentContracts();
  return {
    agents: contracts.agents.map((agent) => ({
      id: agent.id,
      label: agent.label,
      purpose: agent.purpose,
      requiresModel: agent.requiresModel,
      writesCanonicalText: false,
      inputChecklist: inputChecklistFor(agent.id),
      outputContract: outputContractFor(agent.id)
    })),
    policy: {
      executionLockedUntilConfigured: true,
      canonicalTextWriteBlocked: true,
      localProviderFirst: true,
      premiumProviderRequiresBilling: true
    }
  };
}

export function buildAgentOrchestrationPreview(input = {}) {
  const contracts = loadAgentContracts();
  const requestedAgents = Array.isArray(input.agents) && input.agents.length > 0
    ? input.agents
    : ["codesign", "directives-osd-check", "drafting"];
  const steps = requestedAgents.map((agentId, index) => {
    const agent = contracts.agents.find((item) => item.id === agentId);
    return {
      sequence: index + 1,
      agent: agentId,
      label: agent?.label || "Unknown agent",
      valid: Boolean(agent),
      inputChecklist: inputChecklistFor(agentId),
      outputContract: outputContractFor(agentId),
      writesCanonicalText: false,
      handoffTo: requestedAgents[index + 1] || null
    };
  });

  return {
    steps,
    executionAllowed: false,
    orchestrationRules: [
      "Agents may produce proposals, findings, plans and warnings.",
      "Agents must not write canonical document text directly.",
      "Every accepted AI proposal must be bound to version history and audit later.",
      "User dialogue language can differ from canonical ISO document language."
    ],
    persistence: "disabled-until-provider-config-enabled"
  };
}

export function buildChiefAgentControlPlan(input = {}) {
  const stage = input.stage || "PWI";
  const activeChapter = input.activeChapter || {};
  const issues = Array.isArray(input.issues) ? input.issues : [];
  const baseRoster = specialistRoster();
  const generated = generatedSpecialistsFor({ stage, activeChapter, issues });
  const specialists = [...baseRoster, ...generated];

  return {
    chiefAgent: {
      id: "iso-chief-standard-development-agent",
      label: "ISO Chief Standard Development Agent",
      mission: "Coordinate document consistency, terminology unity, procedure timing, OSD readiness, meeting missions and specialist findings.",
      canonicalWriteAllowed: false,
      controls: ["cross-chapter consistency", "terminology unity", "procedure roadmap", "OSD readiness", "feedback response", "specialist escalation"]
    },
    activeChapter: {
      chapter: activeChapter.chapter || null,
      title: activeChapter.title || null,
      area: activeChapter.area || null
    },
    specialists: specialists.map((agent, index) => ({
      sequence: index + 1,
      id: agent.id,
      label: agent.label,
      scope: agent.scope,
      activation: activationForSpecialist(agent, { stage, activeChapter, issues }),
      escalationRule: escalationRuleFor(agent.id),
      outputContract: specialistOutputContract(agent.id),
      writesCanonicalText: false
    })),
    creationPolicy: {
      chiefMayCreateSpecialistWhenGapDetected: true,
      specialistMustHaveNarrowScope: true,
      specialistMustReportToChief: true,
      specialistMayOnlyPropose: true
    },
    persistence: "chief-agent-plan-only-until-provider-config-enabled"
  };
}

export function buildAgentBrainPanelPreview(input = {}) {
  const stage = input.stage || "PWI";
  const activeChapter = input.activeChapter || {};
  const issues = Array.isArray(input.issues) ? input.issues : [];
  const evidence = Array.isArray(input.evidence) ? input.evidence : [];
  const council = buildChiefAgentControlPlan({ stage, activeChapter, issues });
  const conflictItems = buildCouncilConflicts(council.specialists, issues);
  const missionQueue = buildBrainMissionQueue({ stage, activeChapter, issues, conflictItems });

  return {
    chiefSummary: {
      health: healthForBrain({ issues, conflictItems }),
      riskLevel: riskLevelForBrain({ stage, issues, conflictItems }),
      osdReadiness: readinessScoreFor(stage, evidence),
      scheduleRisk: ["DIS", "FDIS", "PUBLICATION"].includes(stage) ? "high" : "watch",
      nextBestAction: missionQueue[0]?.title || "Select a chapter and request specialist review."
    },
    activeContext: {
      stage,
      chapter: activeChapter.chapter || null,
      title: activeChapter.title || null,
      area: activeChapter.area || null
    },
    specialistCouncil: council.specialists.slice(0, 8).map((specialist) => ({
      agentId: specialist.id,
      label: specialist.label,
      stance: stanceForActivation(specialist.activation),
      severity: severityForActivation(specialist.activation),
      finding: findingForSpecialist(specialist, activeChapter),
      proposedAction: proposedActionForSpecialist(specialist, stage),
      confidence: specialist.activation === "always-on" ? "high" : "medium"
    })),
    conflicts: conflictItems,
    missionQueue,
    evidenceLinks: evidence.map((item, index) => ({
      index,
      sourceType: item.sourceType || "project-policy",
      title: item.title || `Evidence ${index + 1}`,
      targetElement: item.targetElement || activeChapter.title || null,
      useMode: item.useMode || "advisory",
      confidence: item.confidence || "medium"
    })),
    humanDecision: {
      availableActions: ["accept-proposal", "defer", "reject", "memo", "assign-specialist"],
      canonicalWriteAllowed: false,
      persistenceRequiredLater: ["decision record", "version snapshot", "audit log"]
    },
    computePolicy: {
      unifiedModelGateway: true,
      agentSpecificModels: false,
      agentSpecificGpuAllocation: false,
      hpHeavyInference: false
    },
    persistence: "brain-panel-preview-only-until-provider-config-enabled"
  };
}

function inputChecklistFor(agentId) {
  const common = ["projectContext", "currentStage", "deliverableType", "userQuestion"];
  const byAgent = {
    codesign: ["draftTitle", "draftScope", "targetCommittee", "knownRisks"],
    drafting: ["elementType", "currentText", "draftingIntent", "constraints"],
    "directives-osd-check": ["documentOutline", "elementText", "osdTarget", "ruleConfidenceMode"],
    "style-check": ["sourceText", "targetClause", "styleRiskLevel"],
    roadmap: ["track", "startDate", "committeeCalendar", "meetingEvents"],
    reference: ["referenceMetadata", "aiUseMode", "targetClause"],
    "figure-source": ["figureIntent", "diagramType", "editableSourcePreference", "labels"],
    consensus: ["stakeholders", "objections", "meetingContext", "desiredOutcome"]
  };
  return [...common, ...(byAgent[agentId] || [])];
}

function buildCouncilConflicts(specialists, issues) {
  const conflicts = [];
  const hasFormalIssue = issues.some((issue) => ["scope", "term", "figure", "reference"].some((term) => String(issue.message || "").toLowerCase().includes(term)));
  const osd = specialists.find((item) => item.id === "osd-directives-specialist");
  const title = specialists.find((item) => item.id === "title-scope-specialist");
  const terms = specialists.find((item) => item.id === "terms-abbreviations-specialist");

  if (hasFormalIssue && osd && title) {
    conflicts.push({
      issue: "Formal-stage wording change may improve clarity but raise procedure risk.",
      sourceAgent: title.id,
      targetAgent: osd.id,
      conflictType: "clarity-vs-procedure",
      chiefResolution: "Prepare a revision memo and defer canonical change until specialist checks are reconciled."
    });
  }

  if (terms && issues.some((issue) => String(issue.message || "").toLowerCase().includes("definition"))) {
    conflicts.push({
      issue: "Definition change can ripple into scope, figures and requirement clauses.",
      sourceAgent: terms.id,
      targetAgent: "requirement-language-specialist",
      conflictType: "terminology-vs-requirement-language",
      chiefResolution: "Run term impact and requirement language checks before adopting text."
    });
  }

  return conflicts;
}

function buildBrainMissionQueue({ stage, activeChapter, issues, conflictItems }) {
  const missions = [];
  if (conflictItems.length > 0) {
    missions.push({
      title: "Resolve specialist conflict",
      priority: "high",
      ownerAgent: "iso-chief-standard-development-agent",
      stage,
      status: "open"
    });
  }
  if (issues.length > 0) {
    missions.push({
      title: "Create issue memo for selected chapter",
      priority: "medium",
      ownerAgent: "consensus-feedback-specialist",
      stage,
      status: "open"
    });
  }
  missions.push({
    title: `Review ${activeChapter.title || "selected chapter"} with active specialists`,
    priority: "medium",
    ownerAgent: "osd-directives-specialist",
    stage,
    status: "ready"
  });
  return missions;
}

function healthForBrain({ issues, conflictItems }) {
  return Math.max(35, 88 - issues.length * 7 - conflictItems.length * 12);
}

function riskLevelForBrain({ stage, issues, conflictItems }) {
  if (["DIS", "FDIS", "PUBLICATION"].includes(stage) && (issues.length > 0 || conflictItems.length > 0)) return "high";
  if (issues.length > 0 || conflictItems.length > 0) return "watch";
  return "ready";
}

function readinessScoreFor(stage, evidence) {
  const base = { PWI: 20, NP: 35, WD: 50, CD: 65, DIS: 78, FDIS: 88, PUBLICATION: 96 }[stage] || 20;
  return Math.min(100, base + evidence.length * 3);
}

function stanceForActivation(activation) {
  if (activation === "always-on") return "required";
  if (activation === "active") return "review";
  if (activation === "watch") return "caution";
  return "standby";
}

function severityForActivation(activation) {
  if (activation === "always-on" || activation === "active") return "high";
  if (activation === "watch") return "medium";
  return "low";
}

function findingForSpecialist(specialist, activeChapter) {
  return `${specialist.label} should review ${activeChapter.title || "the active chapter"} within its scope: ${specialist.scope}`;
}

function proposedActionForSpecialist(specialist, stage) {
  if (specialist.id.includes("osd") || specialist.id.includes("directives")) return `Run ${stage} OSD and Directives risk memo.`;
  if (specialist.id.includes("terms")) return "Check terminology unity and abbreviation use before text adoption.";
  if (specialist.id.includes("consensus")) return "Convert findings into meeting, circulation or response missions.";
  return "Produce proposal-only findings for chief review.";
}

function outputContractFor(agentId) {
  const base = {
    summary: "Short explanation of the recommendation.",
    confidence: "high | medium | low",
    sourceClass: "official_rule | official_guidance | project_policy | expert_heuristic | ai_inference",
    proposedActions: "Human-reviewed list of next actions."
  };

  const byAgent = {
    drafting: {
      alternatives: "Structured clause alternatives, not direct canonical write.",
      cautions: "Change-control and OSD warnings."
    },
    "directives-osd-check": {
      findings: "Rule or readiness findings with severity.",
      replacementSuggestions: "Optional human-reviewed alternatives."
    },
    "figure-source": {
      editableSourcePlan: "PPTX/SVG/Mermaid/draw.io source plan.",
      rasterWarning: "Warning if output would be image-only."
    },
    consensus: {
      stakeholderMap: "Concerns, possible cooperation path and response theme.",
      meetingMission: "What to present or circulate before the next stage."
    }
  };

  return {
    ...base,
    ...(byAgent[agentId] || {})
  };
}

function specialistRoster() {
  return [
    { id: "title-scope-specialist", label: "Title & Scope Specialist", scope: "Title, scope boundary, differentiation and committee fit." },
    { id: "terms-abbreviations-specialist", label: "Terms & Abbreviations Specialist", scope: "Clause 3, abbreviations, definition quality and term consistency." },
    { id: "form4-draft-specialist", label: "Form 4 & Draft Specialist", scope: "NP package, Form 4 fields, draft maturity and proposal evidence." },
    { id: "osd-directives-specialist", label: "OSD & Directives Specialist", scope: "Directives, OSD entry, numbering, formal-stage blockers and package readiness." },
    { id: "roadmap-procedure-specialist", label: "Roadmap & Procedure Specialist", scope: "18/24/36 month tracks, meetings, ballots, consultation windows and missions." },
    { id: "consensus-feedback-specialist", label: "Consensus & Feedback Specialist", scope: "Comments, objections, meeting participation, response themes and cooperation boundaries." },
    { id: "reference-bibliography-specialist", label: "Reference & Bibliography Specialist", scope: "Source-use decisions, bibliography candidates, endnote binding and Clause 2 readiness." },
    { id: "figure-table-source-specialist", label: "Figure & Table Source Specialist", scope: "Editable source packages, figures, tables, captions and source manifests." },
    { id: "requirement-language-specialist", label: "Requirement Language Specialist", scope: "shall, should, may, can, notes, examples and hidden requirements." },
    { id: "export-package-specialist", label: "Export Package Specialist", scope: "DOCX assembly, OSD companion report, source version map and final package evidence." }
  ];
}

function generatedSpecialistsFor({ stage, activeChapter, issues }) {
  const generated = [];
  const issueText = issues.map((issue) => `${issue.type || ""} ${issue.area || ""} ${issue.message || ""}`).join(" ").toLowerCase();

  if (issueText.includes("security") || issueText.includes("privacy")) {
    generated.push({ id: "generated-security-privacy-specialist", label: "Security & Privacy Specialist", scope: "Security, privacy, data handling and confidentiality risks for this standard." });
  }

  if (issueText.includes("interoperability") || issueText.includes("conformance")) {
    generated.push({ id: "generated-conformance-specialist", label: "Conformance & Interoperability Specialist", scope: "Conformance clauses, testability, interoperability boundaries and implementation evidence." });
  }

  if (stage === "DIS" && activeChapter.area === "Figures") {
    generated.push({ id: "generated-dis-figure-package-specialist", label: "DIS Figure Package Specialist", scope: "DIS-stage figure source completeness and final handoff blockers." });
  }

  return generated;
}

function activationForSpecialist(agent, { stage, activeChapter, issues }) {
  const area = String(activeChapter.area || "").toLowerCase();
  const id = agent.id;
  if (id.includes("title-scope") && ["document", "setup"].includes(area)) return "active";
  if (id.includes("terms") && area === "terms") return "active";
  if (id.includes("osd") || id.includes("directives")) return "always-on";
  if (id.includes("roadmap") && area === "roadmap") return "active";
  if (id.includes("consensus") && area === "consensus") return "active";
  if (id.includes("reference") && area === "references") return "active";
  if (id.includes("figure") && area === "figures") return "active";
  if (id.includes("export") && ["export", "acceptance"].includes(area)) return "active";
  if (issues.some((issue) => String(issue.area || "").toLowerCase() === area)) return "watch";
  if (["CD", "DIS", "FDIS", "PUBLICATION"].includes(stage) && id.includes("requirement")) return "watch";
  return "standby";
}

function escalationRuleFor(agentId) {
  if (agentId.includes("osd") || agentId.includes("directives")) return "Escalate high severity rule or formal package blocker to the chief agent immediately.";
  if (agentId.includes("consensus")) return "Escalate unresolved objection, repeated comment theme or meeting gap to the chief agent.";
  if (agentId.includes("title") || agentId.includes("terms")) return "Escalate formal-stage wording changes that affect other clauses.";
  return "Escalate blockers, cross-chapter conflicts or missing evidence.";
}

function specialistOutputContract(agentId) {
  return {
    findings: "Issue list with severity and affected element keys.",
    proposals: "Human-reviewed alternatives or next actions.",
    chiefBrief: "Short report for the chief agent.",
    sourceClass: agentId.includes("directives") || agentId.includes("osd") ? "official_rule | project_policy" : "project_policy | expert_heuristic | ai_inference"
  };
}

