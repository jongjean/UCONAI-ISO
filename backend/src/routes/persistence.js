import { Router } from "express";
import { ok } from "../http/respond.js";
import {
  buildRepositoryImplementationPlan,
  listPersistenceContracts,
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
