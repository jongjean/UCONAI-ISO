import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/iso/",
  server: {
    port: 5174,
    host: "127.0.0.1",
    proxy: {
      "/iso/api": {
        target: "http://127.0.0.1:4510",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/iso\/api/, "/api")
      },
      "/iso/health": {
        target: "http://127.0.0.1:4510",
        changeOrigin: true,
        rewrite: () => "/health"
      }
    }
  }
});
