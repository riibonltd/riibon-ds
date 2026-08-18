import * as React from "react";
import { cn } from "../utils";

type ClusterGap = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8";
type ClusterAlign = "start" | "center" | "end" | "baseline";
type ClusterJustify = "start" | "center" | "end" | "between";

/* Gap steps map to the rb spacing scale BY VALUE, not by name — the two
   scales are offset. Tailwind's gap-N is N*4px; --rb-space-N is
   0/2/4/8/12/16/20/24/32/40/48/64/96. So gap="4" is 16px, which is
   --rb-space-5, not --rb-space-4 (12px). Renaming the prop would touch
   ~1,000 call sites, so the prop keeps its meaning and the mapping absorbs
   the offset. Every value below is byte-identical in px to what it replaced;
   this moved the primitives onto tokens without moving a pixel. */
const GAP: Record<ClusterGap, string> = {
  "0": "gap-rb-0", "1": "gap-rb-2", "2": "gap-rb-3", "3": "gap-rb-4",
  "4": "gap-rb-5", "5": "gap-rb-6", "6": "gap-rb-7", "8": "gap-rb-8",
};
const ALIGN: Record<ClusterAlign, string> = {
  start: "items-start", center: "items-center", end: "items-end", baseline: "items-baseline",
};
const JUSTIFY: Record<ClusterJustify, string> = {
  start: "justify-start", center: "justify-center", end: "justify-end", between: "justify-between",
};

export interface ClusterProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: ClusterGap;
  align?: ClusterAlign;
  justify?: ClusterJustify;
  wrap?: boolean;
}

/** Horizontal layout primitive — children flow row-wise, wrapping by default. */
export const Cluster = React.forwardRef<HTMLDivElement, ClusterProps>(
  ({ gap = "2", align = "center", justify = "start", wrap = true, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn("flex", wrap && "flex-wrap", GAP[gap], ALIGN[align], JUSTIFY[justify], className)}
      {...rest}
    />
  ),
);
Cluster.displayName = "Cluster";
