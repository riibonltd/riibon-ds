import * as React from "react";
import { cn } from "../../lib/utils";

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
const GAP: Record<GridGap, string> = {
  "0": "gap-0", "1": "gap-1", "2": "gap-2", "3": "gap-3", "4": "gap-4",
  "5": "gap-5", "6": "gap-6", "8": "gap-8", "10": "gap-10",
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
