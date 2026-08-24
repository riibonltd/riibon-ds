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

/**
 * --- guard: the SOURCE is actually what's on main ---
 *
 * `appPath` defaults to ../riibon-ai and was previously trusted blind. That
 * checkout is a normal working copy: it can sit on an old commit, on another
 * branch, or carry half-finished edits. Syncing from it regardless is how you
 * publish a release that silently OMITS the change you just merged — the
 * mirror looks updated, the version bumps, external consumers pin the new tag,
 * and the fix simply isn't in it. Nothing downstream can detect that.
 *
 * Checked per PUBLISHED path rather than over the whole repo, because the
 * monorepo nearly always has unrelated work in flight and blocking on that
 * would just train people to reach for --force-source.
 */
const SYNCED_PATHS = ["packages/ui/src", "src/index.css", "tailwind.config.ts"];
const forceSource = args.includes("--force-source");

const inApp = (cmd) => run(cmd, { cwd: appPath });

if (!fs.existsSync(path.join(appPath, ".git"))) {
  console.error(`✗ ${appPath} is not a git checkout — cannot verify what would be published.`);
  process.exit(1);
}

// Refresh origin/main first: comparing against a stale remote ref would let a
// months-old checkout pass as "matches main".
try {
  inApp("git fetch origin main --quiet");
} catch {
  console.warn("⚠ could not fetch origin/main in the source repo — comparing against the local ref.");
}

const drifted = SYNCED_PATHS.filter((p) => {
  try {
    inApp(`git diff --quiet origin/main -- "${p}"`);
    return false;
  } catch {
    return true; // non-zero exit = differs from origin/main
  }
});

if (drifted.length) {
  const label = forceSource ? "⚠" : "✗";
  console.error(
    `${label} Source is not at origin/main for the paths this release publishes:\n` +
      drifted.map((p) => `    ${p}`).join("\n") +
      `\n  source: ${appPath}\n` +
      `  Either it is behind origin/main, or it has uncommitted edits to these paths.\n` +
      `  Pull/merge it (or pass a checkout that is up to date), then re-run.\n` +
      `  To publish from this source anyway: --force-source`,
  );
  if (!forceSource) process.exit(1);
  console.warn("  … continuing because --force-source was passed.");
} else {
  console.log(`✓ source matches origin/main for all ${SYNCED_PATHS.length} published paths`);
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

/**
 * The lockfile stamps the version TWICE and this script used to bump neither.
 *
 * `package-lock.json` still read `1.0.0` at v3.5.0 — it had been wrong since
 * the first release, and stayed invisible because nothing here reads it and
 * nobody had run `npm install` in this repo in between. The first person who
 * did got a dirty tree from a command that installs nothing, and this script's
 * clean-tree guard then refused to release. A stale stamp that only surfaces
 * as an unrelated failure, on a machine that has never built the package
 * before, is the worst kind: it fires for the person with the least context.
 *
 * It does not affect resolution — the fields are informational — so this is
 * not a correctness fix. It is the two-places-one-fact rule: the version lives
 * in package.json, and everything else derives.
 */
const lockPath = path.join(PKG, "package-lock.json");
if (fs.existsSync(lockPath)) {
  const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
  lock.version = next;
  if (lock.packages?.[""]) lock.packages[""].version = next;
  fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2) + "\n");
}

console.log(`• version → ${next}`);

// --- 5) commit, tag, push ---
run("git add -A");
run(`git commit -m "release: v${next} — sync from monorepo design system"`);
run(`git tag v${next}`);
// Push to an explicit branch so this works both locally (on `main`) and in
// CI (where the checkout may be in detached-HEAD state).
const branch = run("git rev-parse --abbrev-ref HEAD").trim();
const target = branch === "HEAD" ? "main" : branch;

/**
 * THE COMMIT AND THE TAG GO IN ONE ATOMIC PUSH.
 *
 * They used to be two, and on 2026-08-24 the remote held release commits for
 * v3.4.0 and v3.5.0 with **no tags for either** — newest tag v3.3.0, two
 * releases behind the code beside it. A tag is not decoration here: external
 * consumers pin `github:riibonltd/riibon-ds#vX.Y.Z`, and riibon-ai's
 * `check:ds-staleness` compares the monorepo against the LATEST TAG. So a
 * commit that lands without its tag publishes nothing anyone can reach, and
 * the staleness gate then warns on every push about a drift no release can
 * clear. It cried wolf for two releases and was believed the third time only
 * because someone went looking.
 *
 * Two pushes cannot be made safe by ordering — either order leaves a window
 * where one lands and the other does not. `--atomic` makes the server take
 * both refs or neither, so a failure leaves the repo re-runnable rather than
 * half-published.
 */
run(`git push --atomic origin HEAD:${target} v${next}`);

/* And verify, because "the command exited 0" is not the same claim as "the
   tag is on the remote" — a push can succeed against a ref the server then
   rejects by policy, and this script's whole output is a promise that a
   consumer can pin what it just printed. */
const onRemote = run(`git ls-remote --tags origin refs/tags/v${next}`).trim();
if (!onRemote) {
  console.error(`✗ v${next} is not on the remote after a successful push. Do NOT tell anyone to pin it.`);
  process.exit(1);
}

console.log(`\n✓ Published @riibon/ds v${next}`);
console.log(`  Bump the consumer pin: "@riibon/ds": "github:riibonltd/riibon-ds#v${next}"`);
