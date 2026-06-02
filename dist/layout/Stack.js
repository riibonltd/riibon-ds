import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../utils";
const GAP = {
    "0": "gap-0", "1": "gap-1", "2": "gap-2", "3": "gap-3", "4": "gap-4",
    "5": "gap-5", "6": "gap-6", "8": "gap-8", "10": "gap-10", "12": "gap-12",
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
