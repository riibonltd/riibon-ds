import type { LucideIcon } from "lucide-react";
export type IconSize = "sm" | "md" | "lg";
interface IconProps {
    icon: LucideIcon;
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
export declare function Icon({ icon: LucideComponent, size, inheritColor, className, "aria-label": ariaLabel, "aria-hidden": ariaHidden, }: IconProps): import("react").JSX.Element;
export {};
