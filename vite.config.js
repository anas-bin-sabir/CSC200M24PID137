import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        // Keep the card artwork in its own chunk so it is cached separately
        // from the app code and only downloaded when a game starts.
        manualChunks(id) {
          if (id.includes("@letele/playing-cards")) return "playing-cards";
        },
      },
    },
  },
});
