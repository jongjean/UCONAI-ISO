import { Router } from "express";
import { ok } from "../http/respond.js";
import {
  buildRepositoryImplementationPlan,
  buildStorageBackupEvidence,
  createWorkspaceSnapshot,
  listPersistenceContracts,
  listWorkspaceSnapshots,
  validatePersistenceOperation
} from "../services/persistenceContracts.js";

export const persistenceRouter = Router();

persistenceRouter.get("/contracts", (_req, res) => {
  ok(res, listPersistenceContracts());
});

persistenceRouter.get("/implementation-plan", (_req, res) => {
  ok(res, buildRepositoryImplementationPlan());
});

persistenceRouter.post("/operation/validate", (req, res) => {
  ok(res, validatePersistenceOperation(req.body || {}));
});

persistenceRouter.post("/workspace-snapshots", async (req, res, next) => {
  try {
    ok(res, await createWorkspaceSnapshot(req.body || {}));
  } catch (error) {
    next(error);
  }
});

persistenceRouter.post("/workspace-snapshots/list", async (req, res, next) => {
  try {
    ok(res, await listWorkspaceSnapshots(req.body || {}));
  } catch (error) {
    next(error);
  }
});

persistenceRouter.post("/backup-evidence", async (req, res, next) => {
  try {
    ok(res, await buildStorageBackupEvidence(req.body || {}));
  } catch (error) {
    next(error);
  }
});
