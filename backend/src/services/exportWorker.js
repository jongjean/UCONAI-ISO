import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { config } from "../config.js";
import {
  buildDocxAssemblyPlan,
  buildFormalExportGateReport,
  buildOsdCompanionReportPreview,
  buildSourcePackageBindingReport
} from "./exportPolicy.js";

function safeSegment(value = "default") {
  return String(value || "default").replace(/[^a-z0-9_.-]+/gi, "_").slice(0, 80) || "default";
}

function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let index = 0; index < 8; index += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function dosTime(date = new Date()) {
  return ((date.getHours() & 0x1f) << 11) | ((date.getMinutes() & 0x3f) << 5) | ((Math.floor(date.getSeconds() / 2)) & 0x1f);
}

function dosDate(date = new Date()) {
  return (((date.getFullYear() - 1980) & 0x7f) << 9) | (((date.getMonth() + 1) & 0xf) << 5) | (date.getDate() & 0x1f);
}

function buildZip(files) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  const now = new Date();
  for (const file of files) {
    const name = Buffer.from(file.name, "utf8");
    const data = Buffer.isBuffer(file.data) ? file.data : Buffer.from(String(file.data), "utf8");
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt16LE(dosTime(now), 10);
    local.writeUInt16LE(dosDate(now), 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    localParts.push(local, name, data);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0, 8);
    central.writeUInt16LE(0, 10);
    central.writeUInt16LE(dosTime(now), 12);
    central.writeUInt16LE(dosDate(now), 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(data.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt16LE(0, 30);
    central.writeUInt16LE(0, 32);
    central.writeUInt16LE(0, 34);
    central.writeUInt16LE(0, 36);
    central.writeUInt32LE(0, 38);
    central.writeUInt32LE(offset, 42);
    centralParts.push(central, name);
    offset += local.length + name.length + data.length;
  }
  const centralDirectory = Buffer.concat(centralParts);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20);
  return Buffer.concat([...localParts, centralDirectory, end]);
}

function documentXml(input = {}) {
  const title = input.title || input.standardTitle || "UCONAI ISO document";
  const sections = Array.isArray(input.elements) && input.elements.length > 0
    ? input.elements
    : [
      { title: "Scope", text: input.scope || "Scope content is not yet provided." },
      { title: "Normative references", text: "Reference readiness is tracked by the ISO export gate." },
      { title: "Terms and definitions", text: "Terminology readiness is tracked by the ISO engine." }
    ];
  const paragraphs = [
    `<w:p><w:r><w:t>${escapeXml(title)}</w:t></w:r></w:p>`,
    ...sections.flatMap((section, index) => [
      `<w:p><w:r><w:t>${index + 1}. ${escapeXml(section.title || section.type || "Section")}</w:t></w:r></w:p>`,
      `<w:p><w:r><w:t>${escapeXml(section.text || section.summary || section.memo || "Generated from structured source.")}</w:t></w:r></w:p>`
    ])
  ].join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paragraphs}<w:sectPr/></w:body></w:document>`;
}

function minimalDocx(input = {}) {
  return buildZip([
    {
      name: "[Content_Types].xml",
      data: `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`
    },
    {
      name: "_rels/.rels",
      data: `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`
    },
    {
      name: "word/document.xml",
      data: documentXml(input)
    }
  ]);
}

export async function createExportJob(input = {}) {
  const projectKey = safeSegment(input.projectKey || input.projectId || input.standardSetup?.projectTitle || "default-project");
  const id = `export-${crypto.createHash("sha256").update(JSON.stringify({ input, at: Date.now() })).digest("hex").slice(0, 16)}`;
  const directory = path.join(config.storageRoot, "projects", projectKey, "exports", id);
  await fs.mkdir(directory, { recursive: true });

  const stage = input.stage || input.currentStage || input.projectDraft?.stage || "PWI";
  const sourceVersionIds = input.sourceVersionIds || [`${id}-source`];
  const elements = Array.isArray(input.elements) ? input.elements : [];
  const gate = buildFormalExportGateReport({
    ...input,
    stage,
    projectId: projectKey,
    sourceVersionIds,
    elements,
    completedChecks: input.completedChecks || ["structured-elements", "version-binding"]
  });
  const osd = buildOsdCompanionReportPreview({
    ...input,
    stage,
    projectId: projectKey,
    sourceVersionIds,
    completedChecks: input.completedChecks || ["structured-elements", "version-binding"]
  });
  const assembly = buildDocxAssemblyPlan({ ...input, stage, elements });
  const sourcePackage = buildSourcePackageBindingReport({ ...input, stage, figures: input.figures || [] });
  const docxPath = path.join(directory, "document.docx");
  const osdPath = path.join(directory, "osd-readiness-report.md");
  const sourceMapPath = path.join(directory, "source-version-map.json");
  const metadataPath = path.join(directory, "export-metadata.json");

  await fs.writeFile(docxPath, minimalDocx({
    title: input.standardSetup?.standardTitle || input.projectDraft?.title || projectKey,
    scope: input.standardSetup?.scopeDraft,
    elements
  }));
  await fs.writeFile(osdPath, [
    "# OSD Companion Readiness Report",
    "",
    `Stage: ${stage}`,
    `Project: ${projectKey}`,
    "",
    "## Open blockers",
    ...(gate.blockers.length > 0 ? gate.blockers.map((blocker) => `- ${blocker.code}: ${blocker.message}`) : ["- None in this generated package preview."])
  ].join("\n"), "utf8");
  await fs.writeFile(sourceMapPath, JSON.stringify({ sourceVersionIds, assembly: assembly.sections }, null, 2), "utf8");
  await fs.writeFile(metadataPath, JSON.stringify({ id, projectKey, stage, gate, osd, sourcePackage, createdAt: new Date().toISOString() }, null, 2), "utf8");

  return {
    id,
    projectKey,
    stage,
    status: "completed",
    files: [
      { name: "document.docx", storageRef: docxPath },
      { name: "osd-readiness-report.md", storageRef: osdPath },
      { name: "source-version-map.json", storageRef: sourceMapPath },
      { name: "export-metadata.json", storageRef: metadataPath }
    ],
    gateOpen: gate.gateOpen,
    blockerCount: gate.blockers.length + sourcePackage.blockers.length,
    persistence: "storage-backed-export-job"
  };
}
