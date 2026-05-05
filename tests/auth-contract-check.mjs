import fs from "fs";
import path from "path";

const root = process.cwd();

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

const authPolicy = read("backend/src/services/authPolicy.js");
for (const token of [
  "roleActionMap",
  "buildPermissionMatrix",
  "validatePermissionCheck",
  "buildSessionEnvelope",
  "ACTIVE_LOCK_REQUIRED",
  "PREMIUM_BILLING_REQUIRED",
  "secretsExposedToBrowser: false",
  "EDITOR_LOCK_POLICY_APPLIES"
]) {
  if (!authPolicy.includes(token)) {
    fail(`Missing auth policy token: ${token}`);
  }
}

const authRoute = read("backend/src/routes/auth.js");
for (const token of [
  'get("/permissions/matrix"',
  'post("/permissions/check"',
  'post("/session/preview"',
  "buildPermissionMatrix",
  "validatePermissionCheck",
  "buildSessionEnvelope"
]) {
  if (!authRoute.includes(token)) {
    fail(`Missing auth route token: ${token}`);
  }
}

const manifest = read("backend/src/routeManifest.js");
for (const route of [
  "/api/v1/auth/permissions/matrix",
  "/api/v1/auth/permissions/check",
  "/api/v1/auth/session/preview"
]) {
  if (!manifest.includes(route)) {
    fail(`Missing auth route manifest entry: ${route}`);
  }
}

const doc = read("docs/01A_AUTH_SESSION_ROLE_CONTRACT.md");
for (const token of [
  "Identity Model",
  "Roles",
  "Permission Rules",
  "API Contract",
  "Cross-check"
]) {
  if (!doc.includes(token)) {
    fail(`Missing auth document token: ${token}`);
  }
}

console.log("ISO auth contract check passed");
