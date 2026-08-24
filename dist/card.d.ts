import * as React from "react";
/**
 * THE CARD. One shell, one hierarchy, one set of optional slots.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS, and why `check:card-identity` reading ✓ 0 did not mean the
 * app had one card.
 *
 * On 2026-08-17 a codemod drove every card in the product onto a single radius
 * token and the guard has printed "one card, one radius" ever since. On
 * 2026-08-22 the same tree held:
 *
 *     312 card instances across 140 files
 *     260 of them hand-rolled markup, 52 through a component
 *      75 distinct SHELL signatures
 *      25 distinct padding spellings (p-4 ×95, p-3 ×56, p-5, p-6, p-8, …)
 *       4 border weights used interchangeably for the same job
 *       6 card titles spelled by hand, in 4 different ways
 *
 * Every one of those passed `check:card-identity`, `check:brand`,
 * `check:page-not-surface` and `check:dead-tokens`. Nothing was off-token.
 * The guards ask WHICH TOKEN and the drift was in WHAT A CARD IS — its
 * padding, its hierarchy, where the title sits, whether there is a footer.
 * That is the same hole CLAUDE.md documents twice already: a guard that fires
 * on a WRONG token being present is blind to a component being ABSENT, and
 * absence is not a string.
 *
 * The last figure is deliberately small, and it is the one that was hardest to
 * get right. An earlier draft of this docblock claimed "172 distinct type
 * signatures including 8 spellings of the card's title". That number was real
 * but it counted every type signature in every FILE containing a card — page
 * headings, table cells, badges — so it described the app, not the card, and it
 * implied a hierarchy problem an order of magnitude bigger than the one that
 * existed. Measured per CARD, only 11 had an internal heading at all and 6 of
 * those were genuine titles. They now use the `title` slot.
 *
 * Recording that here because the mistake is the one this file lectures about:
 * a number that is accurate and answers a question nobody asked.
 *
 * The tell was measurable. `--rb-card-pad-y/-x/-gap` — the DENSITY block that
 * declares itself "the one decision that sets how the whole app feels" — was
 * read by 2 of 260 card sites. The other 258 spelled `p-4` or `p-3` by hand,
 * so the density preset governed almost nothing it was written to govern.
 *
 * ---------------------------------------------------------------------------
 * THE SLOTS, in render order. Every one except `children` is optional, and a
 * card renders only what it is given — there is no empty header, no reserved
 * footer rail, no placeholder chrome.
 *
 *   context      provenance or state, ABOVE the title, only when it changes
 *                how the number below is read ("modelled", "3 of 7 accounts").
 *                Not a home for implementation notes.
 *   title        omit when the surrounding page already says what this is.
 *                Duplicated titles are the most common thing this replaced.
 *   subtitle     only when it adds what a title cannot.
 *   actions      top-right; pin, overflow, filter. Shared icon-action system.
 *   children     THE POINT OF THE CARD. One primary focus.
 *   supporting   a comparison, an annotation, a next action. Not a restatement
 *                of the obvious.
 *   footer       a real follow-up action, provenance that materially matters,
 *                or meaningful status. Never storage for leftover copy.
 *
 * ---------------------------------------------------------------------------
 * TONE is a claim about the CONTENT, not a decoration.
 *
 * `warning` and `error` are reserved for a real risk, failure or material
 * limitation the reader can act on. They are not for generic caveats or
 * technical asides — a permanent amber card teaches people to ignore amber.
 *
 * 0 of 312 cards used a semantic ground before this. The tokens existed and
 * flipped correctly for dark mode; nothing read them. Status was improvised
 * instead — 19 cards used `border-rb-border-strong` as an emphasis edge, and
 * 10 of those drew a real failure in `text-rb-mini uppercase tracking-wider`,
 * the eyebrow face, inside a neutral card. All 10 are `tone="error"` now.
 *
 * DENSITY is geometry only, and all of it comes from the DENSITY block in
 * src/index.css. Never spell a card padding or radius at a call site.
 *
 *   comfortable  the default. Card padding tokens.
 *   compact      a card nested inside a card, or a dense list row.
 *   flush        the main slot bleeds to the edge — a table or a chart that
 *                owns its own inset. Header and footer keep their padding, so
 *                a flush card still has a hierarchy.
 */
export type CardTone = "default" | "quiet" | "info" | "success" | "warning" | "error" | "placeholder";
export type CardDensity = "comfortable" | "compact" | "flush";
/** The slots and modifiers the card owns, independent of what it renders as. */
export interface CardOwnProps {
    tone?: CardTone;
    density?: CardDensity;
    /** Provenance or state, above the title. Only when it changes interpretation. */
    context?: React.ReactNode;
    /** Omit when the page already establishes what this card is. */
    title?: React.ReactNode;
    /** Only when it adds something the title cannot. */
    subtitle?: React.ReactNode;
    /** Top-right icon actions: pin, overflow, filter. */
    actions?: React.ReactNode;
    /** Comparison, annotation or next action, under the main content. */
    supporting?: React.ReactNode;
    /** A real follow-up action, material provenance, or meaningful status. */
    footer?: React.ReactNode;
    /** The heading level for `title`. The card does not assume it owns an h3. */
    headingAs?: React.ElementType;
    className?: string;
    children?: React.ReactNode;
}
/**
 * Polymorphic, because a card is sometimes the interactive element itself — a
 * `<button>` that drills into a stage, a `<Link>` that opens an object type, a
 * `<label>` wrapping a radio. Those were the last hand-rolled shells left after
 * the sweep, and they were hand-rolled for exactly one reason: the component
 * could not be rendered as anything but a div, so reaching for it meant nesting
 * a card inside a button and getting two focus rings.
 */
export type CardProps<T extends React.ElementType = "div"> = CardOwnProps & {
    /** Render as `section`, `button`, `label`, a router `Link`, … */
    as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, keyof CardOwnProps | "as">;
export declare const Card: <T extends React.ElementType = "div">(props: CardProps<T> & {
    ref?: React.Ref<Element>;
}) => React.ReactElement | null;
export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    context?: React.ReactNode;
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    actions?: React.ReactNode;
    headingAs?: React.ElementType;
}
/**
 * The card's header anatomy, exported for the handful of cards that assemble
 * their own shell (a drawer, a joined card group). Same slots, same type
 * scale — a hand-assembled header must not be a second definition of one.
 */
export declare const CardHeader: React.ForwardRefExoticComponent<CardHeaderProps & React.RefAttributes<HTMLDivElement>>;
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
export declare const CardContext: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
/** The card title, for hand-assembled headers. One spelling, everywhere. */
export declare const CardTitle: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLHeadingElement> & React.RefAttributes<HTMLHeadingElement>>;
/** The subtitle. Secondary ink, body-sm — never the same size as the title. */
export declare const CardDescription: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLParagraphElement> & React.RefAttributes<HTMLParagraphElement>>;
/** Main-content wrapper for a hand-assembled shell. Horizontal inset only —
 *  vertical rhythm belongs to the shell's gap, so a hand-assembled card and a
 *  slotted one space their content identically. */
export declare const CardContent: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
/**
 * The footer. A hairline above it, because a footer that is merely the last
 * paragraph of the card is not a footer — it is copy that should have been cut.
 * Making the separation visible is what forces that question at the call site.
 */
export declare const CardFooter: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
