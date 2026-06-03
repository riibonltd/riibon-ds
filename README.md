# @riibon/ds

Distributable build of the Riibon design system, for repos **outside** the
monorepo (e.g. `riibon-web`). Consumed as a **git dependency** (no registry).

> **Canonical source is the monorepo `riibon-ai`** — specifically
> `packages/ui` (the `@riibon/ui` workspace package) for components, plus
> `src/index.css` for tokens and `tailwind.config.ts` for the Tailwind theme.
> This repo is a generated MIRROR: `src/` is a verbatim copy of
> `packages/ui/src`. Don't hand-edit it — change it in the monorepo, re-sync,
> and cut a release.
>
> Inside the monorepo, apps use `@riibon/ui` directly via `workspace:*`.
> Outside it, use this package. They're kept in lockstep by `npm run sync`.

## Exports

- `@riibon/ds` — barrel: `Button`, `Icon`, `RiibonWordmark`, layout
  (`Stack`/`Cluster`/`Grid`/`Container`/`Spacer`/`Divider`), `cn`
- `@riibon/ds/button`, `/layout`, `/icon`, `/icons/RiibonWordmark`, `/utils`
  — subpaths matching `@riibon/ui` (so monorepo→external imports map 1:1)
- `@riibon/ds/tokens.css` — full design-token CSS
- `@riibon/ds/tailwind-preset` — the Tailwind theme (rb-* colours, type,
  shadows, motion, plugins)

## Consume it (Vite + Tailwind app)

`package.json`:

```jsonc
"dependencies": { "@riibon/ds": "github:riibonltd/riibon-ds#v2.0.0" }
```

`tailwind.config.ts`:

```ts
import preset from "@riibon/ds/tailwind-preset";
export default {
  presets: [preset],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@riibon/ds/dist/**/*.js", // so DS classes are generated
  ],
};
```

`src/index.css` (first line): `@import "@riibon/ds/tokens.css";`

```tsx
import { Button, Stack, Icon, cn } from "@riibon/ds";
```

`dist/` is committed, so the git dependency installs with no build step.

## Cut a release (when the monorepo's design system changes)

One command — syncs from the monorepo, rebuilds, and (only if something
changed) bumps + commits + tags + pushes:

```bash
npm run release                 # patch bump, monorepo at ../riibon-ai
npm run release -- --minor      # minor bump
npm run release -- /path/to/riibon-ai --major
```

Then bump the consumer pin (e.g. riibon-web's `package.json`) to the new
`#vX.Y.Z`. If nothing changed, `release` no-ops without publishing.

(Under the hood: `npm run sync` mirrors `packages/ui` + refreshes
`tokens.css`/`tailwind-preset.cjs`; `npm run build` regenerates `dist/`.)

### Fully automatic (already wired up)

[`.github/workflows/publish-ds.yml`](.github/workflows/publish-ds.yml) runs
**here**, in this PUBLIC repo, where GitHub Actions are free and unaffected by
the `riibonltd` private-repo Actions billing block. Every 6 hours (and on the
"Run workflow" button) it pulls the monorepo, and if the design system changed,
publishes a new tagged version automatically — `npm run release` is then only
needed when you want an instant publish.

**One-time setup to switch it on:** add a repo secret `RIIBON_AI_READ_TOKEN` —
a fine-grained PAT with **Contents: Read** on `riibonltd/riibon-ai` (needed to
clone the private monorepo). Until that secret exists the scheduled run skips
cleanly (no failures).
