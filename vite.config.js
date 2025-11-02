import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // __dirname is not defined in ESM mode (package.json: "type": "module").
      // Use process.cwd() which works reliably in Vite config.
      "@": path.resolve(process.cwd(), "src"),
    },
  },
});