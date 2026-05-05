import fs from "fs";
import path from "path";

const root = process.cwd();

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

const config = read("backend/src/config.js");
for (const token of [
  'host: process.env.ISO_API_HOST || "127.0.0.1"',
  'port: numberFromEnv("ISO_API_PORT", 4510)',
  'publicBasePath: process.env.ISO_PUBLIC_BASE_PATH || "/iso/"',
  'storageRoot: process.env.ISO_STORAGE_ROOT || "/uconai/data/iso/storage"',
  'logDir: process.env.ISO_LOG_DIR || "/uconai/data/iso/logs"',
  'apiHost: "127.0.0.1"',
  "protectedOperations"
]) {
  if (!config.includes(token)) {
    fail(`Missing HP config token: ${token}`);
  }
}

const configValidation = read("backend/src/services/configValidation.js");
for (const token of [
  "ISO_API_HOST",
  "ISO_STORAGE_ROOT",
  "ISO_LOG_DIR",
  "expectedCaddyProxyTarget",
  "buildExecutionModeMatrix",
  "buildHpReadinessGate",
  "frontend-preview",
  "public-deploy",
  "SERVICE_EXECUTION_REVIEW_REQUIRED",
  "CADDY_VALIDATION_REQUIRED",
  "source-config-validation-only",
  "paid-ai-provider"
]) {
  if (!configValidation.includes(token)) {
    fail(`Missing HP config validation token: ${token}`);
  }
}

const preflight = read("tools/iso_hp_preflight.py");
for (const token of [
  "RESERVED_PORTS",
  "PREVIEW_PORTS",
  "processChecks",
  "codex-exec",
  "codex-smoke",
  "iso-api",
  "4510",
  "collect()",
  "--json",
  "no DB creation, no migration, no service start, no Caddy change, no deploy"
]) {
  if (!preflight.includes(token)) {
    fail(`Missing HP preflight token: ${token}`);
  }
}

const configRoute = read("backend/src/routes/configStatus.js");
for (const token of [
  'get("/execution-modes"',
  'post("/hp-readiness-gate"',
  "buildExecutionModeMatrix",
  "buildHpReadinessGate"
]) {
  if (!configRoute.includes(token)) {
    fail(`Missing config status route token: ${token}`);
  }
}

const manifest = read("backend/src/routeManifest.js");
for (const route of [
  "/api/v1/config-status/execution-modes",
  "/api/v1/config-status/hp-readiness-gate"
]) {
  if (!manifest.includes(route)) {
    fail(`Missing phase-8 route manifest entry: ${route}`);
  }
}

if (!exists("infra/iso-api.service.draft")) {
  fail("Missing draft ISO API systemd unit");
}
if (!exists("infra/Caddyfile.iso.draft")) {
  fail("Missing draft ISO Caddy snippet");
}

const serviceDraft = read("infra/iso-api.service.draft");
for (const token of [
  "WorkingDirectory=/uconai/projects/iso",
  "ISO_API_HOST=127.0.0.1",
  "ISO_API_PORT=4510",
  "ISO_PUBLIC_BASE_PATH=/iso/",
  "NoNewPrivileges=true"
]) {
  if (!serviceDraft.includes(token)) {
    fail(`Missing service draft token: ${token}`);
  }
}

const caddyDraft = read("infra/Caddyfile.iso.draft");
for (const token of [
  "handle_path /iso/api/*",
  "reverse_proxy 127.0.0.1:4510",
  "root * /uconai/www/iso",
  "file_server"
]) {
  if (!caddyDraft.includes(token)) {
    fail(`Missing Caddy draft token: ${token}`);
  }
}

const doc = read("docs/22_PHASE8_HP_EXECUTION_READINESS.md");
for (const token of [
  "Phase 8 Objective",
  "HP Runtime Contract",
  "Protected Operations",
  "Readiness Flow",
  "Execution Modes",
  "Phase 8 Cross-check"
]) {
  if (!doc.includes(token)) {
    fail(`Missing phase-8 document token: ${token}`);
  }
}

console.log("ISO phase-8 HP readiness check passed");
