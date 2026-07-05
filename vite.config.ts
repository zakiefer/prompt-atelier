import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? "/prompt-atelier/" : "/",
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) return "react";
          if (id.includes("node_modules/lucide-react")) return "icons";
          if (id.includes("/src/promptEngine.ts")) return "prompt-engine";
          if (id.includes("/src/productEvolution.ts")) return "product-evolution";
          if (id.includes("/src/learnerProduct.ts")) return "learner-product";
          if (id.includes("/src/LearnerExperience.tsx")) return "learner-experience";
          if (id.includes("/src/AppChrome.tsx")) return "app-chrome";
          if (id.includes("/src/prompts/") || id.includes("/src/seedPrompts.ts")) return "prompt-corpus";
          if (id.includes("/src/promptApi.ts") || id.includes("/src/promptDb.ts")) return "prompt-storage";
          return undefined;
        },
      },
    },
  },
  plugins: [react()],
});
