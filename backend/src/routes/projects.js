import { Router } from "express";
import { operationLocked } from "../http/errors.js";
import { ok } from "../http/respond.js";
import {
  buildProjectDashboardPreview,
  buildDeliverableGuidelineMatrix,
  buildProjectPreview,
  buildWorkspaceContract,
  validateArchiveRequest,
  validateProjectDraft,
  validateWorkspaceContract
} from "../services/projectPolicy.js";
import { buildRoadmapPreview } from "../services/roadmapEngine.js";

export const projectsRouter = Router();

projectsRouter.get("/", (_req, res) => {
  ok(res, {
    projects: [],
    note: "Project persistence is not enabled yet. DB schema review is required before implementation."
  });
});

projectsRouter.post("/", (_req, _res, next) => {
  next(operationLocked(
    "ISO project creation is blocked until PostgreSQL schema and migration plan are enabled.",
    {
      reviewType: "admin-review",
      blockedResource: "uconai_iso database"
    }
  ));
});

projectsRouter.post("/validate", (req, res) => {
  ok(res, validateProjectDraft(req.body || {}), {
    persistence: "disabled-until-db-enabled"
  });
});

projectsRouter.post("/preview", (req, res) => {
  const project = buildProjectPreview(req.body || {});
  const roadmap = buildRoadmapPreview({
    track: project.preview.normalized.track,
    startDate: req.body?.startDate,
    committeeCalendarKnown: Boolean(req.body?.committeeCalendarKnown)
  });

  ok(res, {
    ...project,
    roadmap
  });
});

projectsRouter.post("/deliverable-guidelines", (req, res) => {
  ok(res, buildDeliverableGuidelineMatrix(req.body || {}));
});

projectsRouter.post("/dashboard-preview", (req, res) => {
  ok(res, buildProjectDashboardPreview(req.body || {}));
});

projectsRouter.get("/workspace-contract", (_req, res) => {
  ok(res, buildWorkspaceContract());
});

projectsRouter.post("/workspace/validate", (req, res) => {
  ok(res, validateWorkspaceContract(req.body || {}));
});

projectsRouter.post("/archive/validate", (req, res) => {
  ok(res, validateArchiveRequest(req.body || {}));
});


