import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../../lib/utils";
const SIZE_PX = {
    sm: 16,
    md: 20,
    lg: 24,
};
export function Icon({ icon: LucideComponent, size = "sm", inheritColor = false, className, "aria-label": ariaLabel, "aria-hidden": ariaHidden, }) {
    const px = typeof size === "number" ? size : SIZE_PX[size];
    return (_jsx(LucideComponent, { size: px, strokeWidth: 1.75, className: cn("shrink-0", !inheritColor && "text-icon", className), "aria-label": ariaLabel, "aria-hidden": ariaHidden ?? !ariaLabel, role: ariaLabel ? "img" : undefined }));
}
