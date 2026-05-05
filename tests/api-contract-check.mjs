import fs from "fs";
import path from "path";

const root = process.cwd();
const manifestPath = path.join(root, "backend/src/routeManifest.js");
const serverPath = path.join(root, "backend/src/server.js");
const routesDir = path.join(root, "backend/src/routes");

const manifest = fs.readFileSync(manifestPath, "utf8");
const server = fs.readFileSync(serverPath, "utf8");
const routeFiles = fs.readdirSync(routesDir).filter((file) => file.endsWith(".js"));

const mountedRoutes = [...server.matchAll(/app\.use\("([^"]+)"/g)].map((match) => match[1]);
const manifestRoutes = [...manifest.matchAll(/path: "([^"]+)"/g)].map((match) => match[1]);

const missingInManifest = mountedRoutes.filter((route) =>
  !manifestRoutes.some((entry) => entry === route || entry.startsWith(`${route}/`))
);

if (missingInManifest.length > 0) {
  console.error("Mounted routes missing manifest coverage:");
  for (const route of missingInManifest) console.error(`- ${route}`);
  process.exit(1);
}

for (const file of routeFiles) {
  const source = fs.readFileSync(path.join(routesDir, file), "utf8");
  if (source.includes('post("/run"') && !source.includes("operationLocked")) {
    console.error(`Route ${file} exposes run endpoint without operationLocked`);
    process.exit(1);
  }
  if (source.includes('post("/jobs"') && !source.includes("operationLocked") && !source.includes("createExportJob")) {
    console.error(`Route ${file} exposes jobs endpoint without operationLocked`);
    process.exit(1);
  }
}

const blockedManifestEntries = [...manifest.matchAll(/status: "blocked"[^}]+gate: "([^"]+)"/g)].map(
  (match) => match[1]
);
if (blockedManifestEntries.some((gate) => gate !== "admin-review")) {
  console.error("Blocked manifest entries must require admin-review");
  process.exit(1);
}

console.log("ISO API contract check passed");


