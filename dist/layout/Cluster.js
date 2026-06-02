import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../utils";
const GAP = {
    "0": "gap-0", "1": "gap-1", "2": "gap-2", "3": "gap-3",
    "4": "gap-4", "5": "gap-5", "6": "gap-6", "8": "gap-8",
};
const ALIGN = {
    start: "items-start", center: "items-center", end: "items-end", baseline: "items-baseline",
};
const JUSTIFY = {
    start: "justify-start", center: "justify-center", end: "justify-end", between: "justify-between",
};
/** Horizontal layout primitive — children flow row-wise, wrapping by default. */
export const Cluster = React.forwardRef(({ gap = "2", align = "center", justify = "start", wrap = true, className, ...rest }, ref) => (_jsx("div", { ref: ref, className: cn("flex", wrap && "flex-wrap", GAP[gap], ALIGN[align], JUSTIFY[justify], className), ...rest })));
Cluster.displayName = "Cluster";
