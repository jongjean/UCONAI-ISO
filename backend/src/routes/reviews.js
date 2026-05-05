import { Router } from "express";
import { operationLocked } from "../http/errors.js";
import { ok } from "../http/respond.js";
import {
  buildCommentResponsePlan,
  buildConsensusRiskMap,
  buildMeetingParticipationLedger,
  buildMeetingMissionPlan,
  buildStakeholderMap,
  consensusPolicy,
  validateCommentDisposition,
  validateCommitteeActor
} from "../services/reviewPolicy.js";

export const reviewsRouter = Router();

reviewsRouter.get("/", (_req, res) => {
  ok(res, {
    reviewObjects: ["committeeActor", "comment", "disposition", "decisionRecord", "missionNote"],
    persistence: "disabled-until-db-enabled",
    policy: consensusPolicy()
  });
});

reviewsRouter.get("/consensus-policy", (_req, res) => {
  ok(res, consensusPolicy());
});

reviewsRouter.post("/actors/validate", (req, res) => {
  ok(res, validateCommitteeActor(req.body || {}));
});

reviewsRouter.post("/comments/validate", (req, res) => {
  ok(res, validateCommentDisposition(req.body || {}));
});

reviewsRouter.post("/stakeholder-map", (req, res) => {
  ok(res, buildStakeholderMap(req.body || {}));
});

reviewsRouter.post("/comment-response-plan", (req, res) => {
  ok(res, buildCommentResponsePlan(req.body || {}));
});

reviewsRouter.post("/meeting-mission-plan", (req, res) => {
  ok(res, buildMeetingMissionPlan(req.body || {}));
});

reviewsRouter.post("/consensus-risk-map", (req, res) => {
  ok(res, buildConsensusRiskMap(req.body || {}));
});

reviewsRouter.post("/meeting-participation-ledger", (req, res) => {
  ok(res, buildMeetingParticipationLedger(req.body || {}));
});

reviewsRouter.post("/comments", (_req, _res, next) => {
  next(operationLocked(
    "Review comment persistence is blocked until DB schema and audit workflow are enabled.",
    { reviewType: "admin-review", blockedResource: "comment_dispositions" }
  ));
});


