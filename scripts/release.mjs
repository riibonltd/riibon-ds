#!/usr/bin/env node
/**
 * One-command release: sync the design system from the monorepo, rebuild,
 * and (if anything changed) bump + commit + tag + push.
 *
 * Replaces the manual sync → build → bump → commit → tag → push sequence.
 * Run this from the riibon-ds repo after the monorepo's design system
 * changes. Uses your existing local git auth (no token/secret needed).
 *
 * Usage:
 *   npm run release                    # patch bump, monorepo at ../riibon-ai
 *   npm run release -- --minor         # minor bump
 *   npm run release -- /path/to/riibon-ai --major
 */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG = path.resolve(__dirname, "..");
const run = (cmd, opts = {}) => execSync(cmd, { cwd: PKG, stdio: "pipe", encoding: "utf8", ...opts });

// --- parse args: first non-flag = riibon-ai path; flag = bump type ---
const args = process.argv.slice(2);
let appPath = null;
let bump = "patch";
for (const a of args) {
  if (a === "--major" || a === "--minor" || a === "--patch") bump = a.slice(2);
  else if (!a.startsWith("--")) appPath = a;
}
appPath = path.resolve(appPath || path.join(PKG, "..", "riibon-ai"));

console.log(`▶ Releasing @riibon/ds  (source: ${appPath}, bump: ${bump})`);

// --- guard: clean working tree before we start ---
if (run("git status --porcelain").trim()) {
  console.error("✗ riibon-ds has uncommitted changes. Commit or stash first.");
  process.exit(1);
}

// --- 1) sync from the monorepo, 2) rebuild ---
console.log("• sync from monorepo…");
run(`node scripts/sync-from-app.mjs "${appPath}"`, { stdio: "inherit" });
console.log("• build dist…");
run("npm run build", { stdio: "inherit" });

// --- 3) anything actually change? ---
if (!run("git status --porcelain").trim()) {
  console.log("✓ No design-system changes — nothing to publish.");
  process.exit(0);
}

// --- 4) bump version ---
const pkgPath = path.join(PKG, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const [maj, min, pat] = pkg.version.split(".").map(Number);
const next = bump === "major" ? `${maj + 1}.0.0` : bump === "minor" ? `${maj}.${min + 1}.0` : `${maj}.${min}.${pat + 1}`;
pkg.version = next;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log(`• version → ${next}`);

// --- 5) commit, tag, push ---
run("git add -A");
run(`git commit -m "release: v${next} — sync from monorepo design system"`);
run(`git tag v${next}`);
// Push to an explicit branch so this works both locally (on `main`) and in
// CI (where the checkout may be in detached-HEAD state).
const branch = run("git rev-parse --abbrev-ref HEAD").trim();
const target = branch === "HEAD" ? "main" : branch;
run(`git push origin HEAD:${target}`);
run(`git push origin v${next}`);

console.log(`\n✓ Published @riibon/ds v${next}`);
console.log(`  Bump the consumer pin: "@riibon/ds": "github:riibonltd/riibon-ds#v${next}"`);
