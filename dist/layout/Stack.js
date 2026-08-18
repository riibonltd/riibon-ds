import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../utils";
/* Gap steps map to the rb spacing scale BY VALUE, not by name — the two
   scales are offset. Tailwind's gap-N is N*4px; --rb-space-N is
   0/2/4/8/12/16/20/24/32/40/48/64/96. So gap="4" is 16px, which is
   --rb-space-5, not --rb-space-4 (12px). Renaming the prop would touch
   ~1,000 call sites, so the prop keeps its meaning and the mapping absorbs
   the offset. Every value below is byte-identical in px to what it replaced;
   this moved the primitives onto tokens without moving a pixel. */
const GAP = {
    "0": "gap-rb-0", "1": "gap-rb-2", "2": "gap-rb-3", "3": "gap-rb-4", "4": "gap-rb-5",
    "5": "gap-rb-6", "6": "gap-rb-7", "8": "gap-rb-8", "10": "gap-rb-9", "12": "gap-rb-10",
};
const ALIGN = {
    start: "items-start", center: "items-center", end: "items-end", stretch: "items-stretch",
};
const JUSTIFY = {
    start: "justify-start", center: "justify-center", end: "justify-end",
    between: "justify-between", around: "justify-around",
};
/** Vertical layout primitive — children stack column-wise with consistent spacing. */
export const Stack = React.forwardRef(({ gap = "4", align = "stretch", justify = "start", className, as: Tag = "div", ...rest }, ref) => (
// @ts-expect-error — generic polymorphic tag
_jsx(Tag, { ref: ref, className: cn("flex flex-col", GAP[gap], ALIGN[align], JUSTIFY[justify], className), ...rest })));
Stack.displayName = "Stack";
