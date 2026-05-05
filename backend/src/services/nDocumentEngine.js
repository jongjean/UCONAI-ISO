import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { config } from "../config.js";

export const isoStages = ["PWI", "NP", "WD", "CD", "DIS", "FDIS", "Publish"];

const stageRules = [
  { stage: "Publish", weight: 7, terms: ["publication", "published", "publish", "final publication", "standard is available"] },
  { stage: "FDIS", weight: 6, terms: ["fdis", "final draft international standard", "final draft ballot"] },
  { stage: "DIS", weight: 5, terms: ["dis", "draft international standard", "enquiry", "enquiry ballot"] },
  { stage: "CD", weight: 4, terms: ["committee draft", "committee stage", "cd ballot", "cd consultation"] },
  { stage: "WD", weight: 3, terms: ["working draft", "working group draft", "wd", "editor draft"] },
  { stage: "NP", weight: 2, terms: ["new work item proposal", "new proposal", "np ballot", "np accepted", "nwi proposal"] },
  { stage: "PWI", weight: 1, terms: ["preliminary work item", "pwi", "plenary", "project idea", "study period"] }
];

const eventRules = [
  { eventType: "vote", terms: ["vote", "ballot", "voting result", "result of voting"] },
  { eventType: "circulation", terms: ["circulation", "circulated", "comment period", "consultation"] },
  { eventType: "plenary", terms: ["plenary", "general assembly", "\ucd1d\ud68c"] },
  { eventType: "meeting", terms: ["meeting", "minutes", "agenda", "\ud68c\uc758"] },
  { eventType: "decision", terms: ["decision", "resolution", "resolved", "decided", "accepted"] },
  { eventType: "presentation", terms: ["presentation", "presented", "slide", "\ubc1c\ud45c"] },
  { eventType: "regulation", terms: ["regulation", "directive", "procedure"] },
  { eventType: "reference", terms: ["reference", "bibliography", "source", "\ucc38\uace0"] }
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
  "\uc644\ub8cc",
  "\ud655\uc815",
  "\uc81c\ucd9c",
  "\ud68c\ub78c"
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
  "\ud574\uc57c",
  "\ud544\uc694",
  "\ub2e4\uc74c",
  "\uac80\ud1a0",
  "\uc900\ube44"
];

const riskTerms = [
  "risk",
  "delay",
  "blocked",
  "missing",
  "unresolved",
  "conflict",
  "comment",
  "objection",
  "late",
  "\uc704\ud5d8",
  "\uc9c0\uc5f0",
  "\ubbf8\ud574\uacb0",
  "\ub204\ub77d",
  "\uc774\uc288"
];

const scheduleTerms = ["date", "deadline", "meeting", "plenary", "ballot", "circulation", "agenda", "\uc77c\uc815", "\ud68c\uc758", "\ucd1d\ud68c"];
const referenceTerms = ["reference", "bibliography", "directive", "source", "iec", "iso", "jtc", "\ucc38\uace0", "\uadfc\uac70"];

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
    .slice(0, 160);
}

function classifyEvent(text) {
  const matches = scoreRules(text, eventRules);
  return matches.sort((a, b) => b.score - a.score)[0]?.eventType || "reference";
}

function sentenceMatches(sentence, terms) {
  const lower = sentence.toLowerCase();
  return terms.some((term) => termMatches(lower, term));
}

function extractDates(text) {
  const matches = normalizeText(text).match(/\b20\d{2}[-/.](0?[1-9]|1[0-2])[-/.](0?[1-9]|[12]\d|3[01])\b/g) || [];
  return [...new Set(matches)].slice(0, 10);
}

function buildDocumentSignals(sentences) {
  return {
    actions: sentences.filter((sentence) => sentenceMatches(sentence, todoTerms)).slice(0, 8),
    risks: sentences.filter((sentence) => sentenceMatches(sentence, riskTerms)).slice(0, 8),
    schedule: sentences.filter((sentence) => sentenceMatches(sentence, scheduleTerms)).slice(0, 8),
    references: sentences.filter((sentence) => sentenceMatches(sentence, referenceTerms)).slice(0, 8)
  };
}

export function chunkNDocument(input = {}) {
  const fileName = String(input.fileName || "untitled-n-document.txt");
  const contentText = String(input.contentText || "");
  const sentences = splitSentences(contentText);
  const chunks = [];
  for (let index = 0; index < sentences.length; index += 4) {
    const text = sentences.slice(index, index + 4).join(" ");
    if (!text) continue;
    chunks.push({
      id: crypto.createHash("sha256").update(`${fileName}:${index}:${text}`).digest("hex").slice(0, 16),
      fileName,
      text,
      keywords: extractKeywords(text),
      stageHints: scoreRules(`${fileName}\n${text}`, stageRules).map((match) => match.stage),
      eventHints: scoreRules(`${fileName}\n${text}`, eventRules).map((match) => match.eventType)
    });
  }
  return chunks;
}

function extractKeywords(text) {
  const words = normalizeText(text).toLowerCase().match(/[a-z0-9][a-z0-9_-]{2,}|[\uac00-\ud7a3]{2,}/g) || [];
  const ignored = new Set(["the", "and", "for", "with", "that", "this", "from", "shall", "should", "will"]);
  const counts = new Map();
  for (const word of words) {
    if (ignored.has(word)) continue;
    counts.set(word, (counts.get(word) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([word]) => word);
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
  const signals = buildDocumentSignals(sentences);
  const contentPreview = normalizeText(contentText).slice(0, 2400) || "Original preview is unavailable for this file type.";
  const id = crypto.createHash("sha256").update(`${fileName}\n${contentText}\n${Date.now()}`).digest("hex").slice(0, 16);

  return {
    id: `n-doc-${id}`,
    fileName,
    uploadedAt: new Date().toISOString(),
    eventType: classifyEvent(combinedText),
    stage: detectedStage,
    confidence,
    summary: `${classifyEvent(combinedText)} evidence mapped to ${detectedStage} with ${confidence} confidence.`,
    contentPreview,
    done: sentences.filter((sentence) => sentenceMatches(sentence, doneTerms)).slice(0, 5),
    todo: signals.actions.length > 0 ? signals.actions : [`Confirm the next ${detectedStage} action with meeting, circulation or ballot evidence.`],
    risks: signals.risks,
    scheduleSignals: signals.schedule,
    referenceSignals: signals.references,
    dates: extractDates(contentText),
    chunks: chunkNDocument({ fileName, contentText }).slice(0, 20),
    matchedTerms: stageMatches.slice(0, 4).map((match) => ({
      stage: match.stage,
      terms: match.matchedTerms
    }))
  };
}

export function buildKnowledgeIndex(input = {}) {
  const documents = Array.isArray(input.nDocuments) ? input.nDocuments : [];
  const chunks = documents.flatMap((documentRecord) => {
    if (Array.isArray(documentRecord.chunks) && documentRecord.chunks.length > 0) {
      return documentRecord.chunks.map((chunk) => ({ ...chunk, documentId: documentRecord.id, stage: documentRecord.stage, eventType: documentRecord.eventType }));
    }
    return chunkNDocument({
      fileName: documentRecord.fileName,
      contentText: documentRecord.contentPreview || documentRecord.summary || ""
    }).map((chunk) => ({ ...chunk, documentId: documentRecord.id, stage: documentRecord.stage, eventType: documentRecord.eventType }));
  });
  const keywords = extractKeywords(chunks.map((chunk) => chunk.text).join(" "));
  return {
    documentCount: documents.length,
    chunkCount: chunks.length,
    keywords,
    chunks: chunks.slice(0, 80),
    sourceMap: documents.map((documentRecord) => ({
      id: documentRecord.id,
      fileName: documentRecord.fileName,
      stage: documentRecord.stage,
      eventType: documentRecord.eventType,
      summary: documentRecord.summary
    }))
  };
}

export function queryKnowledgeIndex(input = {}) {
  const query = normalizeText(input.query || "");
  const index = input.index?.chunks ? input.index : buildKnowledgeIndex(input);
  const queryKeywords = extractKeywords(query);
  const results = (index.chunks || []).map((chunk) => {
    const text = `${chunk.fileName} ${chunk.text}`.toLowerCase();
    const score = queryKeywords.reduce((total, keyword) => total + (text.includes(keyword.toLowerCase()) ? 1 : 0), 0);
    return { ...chunk, score };
  }).filter((chunk) => chunk.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
  return {
    query,
    queryKeywords,
    results,
    answerBasis: results.map((result) => ({
      fileName: result.fileName,
      stage: result.stage,
      eventType: result.eventType,
      excerpt: result.text.slice(0, 360)
    }))
  };
}

export function buildProjectControlSnapshot(input = {}) {
  const documents = Array.isArray(input.nDocuments) ? input.nDocuments : [];
  const stageAssessment = buildStageAssessment({
    currentStage: input.currentStage,
    nDocuments: documents
  });
  const enrichedDocuments = documents.map((documentRecord) => {
    if (documentRecord.todo || documentRecord.risks || documentRecord.scheduleSignals || documentRecord.referenceSignals) return documentRecord;
    const analysis = analyzeNDocument({
      fileName: documentRecord.fileName,
      contentText: documentRecord.contentPreview || documentRecord.summary || "",
      fallbackStage: documentRecord.stage || input.currentStage || "PWI"
    });
    return { ...documentRecord, ...analysis, id: documentRecord.id || analysis.id };
  });
  const allActions = enrichedDocuments.flatMap((documentRecord) => documentRecord.todo || []).slice(0, 12);
  const allRisks = enrichedDocuments.flatMap((documentRecord) => documentRecord.risks || []).slice(0, 12);
  const allSchedule = enrichedDocuments.flatMap((documentRecord) => documentRecord.scheduleSignals || []).slice(0, 12);
  const allReferences = enrichedDocuments.flatMap((documentRecord) => documentRecord.referenceSignals || []).slice(0, 12);
  const allDates = [...new Set(enrichedDocuments.flatMap((documentRecord) => documentRecord.dates || []))].slice(0, 12);

  return {
    stageAssessment,
    actionItems: allActions.length > 0 ? allActions : stageAssessment.nextActions,
    risks: allRisks,
    scheduleSignals: allSchedule,
    referenceSignals: allReferences,
    dates: allDates,
    commanderBrief: [
      `Current stage: ${stageAssessment.currentStage} (${stageAssessment.progress}%).`,
      `${documents.length} N-document source(s), ${Object.values(stageAssessment.stageEvidence).reduce((sum, count) => sum + count, 0)} stage marker(s).`,
      allRisks.length > 0 ? `Risk focus: ${allRisks[0]}` : "Risk focus: no explicit risk sentence has been extracted yet.",
      allActions.length > 0 ? `Next action: ${allActions[0]}` : `Next action: ${stageAssessment.nextActions[0]}`
    ]
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
  const evidenceBonus = Math.min(10, documents.length * 2);
  const progress = Math.min(99, Math.round(((stageIndex + 1) / isoStages.length) * 100) + evidenceBonus);

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
