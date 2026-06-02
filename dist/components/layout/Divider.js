import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../../lib/utils";
/** Thin rule, defaults to a horizontal line in the border colour token. */
export function Divider({ orientation = "horizontal", decorative = true, className }) {
    const isVertical = orientation === "vertical";
    return (_jsx("div", { role: decorative ? undefined : "separator", "aria-orientation": isVertical ? "vertical" : "horizontal", "aria-hidden": decorative || undefined, className: cn("bg-border", isVertical ? "w-px self-stretch" : "h-px w-full", className) }));
}
