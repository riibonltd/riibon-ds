import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/** Custom tailwind-merge config that registers Riibon's typography tokens
 *  as font-size classes (instead of letting the default merger think
 *  they're colors).
 *
 *  The default `twMerge` only recognises Tailwind's stock font-size
 *  names (xs, sm, base, lg, …). Riibon adds custom names via
 *  `theme.fontSize` in `tailwind.config.ts` — `text-rb-caption`,
 *  `text-rb-body-sm`, `text-rb-h1`, etc. Without this extension, those
 *  classes match nothing in any group EXCEPT the catch-all colour
 *  pattern, so tailwind-merge treats them as colours. The consequence:
 *  any element that combines a Riibon font-size with a tailwind colour
 *  (e.g. `<Button class="text-primary-foreground … text-rb-caption">`)
 *  gets the colour silently stripped and renders with the body's
 *  default text colour — producing the black-on-blue button readability
 *  bug surfaced in the merge audit.
 *
 *  Registering the names in the `font-size` group fixes it: the merger
 *  now knows `text-rb-caption` is a size and leaves the colour token
 *  alone. */
const RB_FONT_SIZES = [
  "rb-display",
  "rb-h1",
  "rb-h2",
  "rb-h3",
  "rb-body-lg",
  "rb-body",
  "rb-body-sm",
  "rb-caption",
  "rb-code",
  /* Micro-typography ramp — keep these registered alongside the rest of
     the scale or twMerge will treat them as colour classes (the same
     bug that #107 fixed for the macro scale) and silently strip the
     real text colour at runtime. */
  "rb-micro",
  "rb-micro-sm",
  "rb-micro-md",
  "rb-mini",
  "rb-mini-sm",
  "rb-cell",
] as const;

/**
 * The same bug as the font-size one above, for every OTHER kind of token — and
 * this is the one that quietly defeated the design system.
 *
 * `tailwind-merge` resolves a conflict only between classes it puts in the same
 * group, and it derives groups from Tailwind's STOCK names. Riibon's geometry
 * tokens (`h-rb-control`, `px-rb-control`, `rounded-rb-card`, `gap-rb-5`) are
 * custom `theme` names, so the merger did not recognise them as heights,
 * paddings, radii or gaps at all. Only `font-size` had ever been registered.
 *
 * The consequence is silent and it is severe: **a shared class could not
 * override a stock one.** `cn("h-10 px-3", BAR_CONTROL)` kept BOTH `h-10` and
 * `h-rb-control`, and which one won came down to CSS source order rather than
 * to what the author wrote. So a control handed the shared bar class still
 * rendered at the primitive's own 40px, the call site looked correct, and the
 * guard that read the call site agreed with it.
 *
 * That is why "one bar, one control" could be recorded as done while every
 * dropdown in the app was 8px taller than the buttons beside it. The fix was
 * never at the call sites; it was here.
 *
 * Registered by PATTERN rather than by list. A list would need updating every
 * time a token is added, and a stale list fails the same silent way — see the
 * CLAUDE.md rule about a guard carrying its own private copy of the list it
 * enforces.
 */
const isRbToken = (value: string) => value.startsWith("rb-");

/** Every group whose values come from `theme.spacing`, plus the geometry
 *  groups that take their own scale. */
const RB_SPACING_GROUPS = [
  "p", "px", "py", "pt", "pr", "pb", "pl",
  "m", "mx", "my", "mt", "mr", "mb", "ml",
  "gap", "gap-x", "gap-y",
  "space-x", "space-y",
  "w", "h", "min-h", "min-w", "max-w", "size",
  "top", "right", "bottom", "left", "inset",
] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [...RB_FONT_SIZES] }],
      rounded: [{ rounded: [isRbToken] }],
      ...Object.fromEntries(
        RB_SPACING_GROUPS.map((g) => [g, [{ [g]: [isRbToken] }]]),
      ),
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
