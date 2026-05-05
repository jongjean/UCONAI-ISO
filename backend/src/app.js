import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config.js";
import { error } from "./http/respond.js";
import { healthRouter } from "./routes/health.js";
import { locksRouter } from "./routes/locks.js";
import { architectureRouter } from "./routes/architecture.js";
import { billingRouter } from "./routes/billing.js";
import { aiRouter } from "./routes/ai.js";
import { agentsRouter } from "./routes/agents.js";
import { authRouter } from "./routes/auth.js";
import { configStatusRouter } from "./routes/configStatus.js";
import { documentsRouter } from "./routes/documents.js";
import { exportsRouter } from "./routes/exports.js";
import { figuresRouter } from "./routes/figures.js";
import { nDocumentsRouter } from "./routes/nDocuments.js";
import { persistenceRouter } from "./routes/persistence.js";
import { policyRouter } from "./routes/policy.js";
import { projectsRouter } from "./routes/projects.js";
import { roadmapRouter } from "./routes/roadmap.js";
import { referencesRouter } from "./routes/references.js";
import { reviewsRouter } from "./routes/reviews.js";
import { routesRouter } from "./routes/routes.js";
import { termsRouter } from "./routes/terms.js";
import { versionsRouter } from "./routes/versions.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(config.env === "production" ? "combined" : "dev"));

  app.use("/health", healthRouter);
  app.use("/ready", healthRouter);
  app.use("/api/v1/architecture", architectureRouter);
  app.use("/api/v1/billing", billingRouter);
  app.use("/api/v1/ai", aiRouter);
  app.use("/api/v1/agents", agentsRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/config-status", configStatusRouter);
  app.use("/api/v1/documents", documentsRouter);
  app.use("/api/v1/n-documents", nDocumentsRouter);
  app.use("/api/v1/exports", exportsRouter);
  app.use("/api/v1/figures", figuresRouter);
  app.use("/api/v1/persistence", persistenceRouter);
  app.use("/api/v1/locks", locksRouter);
  app.use("/api/v1/policy", policyRouter);
  app.use("/api/v1/projects", projectsRouter);
  app.use("/api/v1/roadmap", roadmapRouter);
  app.use("/api/v1/references", referencesRouter);
  app.use("/api/v1/reviews", reviewsRouter);
  app.use("/api/v1/routes", routesRouter);
  app.use("/api/v1/terms", termsRouter);
  app.use("/api/v1/versions", versionsRouter);

  app.use((_req, res) => {
    res.status(404).json({
      ok: false,
      error: {
        code: "NOT_FOUND",
        message: "ISO API route not found",
        details: {}
      }
    });
  });

  app.use((err, _req, res, _next) => {
    console.error("[iso-api] unhandled error", err);
    error(res, err);
  });

  return app;
}
