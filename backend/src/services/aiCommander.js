import { config } from "../config.js";
import { ApiError } from "../http/errors.js";

const hasKorean = (value = "") => [...String(value)].some((character) => {
  const code = character.charCodeAt(0);
  return (
    (code >= 0xac00 && code <= 0xd7a3) ||
    (code >= 0x3131 && code <= 0x318e) ||
    (code >= 0x1100 && code <= 0x11ff)
  );
});

function compactContext(context = {}) {
  const nDocuments = Array.isArray(context.nDocuments) ? context.nDocuments.slice(-5) : [];
  return {
    currentStage: context.currentStage || "PWI",
    detectedStage: context.regulationAnalysis?.detectedStage || "unknown",
    regulationSummary: context.regulationAnalysis?.summary || "",
    projectTitle: context.standardSetup?.projectTitle || "",
    standardTitle: context.standardSetup?.standardTitle || "",
    committeeName: context.standardSetup?.committeeName || "",
    evidenceMemo: context.standardSetup?.evidenceMemo || "",
    nDocuments: nDocuments.map((documentRecord) => ({
      fileName: documentRecord.fileName,
      eventType: documentRecord.eventType,
      stage: documentRecord.stage,
      summary: documentRecord.summary
    }))
  };
}

export async function runAiCommander({ prompt = "", messages = [], context = {} } = {}) {
  const trimmedPrompt = String(prompt || "").trim();
  if (!trimmedPrompt) {
    throw new ApiError(400, "INVALID_AI_PROMPT", "AI Commander prompt is required.");
  }

  if (config.ai.defaultProvider !== "ollama") {
    throw new ApiError(503, "AI_PROVIDER_NOT_CONFIGURED", "AI Commander currently expects the Ollama provider.");
  }

  const languageInstruction = hasKorean(trimmedPrompt)
    ? "Answer in Korean. Keep ISO stage names such as PWI, NP, WD, CD, DIS, FDIS and Publish in English."
    : "Answer in English unless the user asks otherwise.";
  const systemPrompt = [
    "You are UCONAI ISO AI Commander, a supervisor agent for ISO/IEC standard development.",
    "Give concrete product guidance tied to the current screen and project state.",
    "Do not repeat a generic template. Answer the user's actual question first.",
    "When mentioning source uploads, point to Start Wizard > N-document event registry > Upload N-documents.",
    languageInstruction
  ].join(" ");
  const recentMessages = Array.isArray(messages)
    ? messages.slice(-8).map((message) => ({
      role: message.speaker === "user" ? "user" : "assistant",
      content: String(message.text || "")
    }))
    : [];

  const response = await fetch(`${config.ai.ollamaBaseUrl.replace(/\/$/, "")}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model: config.ai.ollamaModel,
      stream: false,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "system", content: `Current workspace context: ${JSON.stringify(compactContext(context))}` },
        ...recentMessages,
        { role: "user", content: trimmedPrompt }
      ],
      options: {
        temperature: 0.25,
        num_ctx: 4096
      }
    })
  }).catch((error) => {
    throw new ApiError(503, "AI_ENGINE_UNREACHABLE", "AI Commander could not reach the configured Ollama engine.", {
      provider: "ollama",
      baseUrl: config.ai.ollamaBaseUrl,
      cause: error.message
    });
  });

  if (!response.ok) {
    throw new ApiError(503, "AI_ENGINE_ERROR", "AI Commander engine returned an error.", {
      provider: "ollama",
      status: response.status
    });
  }

  const payload = await response.json();
  const text = payload?.message?.content || payload?.response || "";
  if (!text.trim()) {
    throw new ApiError(502, "AI_EMPTY_RESPONSE", "AI Commander engine returned an empty response.");
  }

  return {
    provider: "ollama",
    model: config.ai.ollamaModel,
    text: text.trim()
  };
}
