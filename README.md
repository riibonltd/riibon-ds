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

```bash
npm run sync            # mirror ../riibon-ai/packages/ui + tokens + preset
npm run build           # regenerate dist/
# bump "version" in package.json, then:
git commit -am "sync: <what changed>"
git tag vX.Y.Z && git push --tags && git push
```

Consumers bump their `#vX.Y.Z` pin to adopt the change.
