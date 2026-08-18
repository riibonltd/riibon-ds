#!/usr/bin/env node
/**
 * Sync the Riibon design system FROM the monorepo INTO this package.
 *
 * Canonical source is the monorepo (riibon-ai). This package is a
 * distributable MIRROR of `packages/ui` (the @riibon/ui workspace package),
 * plus the design-token CSS and the Tailwind preset, so repos OUTSIDE the
 * monorepo (e.g. riibon-web) can consume the design system as a git
 * dependency. Run this whenever the monorepo's design system changes, then
 * bump the version and tag a release; consumers pin a tag.
 *
 *   src/          ← verbatim copy of riibon-ai/packages/ui/src  (same layout,
 *                   so internal relative imports just work — no rewriting)
 *   tokens.css    ← riibon-ai/src/index.css  (minus the app-only
 *                   react-grid-layout import)
 *   tailwind-preset.cjs ← riibon-ai/tailwind.config.ts  (imports→require,
 *                   `content` dropped so the consumer controls scanning)
 *
 * Usage:
 *   node scripts/sync-from-app.mjs [path-to-riibon-ai]   (default ../riibon-ai)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import ts from "typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG = path.resolve(__dirname, "..");
const APP = path.resolve(process.argv[2] || path.join(PKG, "..", "riibon-ai"));

const UI_SRC = path.join(APP, "packages", "ui", "src");
const APP_INDEX_CSS = path.join(APP, "src", "index.css");
const APP_TW = path.join(APP, "tailwind.config.ts");

for (const [label, p] of [["packages/ui/src", UI_SRC], ["src/index.css", APP_INDEX_CSS], ["tailwind.config.ts", APP_TW]]) {
  if (!fs.existsSync(p)) {
    console.error(`Missing ${label} at ${p}. Pass the riibon-ai path: node scripts/sync-from-app.mjs /path/to/riibon-ai`);
    process.exit(1);
  }
}

// 1) src/ — verbatim mirror of packages/ui/src (layout identical → imports just work)
fs.rmSync(path.join(PKG, "src"), { recursive: true, force: true });
fs.cpSync(UI_SRC, path.join(PKG, "src"), { recursive: true });

// 2) tokens.css — app index.css minus the app-only react-grid-layout import
const tokens = fs
  .readFileSync(APP_INDEX_CSS, "utf8")
  .split("\n")
  .filter((l) => !l.includes("react-grid-layout/css/styles.css"))
  .join("\n");
fs.writeFileSync(path.join(PKG, "tokens.css"), tokens);

// 3) tailwind-preset.cjs — the app's tailwind config as a CJS preset
//
// TYPE STRIPPING IS DONE BY THE TYPESCRIPT COMPILER, NOT BY REGEX.
//
// This step used to be a chain of six `.replace()` calls, which is a
// hand-rolled partial TypeScript compiler: it knew about exactly three TS
// constructs (`import type`, `satisfies Config`, and the two named imports)
// and passed everything else through verbatim. That held for as long as the
// config contained nothing else — and broke the first time it did. On
// 2026-08-18 the config gained a one-line helper:
//
//     const rbVar = (name: string) => `color-mix(…)`;
//
// The regexes did not touch it, so the emitted `.cjs` carried a TypeScript
// annotation and threw `SyntaxError: Unexpected token ':'` on require. Nothing
// here would have noticed: the sync printed "Synced", the build passed (it
// compiles `src/`, not the preset), the version bumped, the tag pushed, and
// the consumer's Tailwind build would have been the first thing to find out.
//
// `ts.transpileModule` removes every type construct correctly, by definition.
// Module form stays ESNext so the export SHAPE is untouched — the two
// import→require rewrites and `export default` → `module.exports` below are
// still done here on purpose, because emitting real CommonJS would produce
// `exports.default = {…}` and change what a consumer's `require` returns.
let preset = ts.transpileModule(fs.readFileSync(APP_TW, "utf8"), {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    removeComments: false,
  },
}).outputText;
preset = preset
  .replace(/import tailwindcssAnimate from "tailwindcss-animate";/, 'const tailwindcssAnimate = require("tailwindcss-animate");')
  .replace(/import containerQueries from "@tailwindcss\/container-queries";/, 'const containerQueries = require("@tailwindcss/container-queries");')
  .replace(/export default \{/, "module.exports = {")
  .replace(/^\s*content: \[[^\]]*\],\n/m, ""); // preset must not force consumer content globs

/* And then it is PARSED, because the whole failure above was a file that was
   written successfully and could not be loaded. A generated artifact nobody
   executes is a guess. */
const presetPath = path.join(PKG, "tailwind-preset.cjs");
fs.writeFileSync(presetPath, preset);
try {
  const loaded = createRequire(import.meta.url)(presetPath);
  if (!loaded || typeof loaded !== "object" || !loaded.theme) {
    throw new Error("preset loaded but has no `theme` — the export shape changed.");
  }
  if (loaded.content) {
    throw new Error("preset still carries `content` — it must not force the consumer's globs.");
  }
} catch (error) {
  console.error(`✗ the generated tailwind-preset.cjs does not load:\n  ${error.message}`);
  console.error("  Nothing downstream can detect this — the consumer's build is the first thing that would.");
  process.exit(1);
}

console.log("Synced src/ (from packages/ui), tokens.css, tailwind-preset.cjs");
console.log("Next: npm run build && bump version && git tag vX.Y.Z && git push --tags && git push");
