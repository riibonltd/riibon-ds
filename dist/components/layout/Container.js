import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../../lib/utils";
const SIZE = {
    narrow: "max-w-[960px]",
    default: "max-w-[1100px]",
    wide: "max-w-[1280px]",
    full: "max-w-none",
};
const PADDING = {
    none: "",
    page: "p-rb-6",
};
/** Centered max-width wrapper. Use at the top of any page-level layout. */
export const Container = React.forwardRef(({ size = "default", padding = "page", className, ...rest }, ref) => (_jsx("div", { ref: ref, className: cn("mx-auto w-full", SIZE[size], PADDING[padding], className), ...rest })));
Container.displayName = "Container";
