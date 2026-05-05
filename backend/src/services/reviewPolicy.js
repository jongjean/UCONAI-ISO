export function validateCommitteeActor(input = {}) {
  const errors = [];
  if (!input.name) errors.push({ field: "name", code: "NAME_REQUIRED", message: "Actor name is required." });
  return {
    ok: errors.length === 0,
    errors,
    normalized: {
      name: input.name || "",
      country: input.country || null,
      organization: input.organization || null,
      role: input.role || "EXPERT",
      position: input.position || "UNKNOWN"
    }
  };
}

export function validateCommentDisposition(input = {}) {
  const errors = [];
  const warnings = [];

  if (!input.comment || String(input.comment).trim().length < 5) {
    errors.push({ field: "comment", code: "COMMENT_REQUIRED", message: "Comment text is required." });
  }

  if (!input.origin) {
    warnings.push({ field: "origin", code: "ORIGIN_MISSING", message: "Comment origin should identify actor, country or meeting source." });
  }

  if (input.decision && !["ACCEPTED", "REJECTED", "MODIFIED", "DEFERRED"].includes(input.decision)) {
    errors.push({ field: "decision", code: "INVALID_DECISION", message: "Disposition decision is invalid." });
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    requiresHumanDecision: true
  };
}

export function consensusPolicy() {
  return {
    guidanceIsAdvisory: true,
    preserveOriginalComments: true,
    doNotMisrepresentPositions: true,
    missionThemes: ["present", "circulate", "resolve", "secure-support", "record-decision"]
  };
}

export function buildStakeholderMap(input = {}) {
  const actors = Array.isArray(input.actors) ? input.actors : [];
  return {
    actors: actors.map((actor, index) => {
      const normalized = validateCommitteeActor(actor).normalized;
      const posture = actor.posture || "UNKNOWN";
      return {
        index,
        ...normalized,
        posture,
        concernLevel: actor.concernLevel || "unknown",
        cooperationPath: cooperationPathFor(posture, actor.concernLevel),
        nextEngagement: nextEngagementFor(posture)
      };
    }),
    guidanceIsAdvisory: true,
    persistence: "disabled-until-db-enabled"
  };
}

export function buildCommentResponsePlan(input = {}) {
  const comments = Array.isArray(input.comments) ? input.comments : [];
  const plans = comments.map((comment, index) => {
    const validation = validateCommentDisposition(comment);
    const theme = classifyCommentTheme(comment.comment || "");
    return {
      index,
      validation,
      theme,
      recommendedDisposition: recommendedDispositionFor(theme),
      responseMission: responseMissionFor(theme),
      preserveOriginalComment: true
    };
  });

  return {
    plans,
    unresolvedCount: plans.filter((item) => !item.validation.ok).length,
    humanDecisionRequired: true,
    persistence: "disabled-until-db-enabled"
  };
}

export function buildMeetingMissionPlan(input = {}) {
  const stage = input.stage || "PWI";
  const meetingType = input.meetingType || "committee";
  const unresolvedThemes = Array.isArray(input.unresolvedThemes) ? input.unresolvedThemes : [];

  return {
    stage,
    meetingType,
    mission: meetingMissionFor(stage, unresolvedThemes),
    mustPresent: mustPresentFor(stage),
    mustCirculate: mustCirculateFor(stage),
    risksToSurface: unresolvedThemes,
    recordDecision: true,
    guidanceIsAdvisory: true,
    persistence: "disabled-until-db-enabled"
  };
}

export function buildConsensusRiskMap(input = {}) {
  const actors = Array.isArray(input.actors) ? input.actors : [];
  const comments = Array.isArray(input.comments) ? input.comments : [];
  const stage = input.stage || "PWI";
  const actorMap = buildStakeholderMap({ actors }).actors;
  const responsePlan = buildCommentResponsePlan({ comments }).plans;
  const opposition = actorMap.filter((actor) => actor.posture === "OPPOSE" || actor.concernLevel === "high");
  const uncertain = actorMap.filter((actor) => actor.posture === "UNKNOWN" || actor.concernLevel === "unknown");

  return {
    stage,
    riskLevel: riskLevelFor({ opposition, uncertain, responsePlan }),
    actorSummary: {
      total: actorMap.length,
      opposition: opposition.length,
      uncertain: uncertain.length,
      support: actorMap.filter((actor) => actor.posture === "SUPPORT").length
    },
    objectionThemes: summarizeThemes(responsePlan),
    priorityMissions: buildPriorityMissions(stage, opposition, responsePlan),
    guardrails: [
      "Guidance is advisory and must not misrepresent stakeholder positions.",
      "Original comments and rationale must be preserved separately from AI interpretation.",
      "The goal is cooperation and clarity, not pressure or manipulation."
    ],
    persistence: "disabled-until-db-enabled"
  };
}

export function buildMeetingParticipationLedger(input = {}) {
  const stage = input.stage || "PWI";
  const meetings = Array.isArray(input.meetings) ? input.meetings : [];
  const actors = Array.isArray(input.actors) ? input.actors : [];
  const comments = Array.isArray(input.comments) ? input.comments : [];
  const actorMap = buildStakeholderMap({ actors }).actors;
  const responsePlan = buildCommentResponsePlan({ comments }).plans;

  const meetingRows = meetings.map((meeting, index) => {
    const participantNames = Array.isArray(meeting.participants) ? meeting.participants : [];
    const participants = participantNames.map((name) => {
      const known = actorMap.find((actor) => actor.name === name);
      return {
        name,
        posture: known?.posture || "UNKNOWN",
        nextEngagement: known?.nextEngagement || nextEngagementFor("UNKNOWN")
      };
    });

    return {
      index,
      title: meeting.title || `Meeting ${index + 1}`,
      stage: meeting.stage || stage,
      startsAt: meeting.startsAt || null,
      presented: meeting.presented === true,
      circulated: meeting.circulated === true,
      participants,
      objectionsRaised: comments
        .filter((comment) => comment.meetingTitle === meeting.title || comment.meetingIndex === index)
        .map((comment, commentIndex) => ({
          index: commentIndex,
          origin: comment.origin || null,
          theme: classifyCommentTheme(comment.comment || ""),
          intent: inferObjectionIntent(comment.comment || ""),
          cooperationBoundary: cooperationBoundaryFor(comment.comment || "")
        })),
      requiredFollowUp: meetingFollowUpFor(stage, meeting, participants)
    };
  });

  return {
    stage,
    meetings: meetingRows,
    actorSummary: {
      total: actorMap.length,
      supporters: actorMap.filter((actor) => actor.posture === "SUPPORT").length,
      objectors: actorMap.filter((actor) => actor.posture === "OPPOSE").length,
      unknown: actorMap.filter((actor) => actor.posture === "UNKNOWN").length
    },
    objectionThemes: summarizeThemes(responsePlan),
    nextMissionThemes: buildLedgerMissionThemes(stage, meetingRows, actorMap, responsePlan),
    guardrails: [
      "Participation analysis is advisory and must not replace official meeting minutes.",
      "Objection intent is an interpretation and must be checked against the original comment.",
      "Next missions should seek clarity, cooperation and documented rationale."
    ],
    persistence: "ledger-preview-only-until-db-enabled"
  };
}

function cooperationPathFor(posture, concernLevel) {
  if (posture === "OPPOSE") return "Clarify objection rationale and identify acceptable revision boundary.";
  if (posture === "CONCERNED" || concernLevel === "high") return "Request concrete wording proposal and test compromise language.";
  if (posture === "SUPPORT") return "Ask for visible support, comment contribution or expert participation.";
  return "Gather interest, constraints and decision influence before formal stage change.";
}

function riskLevelFor({ opposition, uncertain, responsePlan }) {
  const unresolved = responsePlan.filter((item) => !item.validation.ok).length;
  if (opposition.length >= 2 || unresolved >= 3) return "high";
  if (opposition.length === 1 || uncertain.length >= 3 || unresolved > 0) return "medium";
  return "low";
}

function summarizeThemes(plans) {
  const counts = {};
  for (const plan of plans) {
    counts[plan.theme] = (counts[plan.theme] || 0) + 1;
  }
  return Object.entries(counts).map(([theme, count]) => ({ theme, count }));
}

function buildPriorityMissions(stage, opposition, responsePlan) {
  const missions = [];
  if (opposition.length > 0) {
    missions.push(`Before advancing ${stage}, clarify objection intent and acceptable revision boundaries.`);
  }
  const themes = summarizeThemes(responsePlan).slice(0, 3).map((item) => item.theme);
  if (themes.length > 0) {
    missions.push(`Prepare response themes for ${themes.join(", ")}.`);
  }
  if (missions.length === 0) {
    missions.push(`Maintain visible support and circulate the next ${stage} package early.`);
  }
  return missions;
}

function nextEngagementFor(posture) {
  if (posture === "OPPOSE") return "one-on-one clarification before wider circulation";
  if (posture === "SUPPORT") return "secure public support or co-editing contribution";
  return "committee discussion and written concern capture";
}

function classifyCommentTheme(text) {
  const value = String(text).toLowerCase();
  if (value.includes("scope")) return "scope-boundary";
  if (value.includes("definition") || value.includes("term")) return "terminology";
  if (value.includes("figure") || value.includes("diagram")) return "figure";
  if (value.includes("reference")) return "reference";
  if (value.includes("shall") || value.includes("requirement")) return "requirement-language";
  return "general";
}

function recommendedDispositionFor(theme) {
  const dispositions = {
    "scope-boundary": "MODIFIED",
    terminology: "MODIFIED",
    figure: "DEFERRED",
    reference: "MODIFIED",
    "requirement-language": "MODIFIED",
    general: "DEFERRED"
  };
  return dispositions[theme] || "DEFERRED";
}

function responseMissionFor(theme) {
  const missions = {
    "scope-boundary": "Show boundary, exclusions and deliverable fit before seeking next-stage support.",
    terminology: "Resolve wording with source evidence before the term becomes politically expensive.",
    figure: "Confirm editable source and whether the diagram changes technical meaning.",
    reference: "Clarify normative versus informative status and AI-use permission.",
    "requirement-language": "Separate requirements from definitions, scope and informative explanation.",
    general: "Ask for precise text impact and record decision rationale."
  };
  return missions[theme] || missions.general;
}

function inferObjectionIntent(text) {
  const value = String(text).toLowerCase();
  if (value.includes("scope")) return "boundary-control";
  if (value.includes("term") || value.includes("definition")) return "concept-precision";
  if (value.includes("shall") || value.includes("requirement")) return "normative-force-control";
  if (value.includes("evidence") || value.includes("reference")) return "evidence-confidence";
  return "clarification-needed";
}

function cooperationBoundaryFor(text) {
  const intent = inferObjectionIntent(text);
  const map = {
    "boundary-control": "Offer revised exclusions, examples and scope wording for review.",
    "concept-precision": "Ask for preferred term wording and source basis.",
    "normative-force-control": "Separate requirements from informative explanation and test shall/should language.",
    "evidence-confidence": "Provide reference status, AI-use boundary and source relevance.",
    "clarification-needed": "Request precise affected clause and acceptable revision direction."
  };
  return map[intent] || map["clarification-needed"];
}

function meetingFollowUpFor(stage, meeting, participants) {
  const followUp = [];
  if (meeting.presented !== true) followUp.push(`Prepare ${stage} presentation evidence before the next checkpoint.`);
  if (meeting.circulated !== true) followUp.push(`Circulate ${stage} package or issue memo before asking for stage movement.`);
  if (participants.some((participant) => participant.posture === "OPPOSE")) {
    followUp.push("Schedule objection clarification and capture acceptable revision boundaries.");
  }
  if (followUp.length === 0) followUp.push("Record decisions, open issues and visible support after the meeting.");
  return followUp;
}

function buildLedgerMissionThemes(stage, meetings, actors, responsePlan) {
  const missions = [];
  if (meetings.length === 0) {
    missions.push(`Add at least one ${stage} meeting checkpoint before relying on consensus readiness.`);
  }
  if (meetings.some((meeting) => meeting.presented !== true)) {
    missions.push("Prepare focused presentation material for the unresolved stage risks.");
  }
  if (meetings.some((meeting) => meeting.circulated !== true)) {
    missions.push("Circulate the draft package early enough for written expert response.");
  }
  if (actors.some((actor) => actor.posture === "OPPOSE")) {
    missions.push("Clarify opposing rationale and seek a cooperation boundary before wider decision pressure.");
  }
  const themes = summarizeThemes(responsePlan).map((item) => item.theme).slice(0, 2);
  if (themes.length > 0) missions.push(`Prepare response themes for ${themes.join(", ")}.`);
  if (missions.length === 0) missions.push(`Maintain visible support and document participation before advancing ${stage}.`);
  return missions;
}

function meetingMissionFor(stage, unresolvedThemes) {
  if (unresolvedThemes.length > 0) {
    return `Resolve or contain ${unresolvedThemes.join(", ")} before advancing ${stage}.`;
  }
  const missions = {
    PWI: "Confirm need, committee fit and supporter base before NP.",
    NP: "Secure participation and confidence in title/scope.",
    WD: "Review technical baseline and core terminology.",
    CD: "Collect comments and agree disposition method.",
    DIS: "Demonstrate publication-grade readiness and no hidden blockers.",
    FDIS: "Confirm final decision posture.",
    PUBLICATION: "Package final accepted content without substantive drift."
  };
  return missions[stage] || "Define meeting mission.";
}

function mustPresentFor(stage) {
  const items = {
    PWI: ["need statement", "draft scope", "supporter/opposition map"],
    NP: ["proposal rationale", "work plan", "expert participation plan"],
    WD: ["working outline", "core definitions", "technical issues"],
    CD: ["committee draft", "comment themes", "disposition plan"],
    DIS: ["stable draft", "reference readiness", "editable figure source status"],
    FDIS: ["final risk list", "clean export status"],
    PUBLICATION: ["final DOCX package", "OSD readiness report", "editable source package"]
  };
  return items[stage] || [];
}

function mustCirculateFor(stage) {
  const items = {
    PWI: ["concept note"],
    NP: ["NP draft package"],
    WD: ["working draft excerpts"],
    CD: ["committee draft and comment template"],
    DIS: ["DIS-ready draft and unresolved issue note"],
    FDIS: ["final decision package"],
    PUBLICATION: ["publication package confirmation"]
  };
  return items[stage] || [];
}

