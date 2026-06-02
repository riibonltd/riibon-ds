import * as React from "react";
type GridCols = "1" | "2" | "3" | "4" | "5" | "6" | "12";
type GridGap = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10";
export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Columns at md+ viewport. Mobile collapses to 1 unless `cols` is also set. */
    cols?: GridCols;
    /** Mobile column override (default 1). */
    mobileCols?: GridCols;
    gap?: GridGap;
}
/** Responsive grid primitive. Defaults to 1-up on mobile, `cols` columns from md up. */
export declare const Grid: React.ForwardRefExoticComponent<GridProps & React.RefAttributes<HTMLDivElement>>;
export {};
