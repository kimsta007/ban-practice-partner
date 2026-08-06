import { defineConfig } from "vite"
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"

// GitHub Pages serves this repo at /ban-practice-partner/. Set BASE_PATH to
// deploy a build into a subfolder instead, e.g.
// BASE_PATH=/ban-practice-partner/v2/ npm run build
export default defineConfig(({ command }) => ({
  base: command === "build" ? (process.env.BASE_PATH ?? "/ban-practice-partner/") : "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}))
