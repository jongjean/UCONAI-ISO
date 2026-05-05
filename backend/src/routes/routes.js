import { Router } from "express";
import { ok } from "../http/respond.js";
import { routeManifest } from "../routeManifest.js";

export const routesRouter = Router();

routesRouter.get("/", (_req, res) => {
  ok(res, {
    routes: routeManifest,
    blockedCount: routeManifest.filter((route) => route.status === "blocked").length
  });
});



