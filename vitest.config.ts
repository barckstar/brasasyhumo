import { defineConfig } from "vitest/config";

export default defineConfig({
  // Vite resuelve los paths de tsconfig de forma nativa; no hace falta plugin.
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
