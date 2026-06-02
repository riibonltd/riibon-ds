import * as React from "react";
import { cn } from "../utils";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  /** Decorative dividers are hidden from assistive tech; semantic ones get role="separator". */
  decorative?: boolean;
  className?: string;
}

/** Thin rule, defaults to a horizontal line in the border colour token. */
export function Divider({ orientation = "horizontal", decorative = true, className }: DividerProps) {
  const isVertical = orientation === "vertical";
  return (
    <div
      role={decorative ? undefined : "separator"}
      aria-orientation={isVertical ? "vertical" : "horizontal"}
      aria-hidden={decorative || undefined}
      className={cn(
        "bg-border",
        isVertical ? "w-px self-stretch" : "h-px w-full",
        className,
      )}
    />
  );
}
