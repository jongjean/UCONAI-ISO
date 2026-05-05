import { Router } from "express";
import { productArchitecture } from "../contracts.js";

export const architectureRouter = Router();

architectureRouter.get("/", (_req, res) => {
  res.json(productArchitecture);
});



