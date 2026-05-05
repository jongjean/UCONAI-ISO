import { Router } from "express";
import { ok } from "../http/respond.js";
import {
  buildCalendarMissionOverlay,
  buildProcedureDiary,
  buildProcedureWindowCatalog,
  buildMeetingMissionBoard,
  buildRoadmapPreview,
  buildStageReadinessMatrix,
  buildTrackCompressionRiskReport,
  buildTrackChangePreview,
  trackProfiles
} from "../services/roadmapEngine.js";

export const roadmapRouter = Router();

roadmapRouter.get("/", (_req, res) => {
  ok(res, {
    tracks: trackProfiles,
    stages: ["PWI", "NP", "WD", "CD", "DIS", "FDIS", "PUBLICATION"],
    persistence: "disabled-until-db-enabled",
    policy: "Roadmap changes are preview-only until project DB and audit workflow are enabled."
  });
});

roadmapRouter.post("/preview", (req, res) => {
  ok(res, buildRoadmapPreview(req.body || {}));
});

roadmapRouter.post("/track-change-preview", (req, res) => {
  ok(res, buildTrackChangePreview(req.body || {}));
});

roadmapRouter.post("/procedure-diary", (req, res) => {
  ok(res, buildProcedureDiary(req.body || {}));
});

roadmapRouter.post("/stage-readiness-matrix", (req, res) => {
  ok(res, buildStageReadinessMatrix(req.body || {}));
});

roadmapRouter.post("/procedure-window-catalog", (req, res) => {
  ok(res, buildProcedureWindowCatalog(req.body || {}));
});

roadmapRouter.post("/track-compression-risk-report", (req, res) => {
  ok(res, buildTrackCompressionRiskReport(req.body || {}));
});

roadmapRouter.post("/meeting-mission-board", (req, res) => {
  ok(res, buildMeetingMissionBoard(req.body || {}));
});

roadmapRouter.post("/calendar-mission-overlay", (req, res) => {
  ok(res, buildCalendarMissionOverlay(req.body || {}));
});

roadmapRouter.get("/tracks", (_req, res) => {
  ok(res, {
    tracks: trackProfiles
  });
});


