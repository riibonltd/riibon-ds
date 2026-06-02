# @riibon/ds

Riibon design-system primitives + tokens, packaged for reuse outside the
main app. Consumed as a **git dependency** (no registry).

> **Source of truth is `riibon-ai/src`**, not this repo. This package is a
> *generated, versioned snapshot* of a defined manifest of files. Don't hand-
> edit `src/` here — change it in `riibon-ai`, then re-sync and cut a release.

## What's included

- Components: `Button`, `Icon`, `RiibonWordmark`, layout (`Stack`, `Cluster`,
  `Grid`, `Container`, `Spacer`, `Divider`)
- `cn()` class-merge util (with Riibon font-size token registration)
- `tokens.css` — the full design-token CSS (colours, type, shadows, motion, …)
- `tailwind-preset.cjs` — the Tailwind theme (rb-* colours, fontSize, radius,
  shadows, animations, plugins)

## Consume it (Vite + Tailwind app)

`package.json`:

```jsonc
"dependencies": {
  "@riibon/ds": "github:riibonltd/riibon-ds#v1.0.0"
}
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

`src/index.css` (first line):

```css
@import "@riibon/ds/tokens.css";
```

Then:

```tsx
import { Button, Stack, Icon, cn } from "@riibon/ds";
```

`dist/` is committed, so the git dependency installs with no build step.

## Cut a new release (when the app's design system changes)

```bash
npm run sync          # pull latest from ../riibon-ai/src  (pass a path if elsewhere)
npm run build         # regenerate dist/
# bump "version" in package.json, then:
git commit -am "sync: <what changed>"
git tag vX.Y.Z && git push --tags && git push
```

Consumers bump their `#vX.Y.Z` pin to adopt the change.
