import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  base: "/ddw-theme-creator/",
  plugins: [react()],
  resolve: {
    alias: {
      fs: "/dev/null",
    },
  },
});
