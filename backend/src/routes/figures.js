import { Router } from "express";
import { operationLocked } from "../http/errors.js";
import { ok } from "../http/respond.js";
import {
  buildEditableSourcePackagePreview,
  buildEditableDiagramPlan,
  buildEditableFigureSourceBlueprint,
  buildFigureReadinessReport,
  buildFigureAuthoringGuidance,
  buildFigureSpec,
  validateFigureAsset
} from "../services/figurePolicy.js";

export const figuresRouter = Router();

figuresRouter.post("/validate", (req, res) => {
  ok(res, validateFigureAsset(req.body || {}));
});

figuresRouter.post("/spec", (req, res) => {
  ok(res, buildFigureSpec(req.body || {}));
});

figuresRouter.post("/readiness-report", (req, res) => {
  ok(res, buildFigureReadinessReport(req.body || {}));
});

figuresRouter.post("/source-package-preview", (req, res) => {
  ok(res, buildEditableSourcePackagePreview(req.body || {}));
});

figuresRouter.post("/diagram-plan", (req, res) => {
  ok(res, buildEditableDiagramPlan(req.body || {}));
});

figuresRouter.post("/source-blueprint", (req, res) => {
  ok(res, buildEditableFigureSourceBlueprint(req.body || {}));
});

figuresRouter.post("/authoring-guidance", (req, res) => {
  ok(res, buildFigureAuthoringGuidance(req.body || {}));
});

figuresRouter.post("/generate-source", (_req, _res, next) => {
  next(operationLocked(
    "Editable figure source generation is blocked until storage and tool execution policy are configured.",
    { reviewType: "admin-review", blockedResource: "figure_assets" }
  ));
});


