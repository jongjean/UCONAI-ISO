const trackMonths = {
  MONTHS_18: 18,
  MONTHS_24: 24,
  MONTHS_36: 36
};

export const trackProfiles = [
  { id: "MONTHS_18", label: "18-month track", months: 18, pace: "accelerated" },
  { id: "MONTHS_24", label: "24-month track", months: 24, pace: "standard-fast" },
  { id: "MONTHS_36", label: "36-month track", months: 36, pace: "standard-full" }
];

export const procedureWindowCatalog = [
  {
    id: "np-ballot",
    stage: "NP",
    windowType: "ballot",
    defaultMinimumDays: null,
    sourceStatus: "verify-current-directives",
    mission: "Confirm proposal package, participation commitment and scope confidence before ballot close."
  },
  {
    id: "cd-consultation",
    stage: "CD",
    windowType: "consultation",
    defaultMinimumDays: null,
    sourceStatus: "verify-current-directives",
    mission: "Collect committee comments early enough to prepare disposition strategy before DIS pressure."
  },
  {
    id: "dis-ballot",
    stage: "DIS",
    windowType: "ballot",
    defaultMinimumDays: null,
    sourceStatus: "verify-current-directives",
    mission: "Enter enquiry with stable scope, references, figures, terms and response posture."
  },
  {
    id: "fdis-decision",
    stage: "FDIS",
    windowType: "decision",
    defaultMinimumDays: null,
    sourceStatus: "verify-current-directives",
    mission: "Limit changes to final decision readiness and avoid new technical substance."
  }
];

const stageDefinitions = [
  {
    stage: "PWI",
    weight: 0,
    minimumWindow: "Before formal NP",
    requiredOutputs: ["need statement", "scope boundary", "supporter map"],
    consensusFocus: "Identify early supporters, likely objectors and committee fit."
  },
  {
    stage: "NP",
    weight: 0.12,
    minimumWindow: "Formal proposal and ballot window",
    requiredOutputs: ["proposal rationale", "draft scope", "participation plan"],
    consensusFocus: "Secure national body interest and named expert participation."
  },
  {
    stage: "WD",
    weight: 0.28,
    minimumWindow: "Working draft development",
    requiredOutputs: ["working outline", "core definitions", "technical baseline"],
    consensusFocus: "Resolve foundational language before it becomes procedurally expensive."
  },
  {
    stage: "CD",
    weight: 0.48,
    minimumWindow: "Committee consultation and comment disposition",
    requiredOutputs: ["committee draft", "comment log", "disposition strategy"],
    consensusFocus: "Expose objections early and turn critique into negotiated improvement."
  },
  {
    stage: "DIS",
    weight: 0.72,
    minimumWindow: "Enquiry ballot and publication-grade preparation",
    requiredOutputs: ["stable draft", "reference check", "editable figure source check"],
    consensusFocus: "Avoid late uncontrolled change while demonstrating broad readiness."
  },
  {
    stage: "FDIS",
    weight: 0.9,
    minimumWindow: "Final decision preparation where applicable",
    requiredOutputs: ["final response posture", "clean export package", "late-risk list"],
    consensusFocus: "Confirm no unresolved blocker remains before the final decision."
  },
  {
    stage: "PUBLICATION",
    weight: 1,
    minimumWindow: "Final publication and handoff",
    requiredOutputs: ["DOCX package", "OSD readiness report", "editable sources"],
    consensusFocus: "Package the accepted result without introducing new substance."
  }
];

function addMonths(date, months) {
  const next = new Date(date.getTime());
  next.setMonth(next.getMonth() + months);
  return next;
}

function normalizeStartDate(value) {
  if (!value) return new Date();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function profileFor(track) {
  return trackProfiles.find((item) => item.id === track) || trackProfiles[2];
}

export function buildRoadmapPreview(input = {}) {
  const profile = profileFor(input.track || "MONTHS_36");
  const start = normalizeStartDate(input.startDate);
  const events = stageDefinitions.map((definition, index) => ({
    sequence: index + 1,
    stage: definition.stage,
    targetDate: addMonths(start, Math.round(profile.months * definition.weight)).toISOString().slice(0, 10),
    mission: missionForStage(definition.stage),
    minimumWindow: definition.minimumWindow,
    requiredOutputs: definition.requiredOutputs,
    consensusFocus: definition.consensusFocus,
    completionWeight: Math.round(definition.weight * 100)
  }));

  return {
    track: profile.id,
    trackLabel: profile.label,
    pace: profile.pace,
    months: profile.months,
    startDate: start.toISOString().slice(0, 10),
    targetDate: addMonths(start, profile.months).toISOString().slice(0, 10),
    events,
    warnings: buildRoadmapWarnings(input, profile),
    persistence: "disabled-until-db-enabled"
  };
}

export function buildTrackChangePreview(input = {}) {
  const current = buildRoadmapPreview({
    track: input.currentTrack || "MONTHS_36",
    startDate: input.startDate
  });
  const next = buildRoadmapPreview({
    track: input.nextTrack || "MONTHS_24",
    startDate: input.startDate
  });

  return {
    currentTrack: current.track,
    nextTrack: next.track,
    monthDelta: next.months - current.months,
    publicationDateDeltaDays: differenceInDays(current.targetDate, next.targetDate),
    changedEvents: next.events.map((event) => {
      const previous = current.events.find((item) => item.stage === event.stage);
      return {
        stage: event.stage,
        previousTargetDate: previous?.targetDate || null,
        nextTargetDate: event.targetDate,
        deltaDays: previous ? differenceInDays(previous.targetDate, event.targetDate) : null
      };
    }),
    auditRequired: true,
    persistence: "disabled-until-db-enabled"
  };
}

export function buildProcedureWindowCatalog(input = {}) {
  const overrides = Array.isArray(input.overrides) ? input.overrides : [];
  const windows = procedureWindowCatalog.map((window) => {
    const override = overrides.find((item) => item.id === window.id);
    const minimumDays = Number(override?.minimumDays ?? window.defaultMinimumDays);
    return {
      ...window,
      minimumDays: Number.isFinite(minimumDays) && minimumDays > 0 ? minimumDays : null,
      currentRuleCheckedAt: override?.checkedAt || null,
      currentRuleSource: override?.source || null,
      readyForAutomation: Boolean(override?.minimumDays && override?.checkedAt && override?.source)
    };
  });

  return {
    windows,
    policy: {
      exactDurationsAreConfigData: true,
      requireCurrentRuleVerification: true,
      noHardcodedOfficialDurationClaim: true
    },
    persistence: "disabled-until-db-enabled"
  };
}

export function buildTrackCompressionRiskReport(input = {}) {
  const change = buildTrackChangePreview(input);
  const current = buildRoadmapPreview({ track: input.currentTrack || "MONTHS_36", startDate: input.startDate });
  const next = buildRoadmapPreview({ track: input.nextTrack || "MONTHS_24", startDate: input.startDate });
  const progress = input.progress || {};
  const windows = buildProcedureWindowCatalog({ overrides: input.windowOverrides }).windows;

  const risks = next.events.map((event) => {
    const previous = current.events.find((item) => item.stage === event.stage);
    const deltaDays = previous ? differenceInDays(previous.targetDate, event.targetDate) : 0;
    const readiness = buildStageReadinessMatrix({ stage: event.stage, progress });
    const stageWindows = windows.filter((window) => window.stage === event.stage);
    return {
      stage: event.stage,
      deltaDays,
      compressed: deltaDays < 0,
      readiness: readiness.overallProgress,
      readinessStatus: readiness.ready ? "ready" : "gap",
      unverifiedWindows: stageWindows.filter((window) => !window.readyForAutomation).map((window) => window.id),
      mission: event.mission,
      riskLevel: compressionRiskLevel({ deltaDays, readiness: readiness.overallProgress, unverifiedCount: stageWindows.filter((window) => !window.readyForAutomation).length })
    };
  });

  return {
    currentTrack: change.currentTrack,
    nextTrack: change.nextTrack,
    monthDelta: change.monthDelta,
    publicationDateDeltaDays: change.publicationDateDeltaDays,
    risks,
    summary: {
      highRiskStages: risks.filter((item) => item.riskLevel === "high").map((item) => item.stage),
      unverifiedProcedureWindowCount: risks.reduce((sum, item) => sum + item.unverifiedWindows.length, 0),
      recommendation: risks.some((item) => item.riskLevel === "high")
        ? "Resolve high-risk stage gaps before changing the official project track."
        : "Track change can be prepared as a preview with current rule verification."
    },
    persistence: "disabled-until-db-enabled"
  };
}

export function buildMeetingMissionBoard(input = {}) {
  const diary = buildProcedureDiary(input);
  const stakeholders = Array.isArray(input.stakeholders) ? input.stakeholders : [];

  return {
    track: diary.track,
    targetDate: diary.targetDate,
    missions: diary.diary.map((item) => ({
      stage: item.stage,
      targetDate: item.targetDate,
      primaryMission: item.mission,
      presentationFocus: item.mustPresent,
      circulationFocus: item.mustCirculate,
      stakeholderFocus: stakeholderFocusForStage(item.stage, stakeholders),
      meetingCount: item.meetings.length,
      decisionWindowCount: item.ballots.length + item.consultations.length,
      checkpointMemo: item.checkpointMemo
    })),
    advisoryBoundary: "Meeting missions support cooperation planning and must preserve original stakeholder positions.",
    persistence: "disabled-until-db-enabled"
  };
}

export function buildCalendarMissionOverlay(input = {}) {
  const diary = buildProcedureDiary(input);
  const today = normalizeStartDate(input.today || new Date().toISOString().slice(0, 10));
  const evidence = input.evidence || {};

  const events = diary.diary.flatMap((stageItem) => {
    const meetings = stageItem.meetings.map((meeting) => buildCalendarMissionItem({
      kind: "meeting",
      stageItem,
      title: meeting.title,
      date: meeting.startsAt,
      evidence,
      today
    }));
    const ballots = stageItem.ballots.map((ballot) => buildCalendarMissionItem({
      kind: "ballot",
      stageItem,
      title: ballot.title,
      date: ballot.closesAt || ballot.opensAt,
      evidence,
      today
    }));
    const consultations = stageItem.consultations.map((consultation) => buildCalendarMissionItem({
      kind: "consultation",
      stageItem,
      title: consultation.title,
      date: consultation.closesAt || consultation.opensAt,
      evidence,
      today
    }));

    return [
      buildCalendarMissionItem({
        kind: "stage-target",
        stageItem,
        title: `${stageItem.stage} target`,
        date: stageItem.targetDate,
        evidence,
        today
      }),
      ...meetings,
      ...ballots,
      ...consultations
    ];
  }).sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")));

  return {
    track: diary.track,
    targetDate: diary.targetDate,
    today: today.toISOString().slice(0, 10),
    events,
    urgentCount: events.filter((event) => event.urgency === "urgent").length,
    missingEvidenceCount: events.reduce((sum, event) => sum + event.missingEvidence.length, 0),
    policy: {
      calendarOverlayIsAdvisory: true,
      meetingDatesRequireUserMaintainedCalendar: true,
      procedureDurationsRequireCurrentRuleVerification: true
    },
    persistence: "calendar-overlay-only-until-db-enabled"
  };
}

export function buildProcedureDiary(input = {}) {
  const roadmap = buildRoadmapPreview(input);
  const meetings = Array.isArray(input.meetings) ? input.meetings : [];
  const ballots = Array.isArray(input.ballots) ? input.ballots : [];
  const consultations = Array.isArray(input.consultations) ? input.consultations : [];

  const diary = roadmap.events.map((event) => {
    const stageMeetings = meetings.filter((item) => normalizeStage(item.stage) === event.stage);
    const stageBallots = ballots.filter((item) => normalizeStage(item.stage) === event.stage);
    const stageConsultations = consultations.filter((item) => normalizeStage(item.stage) === event.stage);

    return {
      stage: event.stage,
      targetDate: event.targetDate,
      completionWeight: event.completionWeight,
      minimumWindow: event.minimumWindow,
      mission: event.mission,
      requiredOutputs: event.requiredOutputs,
      mustPresent: mustPresentForStage(event.stage),
      mustCirculate: mustCirculateForStage(event.stage),
      meetings: stageMeetings.map(normalizeMeeting),
      ballots: stageBallots.map(normalizeDecisionWindow),
      consultations: stageConsultations.map(normalizeDecisionWindow),
      checkpointMemo: checkpointMemoFor(event.stage, {
        meetings: stageMeetings.length,
        ballots: stageBallots.length,
        consultations: stageConsultations.length
      })
    };
  });

  return {
    track: roadmap.track,
    targetDate: roadmap.targetDate,
    diary,
    warnings: roadmap.warnings,
    persistence: "disabled-until-db-enabled"
  };
}

export function buildStageReadinessMatrix(input = {}) {
  const stage = normalizeStage(input.stage) || "PWI";
  const progress = input.progress || {};
  const thresholds = readinessThresholdsFor(stage);
  const rows = Object.entries(thresholds).map(([area, target]) => {
    const current = clamp(Number(progress[area] ?? 0));
    return {
      area,
      current,
      target,
      gap: Math.max(0, target - current),
      status: current >= target ? "ready" : current >= target - 15 ? "at-risk" : "not-ready"
    };
  });

  return {
    stage,
    rows,
    ready: rows.every((row) => row.status === "ready"),
    overallProgress: Math.round(rows.reduce((sum, row) => sum + row.current, 0) / rows.length),
    nextMission: missionForStage(stage),
    persistence: "disabled-until-db-enabled"
  };
}

export function missionForStage(stage) {
  const missions = {
    PWI: "Clarify need, scope boundary, expected deliverable and early supporters.",
    NP: "Secure proposal evidence, committee interest and national body support.",
    WD: "Build technical text, resolve core terms and prepare committee discussion.",
    CD: "Circulate draft, collect comments and prepare disposition strategy.",
    DIS: "Stabilize document, references, figures and formal response posture.",
    FDIS: "Confirm final decision readiness and avoid late uncontrolled changes.",
    PUBLICATION: "Prepare final DOCX, OSD companion report and editable source package."
  };
  return missions[stage] || "Define mission.";
}

function normalizeStage(stage) {
  return stageDefinitions.some((definition) => definition.stage === stage) ? stage : null;
}

function normalizeMeeting(meeting = {}) {
  return {
    title: meeting.title || "Meeting",
    startsAt: meeting.startsAt || null,
    type: meeting.type || "committee",
    plannedPresentation: meeting.plannedPresentation || null,
    expectedOutcome: meeting.expectedOutcome || "capture concerns and next actions"
  };
}

function normalizeDecisionWindow(window = {}) {
  return {
    title: window.title || "Decision window",
    opensAt: window.opensAt || null,
    closesAt: window.closesAt || null,
    minimumWindow: window.minimumWindow || "verify with current committee procedure",
    requiredEvidence: Array.isArray(window.requiredEvidence) ? window.requiredEvidence : []
  };
}

function mustPresentForStage(stage) {
  const map = {
    PWI: ["need statement", "scope boundary", "committee fit"],
    NP: ["proposal rationale", "draft title and scope", "participation plan"],
    WD: ["core clause structure", "term decisions", "technical issue list"],
    CD: ["committee draft", "comment themes", "disposition method"],
    DIS: ["stable draft", "reference readiness", "editable figure source status"],
    FDIS: ["final risk list", "clean export status", "remaining editorial issues"],
    PUBLICATION: ["final DOCX package", "OSD companion report", "editable source package"]
  };
  return map[stage] || [];
}

function mustCirculateForStage(stage) {
  const map = {
    PWI: ["concept note"],
    NP: ["proposal package"],
    WD: ["working draft excerpts and open issue list"],
    CD: ["committee draft and comment template"],
    DIS: ["DIS-ready draft and unresolved issue note"],
    FDIS: ["final decision package"],
    PUBLICATION: ["publication package confirmation"]
  };
  return map[stage] || [];
}

function checkpointMemoFor(stage, counts) {
  if (counts.meetings === 0 && ["PWI", "NP", "CD", "DIS"].includes(stage)) {
    return "Add a meeting or circulation checkpoint before treating this stage as dependable.";
  }
  if (counts.ballots === 0 && ["NP", "DIS", "FDIS"].includes(stage)) {
    return "Decision window should be represented before this stage is considered complete.";
  }
  if (counts.consultations === 0 && stage === "CD") {
    return "Committee consultation should be represented with comment handling tasks.";
  }
  return "Checkpoint structure is present; verify dates against current committee calendar.";
}

function readinessThresholdsFor(stage) {
  const map = {
    PWI: { roadmap: 30, document: 10, references: 5, figures: 0, consensus: 25, export: 0 },
    NP: { roadmap: 45, document: 25, references: 10, figures: 0, consensus: 45, export: 0 },
    WD: { roadmap: 55, document: 45, references: 25, figures: 20, consensus: 45, export: 10 },
    CD: { roadmap: 70, document: 60, references: 45, figures: 40, consensus: 65, export: 20 },
    DIS: { roadmap: 85, document: 80, references: 75, figures: 70, consensus: 75, export: 55 },
    FDIS: { roadmap: 95, document: 92, references: 90, figures: 88, consensus: 88, export: 80 },
    PUBLICATION: { roadmap: 100, document: 100, references: 100, figures: 100, consensus: 100, export: 100 }
  };
  return map[stage] || map.PWI;
}

function clamp(value) {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function buildRoadmapWarnings(input, profile) {
  const warnings = [];
  if (profile.id === "MONTHS_18") {
    warnings.push({
      code: "ACCELERATED_TRACK",
      message: "18-month track leaves little room for unresolved terms, scope disputes or late figure-source corrections."
    });
  }

  if (!input.committeeCalendarKnown) {
    warnings.push({
      code: "COMMITTEE_CALENDAR_MISSING",
      message: "Meeting and plenary dates should be registered before relying on this roadmap."
    });
  }

  return warnings;
}

function compressionRiskLevel({ deltaDays, readiness, unverifiedCount }) {
  if (deltaDays <= -120 && readiness < 70) return "high";
  if (deltaDays <= -60 && readiness < 55) return "high";
  if (unverifiedCount > 0 && deltaDays < 0) return "medium";
  if (deltaDays < 0 || readiness < 70) return "medium";
  return "low";
}

function stakeholderFocusForStage(stage, stakeholders) {
  const stageStakeholders = stakeholders.filter((item) => !item.stage || item.stage === stage);
  if (stageStakeholders.length === 0) {
    return ["Register supporters, concerned experts and likely objectors for this stage."];
  }

  return stageStakeholders.map((item) => ({
    name: item.name || "Stakeholder",
    posture: item.posture || "unknown",
    focus: item.focus || "clarify concern and possible cooperation path"
  }));
}

function buildCalendarMissionItem({ kind, stageItem, title, date, evidence, today }) {
  const eventDate = date ? normalizeStartDate(date) : null;
  const daysUntil = eventDate ? differenceInDays(today.toISOString().slice(0, 10), eventDate.toISOString().slice(0, 10)) : null;
  const requiredEvidence = requiredEvidenceForCalendarItem(kind, stageItem);
  const missingEvidence = requiredEvidence.filter((item) => !evidence[item]);

  return {
    kind,
    stage: stageItem.stage,
    title,
    date: eventDate ? eventDate.toISOString().slice(0, 10) : null,
    daysUntil,
    urgency: urgencyForCalendarItem(daysUntil, missingEvidence.length),
    mission: stageItem.mission,
    mustPresent: stageItem.mustPresent,
    mustCirculate: stageItem.mustCirculate,
    requiredEvidence,
    missingEvidence,
    memo: calendarMissionMemo({ kind, stage: stageItem.stage, daysUntil, missingEvidence })
  };
}

function requiredEvidenceForCalendarItem(kind, stageItem) {
  const base = {
    PWI: ["needStatement", "scopeBoundary", "supporterMap"],
    NP: ["proposalPackage", "participationPlan", "draftScope"],
    WD: ["workingOutline", "termBaseline", "issueList"],
    CD: ["committeeDraft", "commentTemplate", "dispositionMethod"],
    DIS: ["stableDraft", "referenceCheck", "editableFigureSourceCheck"],
    FDIS: ["cleanExportPackage", "lateRiskList", "finalResponsePosture"],
    PUBLICATION: ["docxPackage", "osdCompanionReport", "editableSourcePackage"]
  };
  const stageEvidence = base[stageItem.stage] || [];

  if (kind === "meeting") return stageEvidence.slice(0, 3);
  if (kind === "ballot") return [...stageEvidence, "decisionWindowRecorded"];
  if (kind === "consultation") return [...stageEvidence, "commentLog"];
  return stageEvidence;
}

function urgencyForCalendarItem(daysUntil, missingCount) {
  if (daysUntil === null) return "unscheduled";
  if (daysUntil < 0 && missingCount > 0) return "overdue";
  if (daysUntil <= 21 && missingCount > 0) return "urgent";
  if (daysUntil <= 45 && missingCount > 0) return "watch";
  return "ready";
}

function calendarMissionMemo({ kind, stage, daysUntil, missingEvidence }) {
  if (daysUntil === null) return "Register a concrete date before depending on this mission.";
  if (daysUntil < 0 && missingEvidence.length > 0) return "Past checkpoint still has unresolved evidence gaps.";
  if (daysUntil <= 21 && missingEvidence.length > 0) return `${stage} ${kind} needs focused circulation before the checkpoint.`;
  if (missingEvidence.length > 0) return "Evidence gaps are visible; keep them in the next meeting package.";
  return "Required evidence signals are present for this checkpoint preview.";
}

function differenceInDays(fromDate, toDate) {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  return Math.round((to.getTime() - from.getTime()) / 86400000);
}

