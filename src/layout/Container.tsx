import * as React from "react";
import { cn } from "../utils";

type ContainerSize = "narrow" | "default" | "wide" | "full";
type ContainerPadding = "none" | "page";

const SIZE: Record<ContainerSize, string> = {
  narrow: "max-w-[960px]",
  default: "max-w-[1100px]",
  wide: "max-w-[1280px]",
  full: "max-w-none",
};

const PADDING: Record<ContainerPadding, string> = {
  none: "",
  page: "p-rb-6",
};

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  padding?: ContainerPadding;
}

/** Centered max-width wrapper. Use at the top of any page-level layout. */
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = "default", padding = "page", className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn("mx-auto w-full", SIZE[size], PADDING[padding], className)}
      {...rest}
    />
  ),
);
Container.displayName = "Container";
