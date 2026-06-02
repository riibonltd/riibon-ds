import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../utils";
const COLS = {
    "1": "grid-cols-1", "2": "grid-cols-2", "3": "grid-cols-3",
    "4": "grid-cols-4", "5": "grid-cols-5", "6": "grid-cols-6", "12": "grid-cols-12",
};
const COLS_MD = {
    "1": "md:grid-cols-1", "2": "md:grid-cols-2", "3": "md:grid-cols-3",
    "4": "md:grid-cols-4", "5": "md:grid-cols-5", "6": "md:grid-cols-6", "12": "md:grid-cols-12",
};
const GAP = {
    "0": "gap-0", "1": "gap-1", "2": "gap-2", "3": "gap-3", "4": "gap-4",
    "5": "gap-5", "6": "gap-6", "8": "gap-8", "10": "gap-10",
};
/** Responsive grid primitive. Defaults to 1-up on mobile, `cols` columns from md up. */
export const Grid = React.forwardRef(({ cols = "3", mobileCols = "1", gap = "4", className, ...rest }, ref) => (_jsx("div", { ref: ref, className: cn("grid", COLS[mobileCols], COLS_MD[cols], GAP[gap], className), ...rest })));
Grid.displayName = "Grid";
