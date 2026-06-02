#!/usr/bin/env node
/**
 * Sync the Riibon design-system surface FROM the canonical source
 * (riibon-ai/src) INTO this package's src/ + tokens.css.
 *
 * The app (riibon-ai) remains the single source of truth. This package is
 * a generated, versioned snapshot of a defined manifest of files. Run this
 * whenever the app's design system changes, then bump the version and tag a
 * release; consumers (e.g. riibon-web) pin a tag.
 *
 * Usage:
 *   node scripts/sync-from-app.mjs [path-to-riibon-ai]
 *   (defaults to ../riibon-ai)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG = path.resolve(__dirname, "..");
const APP = path.resolve(process.argv[2] || path.join(PKG, "..", "riibon-ai"));
const APP_SRC = path.join(APP, "src");

if (!fs.existsSync(APP_SRC)) {
  console.error(`riibon-ai src not found at ${APP_SRC}. Pass the path: node scripts/sync-from-app.mjs /path/to/riibon-ai`);
  process.exit(1);
}

/** Files copied verbatim (with @/ -> relative rewrite) from app src. */
const MANIFEST = [
  "lib/utils.ts",
  "components/icons/Icon.tsx",
  "components/icons/RiibonWordmark.tsx",
  "components/ui/button.tsx",
  "components/layout/index.ts",
  "components/layout/Stack.tsx",
  "components/layout/Cluster.tsx",
  "components/layout/Grid.tsx",
  "components/layout/Container.tsx",
  "components/layout/Spacer.tsx",
  "components/layout/Divider.tsx",
];

/** Rewrite the app's `@/` alias to a path relative to the file's location.
 *  `@/` maps to src root in the app and to this package's src root here, so
 *  the relative target is computed from the file's depth under src/. */
function rewriteAliases(code, relFilePath) {
  const fromDir = path.dirname(path.join("src", relFilePath));
  return code.replace(/(["'])@\/([^"']+)\1/g, (_m, q, sub) => {
    let rel = path.relative(fromDir, path.join("src", sub));
    if (!rel.startsWith(".")) rel = "./" + rel;
    return `${q}${rel}${q}`;
  });
}

let copied = 0;
for (const rel of MANIFEST) {
  const srcFile = path.join(APP_SRC, rel);
  const destFile = path.join(PKG, "src", rel);
  fs.mkdirSync(path.dirname(destFile), { recursive: true });
  const code = rewriteAliases(fs.readFileSync(srcFile, "utf8"), rel);
  fs.writeFileSync(destFile, code);
  copied++;
}

/** tokens.css = app src/index.css minus the app-only react-grid-layout import. */
const tokens = fs
  .readFileSync(path.join(APP_SRC, "index.css"), "utf8")
  .split("\n")
  .filter((l) => !l.includes("react-grid-layout/css/styles.css"))
  .join("\n");
fs.writeFileSync(path.join(PKG, "tokens.css"), tokens);

console.log(`Synced ${copied} files + tokens.css from ${APP_SRC}`);
console.log("Next: npm run build && bump version && git tag");
