import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") }
  },
  server: { host: true, port: 5173, strictPort: true },
  preview: { port: 5173, strictPort: true },
  envPrefix: "VITE_",
  optimizeDeps: { include: ["styled-components"] }
});
