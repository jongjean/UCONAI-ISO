import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { config } from "../config.js";

function safeSegment(value = "default") {
  return String(value || "default").replace(/[^a-z0-9_.-]+/gi, "_").slice(0, 80) || "default";
}

function snapshotIdFor(payload) {
  return crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex").slice(0, 16);
}

function projectRoot(projectKey) {
  return path.join(config.storageRoot, "projects", safeSegment(projectKey));
}

export async function createWorkspaceSnapshot(input = {}) {
  const projectKey = safeSegment(input.projectKey || input.projectId || input.standardSetup?.projectTitle || "default-project");
  const payload = {
    projectKey,
    createdAt: new Date().toISOString(),
    standardSetup: input.standardSetup || {},
    projectDraft: input.projectDraft || {},
    documentSections: Array.isArray(input.documentSections) ? input.documentSections : [],
    nDocuments: Array.isArray(input.nDocuments) ? input.nDocuments : [],
    fieldChangeLog: Array.isArray(input.fieldChangeLog) ? input.fieldChangeLog : [],
    aiDecisionLedger: Array.isArray(input.aiDecisionLedger) ? input.aiDecisionLedger : [],
    source: "storage-backed-workspace-snapshot"
  };
  const id = `snapshot-${snapshotIdFor(payload)}`;
  const directory = path.join(projectRoot(projectKey), "snapshots");
  const filePath = path.join(directory, `${id}.json`);
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify({ id, ...payload }, null, 2), "utf8");
  return {
    id,
    projectKey,
    createdAt: payload.createdAt,
    storageRef: filePath,
    recoverable: true,
    bytes: Buffer.byteLength(JSON.stringify(payload)),
    persistence: "storage-backed-json-snapshot"
  };
}

export async function listWorkspaceSnapshots(input = {}) {
  const projectKey = safeSegment(input.projectKey || input.projectId || "default-project");
  const directory = path.join(projectRoot(projectKey), "snapshots");
  await fs.mkdir(directory, { recursive: true });
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const snapshots = await Promise.all(entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map(async (entry) => {
      const filePath = path.join(directory, entry.name);
      const stat = await fs.stat(filePath);
      return {
        id: entry.name.replace(/\.json$/, ""),
        projectKey,
        storageRef: filePath,
        updatedAt: stat.mtime.toISOString(),
        bytes: stat.size
      };
    }));
  return {
    projectKey,
    snapshots: snapshots.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    persistence: "storage-backed-json-snapshot"
  };
}

export async function buildStorageBackupEvidence(input = {}) {
  const projectKey = safeSegment(input.projectKey || input.projectId || "default-project");
  const root = projectRoot(projectKey);
  const backupRoot = path.join(config.storageRoot, "backups", projectKey);
  const manifest = {
    id: `backup-evidence-${Date.now()}`,
    projectKey,
    createdAt: new Date().toISOString(),
    sourceRoot: root,
    backupRoot,
    includes: ["snapshots", "exports", "n-documents"],
    restoreCommandPreview: `copy ${backupRoot} back to ${root} after service stop and integrity check`,
    rehearsalRequiredForProduction: true
  };
  await fs.mkdir(backupRoot, { recursive: true });
  const manifestPath = path.join(backupRoot, `${manifest.id}.json`);
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
  return {
    ...manifest,
    storageRef: manifestPath,
    persistence: "storage-backed-backup-evidence"
  };
}
