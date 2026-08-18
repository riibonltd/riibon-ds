import * as React from "react";
import { cn } from "../utils";

type GridCols = "1" | "2" | "3" | "4" | "5" | "6" | "12";
type GridGap = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10";

const COLS: Record<GridCols, string> = {
  "1": "grid-cols-1", "2": "grid-cols-2", "3": "grid-cols-3",
  "4": "grid-cols-4", "5": "grid-cols-5", "6": "grid-cols-6", "12": "grid-cols-12",
};
const COLS_MD: Record<GridCols, string> = {
  "1": "md:grid-cols-1", "2": "md:grid-cols-2", "3": "md:grid-cols-3",
  "4": "md:grid-cols-4", "5": "md:grid-cols-5", "6": "md:grid-cols-6", "12": "md:grid-cols-12",
};
/* Gap steps map to the rb spacing scale BY VALUE, not by name — the two
   scales are offset. Tailwind's gap-N is N*4px; --rb-space-N is
   0/2/4/8/12/16/20/24/32/40/48/64/96. So gap="4" is 16px, which is
   --rb-space-5, not --rb-space-4 (12px). Renaming the prop would touch
   ~1,000 call sites, so the prop keeps its meaning and the mapping absorbs
   the offset. Every value below is byte-identical in px to what it replaced;
   this moved the primitives onto tokens without moving a pixel. */
const GAP: Record<GridGap, string> = {
  "0": "gap-rb-0", "1": "gap-rb-2", "2": "gap-rb-3", "3": "gap-rb-4", "4": "gap-rb-5",
  "5": "gap-rb-6", "6": "gap-rb-7", "8": "gap-rb-8", "10": "gap-rb-9",
};

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Columns at md+ viewport. Mobile collapses to 1 unless `cols` is also set. */
  cols?: GridCols;
  /** Mobile column override (default 1). */
  mobileCols?: GridCols;
  gap?: GridGap;
}

/** Responsive grid primitive. Defaults to 1-up on mobile, `cols` columns from md up. */
export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ cols = "3", mobileCols = "1", gap = "4", className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn("grid", COLS[mobileCols], COLS_MD[cols], GAP[gap], className)}
      {...rest}
    />
  ),
);
Grid.displayName = "Grid";
