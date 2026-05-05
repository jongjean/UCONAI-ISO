import { Router } from "express";
import { ok } from "../http/respond.js";
import { analyzeNDocument, buildStageAssessment, storeNDocumentAnalysis } from "../services/nDocumentEngine.js";

export const nDocumentsRouter = Router();

nDocumentsRouter.post("/analyze", async (req, res, next) => {
  try {
    const payload = req.body || {};
    const analysis = analyzeNDocument({
      fileName: payload.fileName,
      contentText: payload.contentText,
      fallbackStage: payload.fallbackStage
    });
    const stored = await storeNDocumentAnalysis(analysis, payload.contentText || "");
    ok(res, stored);
  } catch (error) {
    next(error);
  }
});

nDocumentsRouter.post("/stage-assessment", (req, res) => {
  ok(res, buildStageAssessment(req.body || {}));
});
