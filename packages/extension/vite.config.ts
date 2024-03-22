import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import MonacoEditorPlugin from "vite-plugin-monaco-editor";
import path from "path";
import copy from "rollup-plugin-copy";
import typescript from "@rollup/plugin-typescript";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    typescript(),

    vanillaExtractPlugin(),
    (MonacoEditorPlugin as any).default({}),
    react(),
    copy({
      targets: [{ src: "public/*", dest: "dist" }],
      hook: "writeBundle",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "js",
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, "src/entries/popup.tsx"),
        options: path.resolve(__dirname, "src/entries/options.tsx"),
        background: path.resolve(__dirname, "src/entries/background.ts"),
        content_script: path.resolve(
          __dirname,
          "src/entries/content_script.ts"
        ),
        devtools_page: path.resolve(__dirname, "src/entries/devtools_page.ts"),
        panel: path.resolve(__dirname, "src/entries/panel.tsx"),
      },
      output: {
        entryFileNames: `js/[name].js`,
        chunkFileNames: `js/[name].js`,
        assetFileNames: `js/[name].[ext]`,
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
});
