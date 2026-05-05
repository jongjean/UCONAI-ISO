import { createApp } from "./app.js";
import { config } from "./config.js";

export function startServer() {
  const app = createApp();
  return app.listen(config.port, config.host, () => {
    console.log(`[iso-api] listening on ${config.host}:${config.port}`);
  });
}

if (process.env.ISO_DISABLE_LISTEN !== "1") {
  startServer();
}
