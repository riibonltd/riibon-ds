import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
/* Button — design-system spec (P1)
   ---------------------------------
   Three sizes (sm 28 / md 36 / lg 44) + two icon-only sizes (icon 36 = md,
   icon-sm 28 = sm). The default size is `md` (was `default` 40 — dropped
   to align with spec). The accent variant is yellow, reserved for
   celebratory moments (onboarding completions, milestones); never use it
   for routine actions. */
const buttonVariants = cva(
/* Coloured-fill variants set the foreground via `text-…-foreground`,
   but a leading <Icon> would otherwise win with its own `text-icon`
   token and render neutral-grey (failing WCAG 3:1 on the colour fill).
   Forcing `[&_svg]:text-current` on the button — same descendant
   selector pattern as the existing `[&_svg]:size-*` rules — makes any
   icon inherit the button's foreground regardless of the Icon
   wrapper's default. */
"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-rb-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-current", {
    variants: {
        variant: {
            /* Default = primary blue, the single most important action on a screen. */
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            /* Accent = yellow, celebratory only (milestone, completion).
               Reads against neutral-900 text for AA contrast on yellow-300. */
            accent: "bg-rb-yellow-300 text-rb-neutral-900 border border-rb-yellow-300 hover:bg-rb-yellow-400",
            /* Destructive uses terracotta-500 via shadcn token. */
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline",
        },
        size: {
            /* sm — 28px, dense chrome (filter chips, table-row actions). */
            sm: "h-7 px-2.5 text-rb-caption gap-1.5 [&_svg]:size-3.5",
            /* md — 36px, default (forms, primary CTAs in compact contexts). */
            md: "h-9 px-3.5 text-rb-body-sm [&_svg]:size-4",
            /* lg — 44px, hero / primary CTAs on landing surfaces, mobile-friendly tap target. */
            lg: "h-11 px-5 text-rb-body-sm [&_svg]:size-4",
            /* Icon-only variants pair with `aria-label`. */
            icon: "h-9 w-9 [&_svg]:size-4",
            "icon-sm": "h-7 w-7 [&_svg]:size-3.5",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "md",
    },
});
const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return _jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref: ref, ...props });
});
Button.displayName = "Button";
export { Button, buttonVariants };
