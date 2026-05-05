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

const api = read("frontend/src/api.ts");
for (const token of [
  "ApiProbeState",
  "probeIsoApi",
  "VITE_ISO_API_BASE_URL",
  "/iso/api/v1",
  "development-progress-map",
  "Frontend preview is open"
]) {
  if (!api.includes(token)) fail(`Missing frontend API probe token: ${token}`);
}

const app = read("frontend/src/App.tsx");
const styles = read("frontend/src/styles.css");
for (const token of [
  "Runtime Probe",
  "Preview connection state",
  "api-probe-panel",
  "apiProbe.progress",
  "probeIsoApi()"
]) {
  if (!`${app}\n${styles}`.includes(token)) fail(`Missing runtime probe UI token: ${token}`);
}

const vite = read("frontend/vite.config.ts");
for (const token of [
  '"/iso/api"',
  'target: "http://127.0.0.1:4510"',
  'path.replace(/^\\/iso\\/api/, "/api")',
  '"/iso/health"'
]) {
  if (!vite.includes(token)) fail(`Missing Vite proxy token: ${token}`);
}

console.log("ISO frontend runtime probe check passed");
