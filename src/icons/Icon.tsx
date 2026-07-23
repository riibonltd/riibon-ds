import type { LucideIcon } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { cn } from "../utils";

export type IconSize = "sm" | "md" | "lg";

/** A renderable icon component: a Lucide icon (the default) OR a vendor
 *  brand-mark SVG component (react-icons style — accepts `size` + the
 *  standard SVG props). Per the design-system rules vendor marks (Meta,
 *  Google) are rendered by wrapping them in <Icon>, so the prop must admit
 *  both shapes, not just `LucideIcon`. */
export type IconComponent =
  | LucideIcon
  | ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;

const SIZE_PX: Record<IconSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

interface IconProps {
  icon: IconComponent;
  /** Named token (16/20/24) or an exact pixel value for the rare case
   *  where a smaller hit-target is needed (e.g. inline kebab menus at
   *  12-14px). Prefer the named tokens. */
  size?: IconSize | number;
  /** When true, drops the default `text-icon` colour so the icon
   *  inherits its parent's foreground via `currentColor`. Use for icons
   *  rendered inside a coloured-fill container (primary buttons, accent
   *  CTAs, badge chips) where the parent already establishes the
   *  contrast-safe text colour. The default `text-icon` token is
   *  designed for icons on neutral surfaces and reads grey on coloured
   *  fills — which fails WCAG 3:1 for non-text. */
  inheritColor?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-hidden"?: boolean;
}

export function Icon({
  icon: LucideComponent,
  size = "sm",
  inheritColor = false,
  className,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
}: IconProps) {
  const px = typeof size === "number" ? size : SIZE_PX[size];
  return (
    <LucideComponent
      size={px}
      strokeWidth={1.75}
      className={cn("shrink-0", !inheritColor && "text-icon", className)}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden ?? !ariaLabel}
      role={ariaLabel ? "img" : undefined}
    />
  );
}
