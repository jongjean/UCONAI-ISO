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

const app = read("backend/src/app.js");
for (const token of [
  "export function createApp()",
  'app.disable("x-powered-by")',
  "helmet()",
  "cors({ origin: true, credentials: true })",
  'express.json({ limit: "1mb" })',
  'app.use("/api/v1/projects"',
  'app.use("/api/v1/exports"',
  'code: "NOT_FOUND"',
  "error(res, err)"
]) {
  if (!app.includes(token)) {
    fail(`Missing app contract token: ${token}`);
  }
}

const server = read("backend/src/server.js");
for (const token of [
  "export function startServer()",
  "createApp()",
  "config.host",
  "config.port",
  'process.env.ISO_DISABLE_LISTEN !== "1"'
]) {
  if (!server.includes(token)) {
    fail(`Missing server contract token: ${token}`);
  }
}

const config = read("backend/src/config.js");
if (!config.includes('host: process.env.ISO_API_HOST || "127.0.0.1"')) {
  fail("Server host must default to 127.0.0.1");
}

const backendPackage = read("backend/package.json");
if (!backendPackage.includes("node --check src/app.js")) {
  fail("Backend check script must include src/app.js");
}

console.log("ISO runtime source contract check passed");
