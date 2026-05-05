import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { config } from "../config.js";

export const isoStages = ["PWI", "NP", "WD", "CD", "DIS", "FDIS", "Publish"];

const stageRules = [
  {
    stage: "Publish",
    weight: 7,
    terms: ["publication", "published", "publish", "final publication", "standard is available"]
  },
  {
    stage: "FDIS",
    weight: 6,
    terms: ["fdis", "final draft international standard", "final draft ballot"]
  },
  {
    stage: "DIS",
    weight: 5,
    terms: ["dis", "draft international standard", "enquiry", "enquiry ballot"]
  },
  {
    stage: "CD",
    weight: 4,
    terms: ["committee draft", "committee stage", "cd ballot", "cd consultation"]
  },
  {
    stage: "WD",
    weight: 3,
    terms: ["working draft", "working group draft", "wd", "editor draft"]
  },
  {
    stage: "NP",
    weight: 2,
    terms: ["new work item proposal", "new proposal", "np ballot", "np accepted", "nwi proposal"]
  },
  {
    stage: "PWI",
    weight: 1,
    terms: ["preliminary work item", "pwi", "plenary", "project idea", "study period"]
  }
];

const eventRules = [
  { eventType: "vote", terms: ["vote", "ballot", "voting result", "result of voting"] },
  { eventType: "circulation", terms: ["circulation", "circulated", "comment period", "consultation"] },
  { eventType: "plenary", terms: ["plenary", "general assembly", "총회"] },
  { eventType: "meeting", terms: ["meeting", "minutes", "agenda", "회의"] },
  { eventType: "decision", terms: ["decision", "resolution", "resolved", "decided", "accepted"] },
  { eventType: "presentation", terms: ["presentation", "presented", "slide", "발표"] },
  { eventType: "regulation", terms: ["regulation", "directive", "procedure"] },
  { eventType: "reference", terms: ["reference", "bibliography", "source", "참고"] }
];

const doneTerms = [
  "accepted",
  "completed",
  "confirmed",
  "adopted",
  "resolved",
  "submitted",
  "circulated",
  "held",
  "registered",
  "완료",
  "확정",
  "제출",
  "회람"
];

const todoTerms = [
  "shall",
  "must",
  "should",
  "action",
  "next",
  "pending",
  "required",
  "prepare",
  "submit",
  "review",
  "해야",
  "필요",
  "다음",
  "검토",
  "준비"
];

function normalizeText(value = "") {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function scoreRules(text, rules) {
  const lower = text.toLowerCase();
  return rules.map((rule) => {
    const matchedTerms = rule.terms.filter((term) => termMatches(lower, term));
    return {
      ...rule,
      matchedTerms,
      score: matchedTerms.length * (rule.weight || 1)
    };
  }).filter((rule) => rule.score > 0);
}

function termMatches(lowerText, term) {
  const normalizedTerm = term.toLowerCase();
  if (/^[a-z0-9]{2,5}$/.test(normalizedTerm)) {
    return new RegExp(`(^|[^a-z0-9])${escapeRegExp(normalizedTerm)}([^a-z0-9]|$)`, "i").test(lowerText);
  }
  return lowerText.includes(normalizedTerm);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function splitSentences(text) {
  return normalizeText(text)
    .split(/(?<=[.!?])\s+|[\n\r]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 120);
}

function classifyEvent(text) {
  const matches = scoreRules(text, eventRules);
  return matches.sort((a, b) => b.score - a.score)[0]?.eventType || "reference";
}

export function analyzeNDocument(input = {}) {
  const fileName = String(input.fileName || "untitled-n-document.txt");
  const contentText = String(input.contentText || "");
  const combinedText = `${fileName}\n${contentText}`;
  const stageMatches = scoreRules(combinedText, stageRules).sort((a, b) => b.score - a.score);
  const strongest = stageMatches[0];
  const detectedStage = strongest?.stage || String(input.fallbackStage || "PWI");
  const confidence = !strongest ? "low" : strongest.score >= 6 ? "high" : strongest.score >= 2 ? "medium" : "low";
  const sentences = splitSentences(contentText);
  const done = sentences
    .filter((sentence) => doneTerms.some((term) => sentence.toLowerCase().includes(term)))
    .slice(0, 5);
  const todo = sentences
    .filter((sentence) => todoTerms.some((term) => sentence.toLowerCase().includes(term)))
    .slice(0, 6);
  const eventType = classifyEvent(combinedText);
  const contentPreview = normalizeText(contentText).slice(0, 2400) || "Original preview is unavailable for this file type.";
  const id = crypto.createHash("sha256").update(`${fileName}\n${contentText}\n${Date.now()}`).digest("hex").slice(0, 16);

  return {
    id: `n-doc-${id}`,
    fileName,
    uploadedAt: new Date().toISOString(),
    eventType,
    stage: detectedStage,
    confidence,
    summary: `${eventType} evidence mapped to ${detectedStage} with ${confidence} confidence.`,
    contentPreview,
    done: done.length > 0 ? done : [`Treat this source as ${detectedStage} evidence until a stronger committee record is uploaded.`],
    todo: todo.length > 0 ? todo : [`Confirm the next ${detectedStage} action with meeting, circulation or ballot evidence.`],
    matchedTerms: stageMatches.slice(0, 4).map((match) => ({
      stage: match.stage,
      terms: match.matchedTerms
    }))
  };
}

export function buildStageAssessment(input = {}) {
  const documents = Array.isArray(input.nDocuments) ? input.nDocuments : [];
  const currentStage = String(input.currentStage || documents[0]?.stage || "PWI");
  const stageIndex = Math.max(0, isoStages.indexOf(currentStage));
  const stageEvidence = Object.fromEntries(isoStages.map((stage) => [
    stage,
    documents.filter((documentRecord) => documentRecord.stage === stage).length
  ]));
  const latest = documents[0];
  const requiredEvidence = {
    PWI: ["project need memo", "committee fit note", "initial meeting record"],
    NP: ["proposal form", "supporter evidence", "decision window record"],
    WD: ["working draft", "editor action log", "WG review notes"],
    CD: ["committee draft", "comment log", "consultation checkpoint"],
    DIS: ["enquiry package", "comment resolution plan", "reference readiness evidence"],
    FDIS: ["final draft package", "final check record", "publication handoff note"],
    Publish: ["publication notice", "release evidence", "archive package"]
  };
  const missingEvidence = requiredEvidence[currentStage] || requiredEvidence.PWI;
  const progress = Math.round(((stageIndex + 1) / isoStages.length) * 100);

  return {
    currentStage,
    progress,
    stageEvidence,
    latestEvidence: latest ? {
      fileName: latest.fileName,
      eventType: latest.eventType,
      stage: latest.stage,
      summary: latest.summary
    } : null,
    nextActions: [
      `Validate ${currentStage} position with source evidence before moving to the next stage.`,
      `Register missing ${currentStage} evidence: ${missingEvidence.join(", ")}.`,
      "Keep every uploaded N-document reopenable and tied to a dashboard marker."
    ],
    missingEvidence
  };
}

export async function storeNDocumentAnalysis(analysis, sourceText = "") {
  const directory = path.join(config.storageRoot, "n-documents");
  await fs.mkdir(directory, { recursive: true });
  const safeName = analysis.fileName.replace(/[^a-z0-9_.-]+/gi, "_").slice(0, 120);
  const analysisPath = path.join(directory, `${analysis.id}-${safeName}.json`);
  await fs.writeFile(analysisPath, JSON.stringify({ analysis, sourceText }, null, 2), "utf8");
  return {
    ...analysis,
    storageRef: analysisPath
  };
}
