import dotenv from "dotenv";

dotenv.config();

const numberFromEnv = (key, fallback) => {
  const raw = process.env[key];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const config = {
  env: process.env.NODE_ENV || "development",
  host: process.env.ISO_API_HOST || "127.0.0.1",
  port: numberFromEnv("ISO_API_PORT", 4510),
  publicBasePath: process.env.ISO_PUBLIC_BASE_PATH || "/iso/",
  dataRoot: process.env.ISO_DATA_ROOT || "/uconai/data/iso",
  storageRoot: process.env.ISO_STORAGE_ROOT || "/uconai/data/iso/storage",
  logDir: process.env.ISO_LOG_DIR || "/uconai/data/iso/logs",
  ai: {
    defaultProvider: process.env.ISO_AI_DEFAULT_PROVIDER || "ollama",
    ollamaBaseUrl: process.env.ISO_OLLAMA_BASE_URL || "http://127.0.0.1:11434",
    ollamaModel: process.env.ISO_OLLAMA_MODEL || "llama3.1"
  }
};

export const hpPolicy = {
  sourceRoot: "/uconai/projects/iso",
  deployRoot: "/uconai/www/iso",
  dataRoot: "/uconai/data/iso",
  storageRoot: "/uconai/data/iso/storage",
  logDir: "/uconai/data/iso/logs",
  apiHost: "127.0.0.1",
  apiPort: 4510,
  protectedOperations: [
    "db-create",
    "db-migrate",
    "caddy-change",
    "caddy-reload",
    "service-start",
    "service-restart",
    "deploy",
    "paid-ai-provider",
    "legacy-data-migration"
  ]
};

