import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import simpleImportSort from "eslint-plugin-simple-import-sort";

/**
 * ESLint configuration for SaaS Psi
 * Stack: Next.js + TypeScript
 */
const eslintConfig = defineConfig([
  // Next.js core vitals rules
  ...nextVitals,

  // Next.js + TypeScript rules
  ...nextTs,

  // Global ignores (override next defaults)
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "node_modules/**",
    "next-env.d.ts",
  ]),

  // Custom project rules
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },

    rules: {
      // Import sorting
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // Optional quality rules (boas práticas)
      "no-unused-vars": "off", // handled by TS
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
]);

export default eslintConfig;
