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
let preset = fs.readFileSync(APP_TW, "utf8");
preset = preset
  .replace(/^import type \{ Config \} from "tailwindcss";\n/m, "")
  .replace(/import tailwindcssAnimate from "tailwindcss-animate";/, 'const tailwindcssAnimate = require("tailwindcss-animate");')
  .replace(/import containerQueries from "@tailwindcss\/container-queries";/, 'const containerQueries = require("@tailwindcss/container-queries");')
  .replace(/export default \{/, "module.exports = {")
  .replace(/\} satisfies Config;/, "};")
  .replace(/^\s*content: \[[^\]]*\],\n/m, ""); // preset must not force consumer content globs
fs.writeFileSync(path.join(PKG, "tailwind-preset.cjs"), preset);

console.log("Synced src/ (from packages/ui), tokens.css, tailwind-preset.cjs");
console.log("Next: npm run build && bump version && git tag vX.Y.Z && git push --tags && git push");
