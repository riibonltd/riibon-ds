import * as React from "react";

import { cn } from "./utils";

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

export type CardTone =
  | "default"
  | "quiet"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "placeholder";

export type CardDensity = "comfortable" | "compact" | "flush";

/* The shell. Radius and ground are identical across every tone — a card is
   always the same OBJECT; tone only changes the edge and, for a status card,
   the ground. */
const TONE_CLASS: Record<CardTone, string> = {
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
const PAD_X: Record<CardDensity, string> = {
  comfortable: "px-rb-card-x",
  compact: "px-rb-4",
  flush: "px-rb-card-x",
};

/* Vertical inset, owned by the shell in the padded densities. A `flush` card
   has none: its header and footer supply their own, so the main slot reaches
   all four edges. */
const PAD_Y: Record<CardDensity, string> = {
  comfortable: "py-rb-card-y",
  compact: "py-rb-4",
  flush: "",
};

/* Vertical rhythm between slots. One gap token, so a card with four slots
   breathes the same as a card with two. */
const GAP: Record<CardDensity, string> = {
  comfortable: "gap-rb-card-gap",
  compact: "gap-rb-3",
  flush: "gap-rb-card-gap",
};

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

function CardImpl<T extends React.ElementType = "div">(
  {
    tone = "default",
    density = "comfortable",
    context,
    title,
    subtitle,
    actions,
    supporting,
    footer,
    headingAs,
    as,
    className,
    children,
    ...props
  }: CardProps<T>,
  ref: React.Ref<Element>,
) {
  const Shell = (as ?? "div") as React.ElementType;
  const hasHeader = context != null || title != null || subtitle != null || actions != null;

  /* A card with nothing but main content is a single padded block. Render it
     as one, so the DOM stays as flat as the hand-rolled div it replaces and
     `flush` genuinely means "no inset" rather than "an inset of zero applied
     to a wrapper". */
  const bare = !hasHeader && footer == null && supporting == null;

  return (
    <Shell
      ref={ref}
      className={cn(
        "rounded-rb-card text-rb-text-primary",
        TONE_CLASS[tone],
        /* A bare flush card has no inset at all — expressed by applying none,
           not by applying one and cancelling it. */
        bare
          ? density === "flush"
            ? undefined
            : cn(PAD_X[density], PAD_Y[density])
          : cn("flex flex-col", GAP[density], PAD_Y[density]),
        className,
      )}
      {...props}
    >
      {bare ? (
        children
      ) : (
        <>
          {hasHeader && (
            <CardHeader
              context={context}
              title={title}
              subtitle={subtitle}
              actions={actions}
              headingAs={headingAs}
              className={cn(PAD_X[density], density === "flush" && "pt-rb-card-y")}
            />
          )}
          {children != null && (
            <div className={cn(density === "flush" ? undefined : PAD_X[density], "min-w-0")}>{children}</div>
          )}
          {supporting != null && (
            <div className={cn(PAD_X[density], "text-rb-body-sm text-rb-text-secondary")}>{supporting}</div>
          )}
          {footer != null && (
            <CardFooter className={cn(PAD_X[density], density === "flush" && "pb-rb-card-y")}>{footer}</CardFooter>
          )}
        </>
      )}
    </Shell>
  );
}

/* `forwardRef` erases the generic, so the cast restores it. This is the
   standard polymorphic-component shape; without it `as={Link} to="…"` is a
   type error and every interactive card goes back to hand-rolled markup. */
export const Card = React.forwardRef(CardImpl) as <T extends React.ElementType = "div">(
  props: CardProps<T> & { ref?: React.Ref<Element> },
) => React.ReactElement | null;

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
export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { context, title, subtitle, actions, headingAs, className, children, ...props },
  ref,
) {
  const Heading = (headingAs ?? "h3") as React.ElementType;
  return (
    <div ref={ref} className={cn("flex flex-col gap-rb-2", className)} {...props}>
      {context != null && <CardContext>{context}</CardContext>}
      {(title != null || actions != null) && (
        <div className="flex items-start justify-between gap-rb-4">
          {/* A card with actions and no title still puts them at the right
              edge. `ml-auto` does that without an empty node standing in for
              the heading — an untitled card should have no heading in the
              accessibility tree at all, not a blank one. */}
          {title != null && <Heading className="min-w-0 text-rb-h3 text-rb-text-primary">{title}</Heading>}
          {actions != null && (
            <div className="ml-auto flex shrink-0 items-center gap-rb-2">{actions}</div>
          )}
        </div>
      )}
      {subtitle != null && <CardDescription>{subtitle}</CardDescription>}
      {children}
    </div>
  );
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
export const CardContext = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardContext({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap items-center gap-rb-2 text-rb-micro-sm uppercase tracking-wider text-rb-text-tertiary",
          className,
        )}
        {...props}
      />
    );
  },
);

/** The card title, for hand-assembled headers. One spelling, everywhere. */
export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  function CardTitle({ className, ...props }, ref) {
    return <h3 ref={ref} className={cn("text-rb-h3 text-rb-text-primary", className)} {...props} />;
  },
);

/** The subtitle. Secondary ink, body-sm — never the same size as the title. */
export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  function CardDescription({ className, ...props }, ref) {
    return <p ref={ref} className={cn("text-rb-body-sm text-rb-text-secondary", className)} {...props} />;
  },
);

/** Main-content wrapper for a hand-assembled shell. Horizontal inset only —
 *  vertical rhythm belongs to the shell's gap, so a hand-assembled card and a
 *  slotted one space their content identically. */
export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardContent({ className, ...props }, ref) {
    return <div ref={ref} className={cn("min-w-0 px-rb-card-x", className)} {...props} />;
  },
);

/**
 * The footer. A hairline above it, because a footer that is merely the last
 * paragraph of the card is not a footer — it is copy that should have been cut.
 * Making the separation visible is what forces that question at the call site.
 */
export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardFooter({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-rb-3 border-t border-rb-border-subtle pt-rb-card-y text-rb-body-sm text-rb-text-secondary",
          className,
        )}
        {...props}
      />
    );
  },
);
