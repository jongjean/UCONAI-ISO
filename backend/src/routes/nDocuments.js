import { Router } from "express";
import { ok } from "../http/respond.js";
import {
  analyzeNDocument,
  buildEvidenceGrounding,
  buildKnowledgeIndex,
  buildProjectMemorySnapshot,
  buildProjectControlSnapshot,
  buildStageAssessment,
  queryKnowledgeIndex,
  storeNDocumentAnalysis
} from "../services/nDocumentEngine.js";

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

nDocumentsRouter.post("/knowledge-index", (req, res) => {
  ok(res, buildKnowledgeIndex(req.body || {}));
});

nDocumentsRouter.post("/rag-query", (req, res) => {
  ok(res, queryKnowledgeIndex(req.body || {}));
});

nDocumentsRouter.post("/project-control-snapshot", (req, res) => {
  ok(res, buildProjectControlSnapshot(req.body || {}));
});

nDocumentsRouter.post("/evidence-grounding", (req, res) => {
  ok(res, buildEvidenceGrounding(req.body || {}));
});

nDocumentsRouter.post("/project-memory-snapshot", (req, res) => {
  ok(res, buildProjectMemorySnapshot(req.body || {}));
});
