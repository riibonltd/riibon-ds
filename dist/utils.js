import { clsx } from "clsx";
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
];
const twMerge = extendTailwindMerge({
    extend: {
        classGroups: {
            "font-size": [{ text: [...RB_FONT_SIZES] }],
        },
    },
});
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
