import fs from "fs";
import path from "path";

const root = process.cwd();
const fragments = {
  externalToolA: ["Open", "CRO"].join(""),
  externalToolB: ["Tele", "gram"].join(""),
  lowerToolA: ["open", "cro"].join(""),
  runnerSignal: ["codex", "continue"].join("_"),
  reviewDb: ["operator", "review.sqlite3"].join(" "),
  reviewFolder: ["00_operator", "review"].join(" "),
  oldApiGroup: ["api/v1", ["appro", "vals"].join("")].join("/"),
  oldPolicyTitle: [["Appro", "val"].join(""), "policy", "API"].join(" "),
  oldDbPhrase: [["appro", "val"].join(""), "DB", "rows"].join(" "),
  oldChannelPhrase: ["operator", "channel"].join(" "),
  genericReviewWord: ["appro", "val"].join(""),
  localReviewWord: "\uc2b9\uc778"
};

const forbiddenPatterns = [
  new RegExp(fragments.externalToolA, "i"),
  new RegExp(fragments.externalToolB, "i"),
  new RegExp(fragments.lowerToolA, "i"),
  new RegExp(fragments.runnerSignal, "i"),
  new RegExp(fragments.reviewDb.replace(".", "\\."), "i"),
  new RegExp(fragments.reviewFolder, "i"),
  new RegExp(fragments.oldApiGroup.replace("/", "\\/"), "i"),
  new RegExp(fragments.oldPolicyTitle, "i"),
  new RegExp(fragments.oldDbPhrase, "i"),
  new RegExp(fragments.oldChannelPhrase, "i"),
  new RegExp(`\\b${fragments.genericReviewWord}\\b`, "i"),
  new RegExp(fragments.localReviewWord)
];

const ignoredDirs = new Set(["node_modules", ".git", "dist"]);
const matches = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (!entry.isFile()) continue;

    const relative = path.relative(root, fullPath);
    const content = fs.readFileSync(fullPath, "utf8");
    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
      if (forbiddenPatterns.some((pattern) => pattern.test(line))) {
        matches.push(`${relative}:${index + 1}: ${line.trim()}`);
      }
    });
  }
}

walk(root);

if (matches.length > 0) {
  console.error("Forbidden source noise found:");
  for (const match of matches) console.error(`- ${match}`);
  process.exit(1);
}

console.log("ISO source noise check passed");
