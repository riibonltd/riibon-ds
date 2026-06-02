import * as React from "react";
import { cn } from "../../lib/utils";

type ClusterGap = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8";
type ClusterAlign = "start" | "center" | "end" | "baseline";
type ClusterJustify = "start" | "center" | "end" | "between";

const GAP: Record<ClusterGap, string> = {
  "0": "gap-0", "1": "gap-1", "2": "gap-2", "3": "gap-3",
  "4": "gap-4", "5": "gap-5", "6": "gap-6", "8": "gap-8",
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
