import fs from "fs";
import path from "path";

const root = process.cwd();

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

const roadmap = read("backend/src/services/roadmapEngine.js");
for (const token of [
  "buildProcedureDiary",
  "buildStageReadinessMatrix",
  "buildTrackChangePreview",
  "buildProcedureWindowCatalog",
  "buildTrackCompressionRiskReport",
  "buildMeetingMissionBoard",
  "buildCalendarMissionOverlay",
  "procedureWindowCatalog",
  "verify-current-directives",
  "noHardcodedOfficialDurationClaim",
  "MONTHS_18",
  "MONTHS_24",
  "MONTHS_36",
  "mustPresent",
  "mustCirculate",
  "ballots",
  "consultations",
  "checkpointMemo"
  ,"calendar-overlay-only-until-db-enabled"
]) {
  if (!roadmap.includes(token)) {
    fail(`Missing roadmap phase-4 token: ${token}`);
  }
}

const review = read("backend/src/services/reviewPolicy.js");
for (const token of [
  "buildConsensusRiskMap",
  "buildMeetingParticipationLedger",
  "riskLevelFor",
  "inferObjectionIntent",
  "cooperationBoundaryFor",
  "summarizeThemes",
  "priorityMissions",
  "ledger-preview-only-until-db-enabled",
  "Guidance is advisory",
  "must not misrepresent stakeholder positions",
  "preserved separately from AI interpretation"
]) {
  if (!review.includes(token)) {
    fail(`Missing consensus phase-4 token: ${token}`);
  }
}

const roadmapRoute = read("backend/src/routes/roadmap.js");
for (const token of [
  'post("/procedure-diary"',
  'post("/stage-readiness-matrix"',
  'post("/procedure-window-catalog"',
  'post("/track-compression-risk-report"',
  'post("/meeting-mission-board"',
  'post("/calendar-mission-overlay"',
  "buildProcedureDiary",
  "buildStageReadinessMatrix",
  "buildTrackCompressionRiskReport",
  "buildCalendarMissionOverlay"
]) {
  if (!roadmapRoute.includes(token)) {
    fail(`Missing roadmap route token: ${token}`);
  }
}

const reviewsRoute = read("backend/src/routes/reviews.js");
for (const token of [
  'post("/consensus-risk-map"',
  'post("/meeting-participation-ledger"',
  "buildConsensusRiskMap"
]) {
  if (!reviewsRoute.includes(token)) {
    fail(`Missing review route token: ${token}`);
  }
}

const manifest = read("backend/src/routeManifest.js");
for (const route of [
  "/api/v1/roadmap/procedure-diary",
  "/api/v1/roadmap/stage-readiness-matrix",
  "/api/v1/roadmap/procedure-window-catalog",
  "/api/v1/roadmap/track-compression-risk-report",
  "/api/v1/roadmap/meeting-mission-board",
  "/api/v1/roadmap/calendar-mission-overlay",
  "/api/v1/reviews/consensus-risk-map",
  "/api/v1/reviews/meeting-participation-ledger"
]) {
  if (!manifest.includes(route)) {
    fail(`Missing phase-4 route manifest entry: ${route}`);
  }
}

const doc = read("docs/14_18_PHASE4_ROADMAP_CONSENSUS.md");
for (const token of [
  "Procedure Diary Model",
  "Track Change Model",
  "Meeting Mission Board",
  "Meeting Participation Ledger",
  "Procedure window catalog avoids hardcoded official duration claims",
  "Consensus Guardrails",
  "Phase 4 Cross-check"
]) {
  if (!doc.includes(token)) {
    fail(`Missing phase-4 document token: ${token}`);
  }
}

const frontendData = read("frontend/src/data.ts");
const frontendTypes = read("frontend/src/types.ts");
const app = read("frontend/src/App.tsx");
const styles = read("frontend/src/styles.css");
for (const token of [
  "TrackRiskSignal",
  "CalendarMissionSignal",
  "MeetingLedgerSignal",
  "trackRiskSignals",
  "calendarMissionSignals",
  "meetingLedgerSignals",
  "procedureWindows"
]) {
  if (!`${frontendData}\n${frontendTypes}`.includes(token)) {
    fail(`Missing frontend roadmap token: ${token}`);
  }
}

for (const token of [
  "Track Compression",
  "Calendar Mission Overlay",
  "Procedure Windows",
  "Participation Ledger",
  "calendar-mission-grid",
  "participation-grid",
  "calendarMissionSignals.map",
  "meetingLedgerSignals.map",
  "roadmap-control-grid",
  "track-risk-list"
]) {
  if (!`${app}\n${styles}`.includes(token)) {
    fail(`Missing frontend roadmap rendering token: ${token}`);
  }
}

console.log("ISO phase-4 roadmap consensus check passed");
