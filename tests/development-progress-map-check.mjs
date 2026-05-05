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

const acceptancePolicy = read("backend/src/services/acceptancePolicy.js");
for (const token of [
  "developmentChapterMap",
  "buildDevelopmentProgressMap",
  "totalProgress",
  "nextFocus",
  "chapter: 25",
  "source progress map only"
]) {
  if (!acceptancePolicy.includes(token)) fail(`Missing development progress token: ${token}`);
}

const policyRoute = read("backend/src/routes/policy.js");
if (!policyRoute.includes('post("/development-progress-map"')) {
  fail("Missing development progress route");
}

const manifest = read("backend/src/routeManifest.js");
if (!manifest.includes("/api/v1/policy/development-progress-map")) {
  fail("Missing development progress route manifest entry");
}

const frontendData = read("frontend/src/data.ts");
const frontendTypes = read("frontend/src/types.ts");
const app = read("frontend/src/App.tsx");
const styles = read("frontend/src/styles.css");
for (const token of [
  "DeliveryMapSignal",
  "deliveryMapSignals",
  "25 chapter completion control",
  "delivery-map-grid",
  "deliveryMapSignals.map"
]) {
  if (!`${frontendData}\n${frontendTypes}\n${app}\n${styles}`.includes(token)) {
    fail(`Missing frontend development map token: ${token}`);
  }
}

console.log("ISO development progress map check passed");
