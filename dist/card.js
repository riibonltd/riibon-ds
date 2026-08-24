import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "./utils";
/* The shell. Radius and ground are identical across every tone — a card is
   always the same OBJECT; tone only changes the edge and, for a status card,
   the ground. */
const TONE_CLASS = {
    default: "border border-rb-border bg-rb-surface-card",
    quiet: "border border-rb-border-subtle bg-rb-surface-card",
    info: "border border-rb-info-border bg-rb-info-bg",
    success: "border border-rb-success-border bg-rb-success-bg",
    warning: "border border-rb-warning-border bg-rb-warning-bg",
    error: "border border-rb-error-border bg-rb-error-bg",
    placeholder: "border border-dashed border-rb-border bg-rb-surface-card",
};
/* Horizontal inset. Every slot carries its own, so `flush` can drop it from
   the main slot alone and a table still gets a padded header above it. */
const PAD_X = {
    comfortable: "px-rb-card-x",
    compact: "px-rb-4",
    flush: "px-rb-card-x",
};
/* Vertical inset, owned by the shell in the padded densities. A `flush` card
   has none: its header and footer supply their own, so the main slot reaches
   all four edges. */
const PAD_Y = {
    comfortable: "py-rb-card-y",
    compact: "py-rb-4",
    flush: "",
};
/* Vertical rhythm between slots. One gap token, so a card with four slots
   breathes the same as a card with two. */
const GAP = {
    comfortable: "gap-rb-card-gap",
    compact: "gap-rb-3",
    flush: "gap-rb-card-gap",
};
function CardImpl({ tone = "default", density = "comfortable", context, title, subtitle, actions, supporting, footer, headingAs, as, className, children, ...props }, ref) {
    const Shell = (as ?? "div");
    const hasHeader = context != null || title != null || subtitle != null || actions != null;
    /* A card with nothing but main content is a single padded block. Render it
       as one, so the DOM stays as flat as the hand-rolled div it replaces and
       `flush` genuinely means "no inset" rather than "an inset of zero applied
       to a wrapper". */
    const bare = !hasHeader && footer == null && supporting == null;
    return (_jsx(Shell, { ref: ref, className: cn("rounded-rb-card text-rb-text-primary", TONE_CLASS[tone], 
        /* A bare flush card has no inset at all — expressed by applying none,
           not by applying one and cancelling it. */
        bare
            ? density === "flush"
                ? undefined
                : cn(PAD_X[density], PAD_Y[density])
            : cn("flex flex-col", GAP[density], PAD_Y[density]), className), ...props, children: bare ? (children) : (_jsxs(_Fragment, { children: [hasHeader && (_jsx(CardHeader, { context: context, title: title, subtitle: subtitle, actions: actions, headingAs: headingAs, className: cn(PAD_X[density], density === "flush" && "pt-rb-card-y") })), children != null && (_jsx("div", { className: cn(density === "flush" ? undefined : PAD_X[density], "min-w-0"), children: children })), supporting != null && (_jsx("div", { className: cn(PAD_X[density], "text-rb-body-sm text-rb-text-secondary"), children: supporting })), footer != null && (_jsx(CardFooter, { className: cn(PAD_X[density], density === "flush" && "pb-rb-card-y"), children: footer }))] })) }));
}
/* `forwardRef` erases the generic, so the cast restores it. This is the
   standard polymorphic-component shape; without it `as={Link} to="…"` is a
   type error and every interactive card goes back to hand-rolled markup. */
export const Card = React.forwardRef(CardImpl);
/**
 * The card's header anatomy, exported for the handful of cards that assemble
 * their own shell (a drawer, a joined card group). Same slots, same type
 * scale — a hand-assembled header must not be a second definition of one.
 */
export const CardHeader = React.forwardRef(function CardHeader({ context, title, subtitle, actions, headingAs, className, children, ...props }, ref) {
    const Heading = (headingAs ?? "h3");
    return (_jsxs("div", { ref: ref, className: cn("flex flex-col gap-rb-2", className), ...props, children: [context != null && _jsx(CardContext, { children: context }), (title != null || actions != null) && (_jsxs("div", { className: "flex items-start justify-between gap-rb-4", children: [title != null && _jsx(Heading, { className: "min-w-0 text-rb-h3 text-rb-text-primary", children: title }), actions != null && (_jsx("div", { className: "ml-auto flex shrink-0 items-center gap-rb-2", children: actions }))] })), subtitle != null && _jsx(CardDescription, { children: subtitle }), children] }));
});
/**
 * The context slot's type face. Small, tertiary, uppercase — it reads as a
 * marker on the card rather than as a line of the card's own copy, which is
 * what stops "modelled" from looking like a sentence somebody wrote.
 *
 * It WRAPS. This slot holds a row of independent markers, not a sentence, and
 * their number is data — a campaign verdict can carry a serving status, an
 * uncalibrated flag, a low-confidence flag and a count of unchecked gates at
 * once. A non-wrapping row squeezes or overflows exactly when it has the most
 * to say. The slot was `flex` with no wrap when the verdict banner migrated
 * onto it, and the hand-rolled row it replaced had `flex-wrap`; caught in
 * review on #2547. Fixed here rather than at the call site, because a slot
 * every card shares should not need each card to remember this.
 */
export const CardContext = React.forwardRef(function CardContext({ className, ...props }, ref) {
    return (_jsx("div", { ref: ref, className: cn("flex flex-wrap items-center gap-rb-2 text-rb-micro-sm uppercase tracking-wider text-rb-text-tertiary", className), ...props }));
});
/** The card title, for hand-assembled headers. One spelling, everywhere. */
export const CardTitle = React.forwardRef(function CardTitle({ className, ...props }, ref) {
    return _jsx("h3", { ref: ref, className: cn("text-rb-h3 text-rb-text-primary", className), ...props });
});
/** The subtitle. Secondary ink, body-sm — never the same size as the title. */
export const CardDescription = React.forwardRef(function CardDescription({ className, ...props }, ref) {
    return _jsx("p", { ref: ref, className: cn("text-rb-body-sm text-rb-text-secondary", className), ...props });
});
/** Main-content wrapper for a hand-assembled shell. Horizontal inset only —
 *  vertical rhythm belongs to the shell's gap, so a hand-assembled card and a
 *  slotted one space their content identically. */
export const CardContent = React.forwardRef(function CardContent({ className, ...props }, ref) {
    return _jsx("div", { ref: ref, className: cn("min-w-0 px-rb-card-x", className), ...props });
});
/**
 * The footer. A hairline above it, because a footer that is merely the last
 * paragraph of the card is not a footer — it is copy that should have been cut.
 * Making the separation visible is what forces that question at the call site.
 */
export const CardFooter = React.forwardRef(function CardFooter({ className, ...props }, ref) {
    return (_jsx("div", { ref: ref, className: cn("flex items-center gap-rb-3 border-t border-rb-border-subtle pt-rb-card-y text-rb-body-sm text-rb-text-secondary", className), ...props }));
});
