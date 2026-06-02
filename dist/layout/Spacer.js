import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../utils";
const HEIGHT = {
    "1": "h-1", "2": "h-2", "3": "h-3", "4": "h-4", "5": "h-5",
    "6": "h-6", "8": "h-8", "10": "h-10", "12": "h-12", "16": "h-16",
};
const WIDTH = {
    "1": "w-1", "2": "w-2", "3": "w-3", "4": "w-4", "5": "w-5",
    "6": "w-6", "8": "w-8", "10": "w-10", "12": "w-12", "16": "w-16",
};
/** Whitespace primitive. Prefer Stack/Cluster `gap` over Spacer; reach for this when one item must push apart from another. */
export function Spacer({ size = "4", axis = "vertical", flex, className }) {
    if (flex)
        return _jsx("div", { className: cn("flex-1", className), "aria-hidden": "true" });
    return (_jsx("div", { className: cn(axis === "vertical" ? HEIGHT[size] : WIDTH[size], className), "aria-hidden": "true" }));
}
