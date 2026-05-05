import { Router } from "express";
import { config } from "../config.js";
import { validateRuntimeConfig } from "../services/configValidation.js";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  const runtime = validateRuntimeConfig();
  res.json({
    status: runtime.ok ? "ok" : "degraded",
    service: "iso-api",
    version: "0.1.0",
    env: config.env,
    runtime,
    timestamp: new Date().toISOString()
  });
});


