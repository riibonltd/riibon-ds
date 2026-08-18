const tailwindcssAnimate = require("tailwindcss-animate");
const containerQueries = require("@tailwindcss/container-queries");
/**
 * A Riibon colour token, alpha-capable.
 *
 * Tailwind can only apply an opacity modifier (`bg-rb-surface-card/60`) to a
 * value it knows how to inject alpha into. A bare `var(--rb-x)` is opaque to
 * it, so the modifier is not an error — **the candidate is silently dropped and
 * no CSS is generated at all.** The class reaches the DOM and does nothing.
 *
 * This wrapper was already here, applied by hand to the eleven scales somebody
 * happened to need a modifier on, with a comment describing it as opt-in. That
 * is the hand-maintained list this repo keeps paying for: on 2026-08-18 an
 * audit found **22 live classes** written against tokens nobody had wired —
 * translucent card and section grounds, hover tints, and the coloured borders
 * on every success / warning / error banner in the product. All of them absent,
 * none of them erroring.
 *
 * So it is applied by CONSTRUCTION now: every value in the `rb` group goes
 * through here, and a new token cannot arrive without it. Lossless at full
 * opacity — the palette is plain sRGB hex, and `color-mix(in srgb, X calc(1 *
 * 100%), transparent)` is exactly X.
 */
const rbVar = (name) => `color-mix(in srgb, var(--rb-${name}) calc(<alpha-value> * 100%), transparent)`;
module.exports = {
    darkMode: ["class"],
    /* Safelist Riibon design-system tokens that are commonly composed via state
       (variant props, theme-driven choice, etc.) so dynamic class names never
       silently drop. Adds ~3KB of CSS — worth it for system reliability. */
    safelist: [
        { pattern: /^shadow-rb-(xs|sm|md|lg|xl|ring|offset-lg|offset-sm)$/ },
        { pattern: /^animate-rb-(pulse|blink|slide-up|slide-left|fade-in|scan|grow|marquee|shimmer|fade-up)$/ },
        { pattern: /^(ease|duration)-rb(-(in|out|in-out|fast|base|slow|slower))?$/ },
        { pattern: /^rounded-rb-(xs|sm|md|lg|xl|2xl|pill)$/ },
        { pattern: /^bg-rb-seq-(100|200|300|400|500|600|700)$/ },
        { pattern: /^bg-rb-div-(neg-3|neg-2|neg-1|0|pos-1|pos-2|pos-3)$/ },
        { pattern: /^bg-rb-viz-[1-8]$/ },
        { pattern: /^text-rb-(display|h1|h2|h3|body-lg|body|body-sm|caption|code|micro|micro-sm|micro-md|mini|mini-sm|cell)$/ },
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            screens: {
                /* The width at which the app's THREE columns — nav sidebar (248px),
                   page, AI chat (~360px) — all fit in flow at once. Below it the two
                   side columns become overlay drawers.
                   
                   It was `xl` (1280px), which meant a browser window a little under a
                   common laptop's full width put the sidebar into a drawer the moment
                   the chat opened, even though the three columns would have fitted.
                   This is the ONE place the number lives; `src/hooks/use-sidebar-open.ts`
                   reads it back and `src/test/three-column-breakpoint.test.ts` fails the
                   build if the two ever disagree. */
                rb3col: "1152px",
            },
            /* Point at the stacks in index.css rather than restating them. These
               were duplicated here as literals and had already diverged: index.css
               carried BlinkMacSystemFont / "Segoe UI" / Roboto in --font-sans and
               this list did not, so `font-sans` and the `html` base rule resolved to
               different fallback chains on any machine without Geist. */
            fontFamily: {
                sans: "var(--font-sans)",
                display: "var(--font-display)",
                mono: "var(--font-mono)",
                serif: "var(--font-serif)",
            },
            fontSize: {
                "rb-display": ["var(--rb-text-display)", { lineHeight: "var(--rb-text-display-lh)", letterSpacing: "-0.02em", fontWeight: "600" }],
                "rb-h1": ["var(--rb-text-h1)", { lineHeight: "var(--rb-text-h1-lh)", letterSpacing: "-0.02em", fontWeight: "600" }],
                "rb-h2": ["var(--rb-text-h2)", { lineHeight: "var(--rb-text-h2-lh)", letterSpacing: "-0.015em", fontWeight: "600" }],
                "rb-h3": ["var(--rb-text-h3)", { lineHeight: "var(--rb-text-h3-lh)", letterSpacing: "-0.01em", fontWeight: "600" }],
                "rb-h4": ["var(--rb-text-xl)", { lineHeight: "var(--rb-leading-snug)", letterSpacing: "var(--rb-track-tight)", fontWeight: "600" }],
                "rb-body-lg": ["var(--rb-text-body-lg)", { lineHeight: "var(--rb-text-body-lg-lh)", letterSpacing: "-0.005em", fontWeight: "400" }],
                "rb-body": ["var(--rb-text-body)", { lineHeight: "var(--rb-text-body-lh)", letterSpacing: "0", fontWeight: "400" }],
                "rb-body-sm": ["var(--rb-text-body-sm)", { lineHeight: "var(--rb-text-body-sm-lh)", letterSpacing: "0", fontWeight: "400" }],
                "rb-caption": ["var(--rb-text-caption)", { lineHeight: "var(--rb-text-caption-lh)", letterSpacing: "0.01em", fontWeight: "500" }],
                "rb-code": ["var(--rb-text-code)", { lineHeight: "var(--rb-text-code-lh)", letterSpacing: "-0.01em", fontWeight: "500" }],
                /* The single headline figure on a KPI tile. Display face, tight
                   tracking, set solid so the number reads as the subject of the
                   tile rather than a line of text. Carve-out to chart rule 6 —
                   see the rule's own note: mono is for figures that ALIGN (axis
                   ticks, table cells, tooltips); this one aligns with nothing. */
                "rb-metric": ["var(--rb-metric-size)", { lineHeight: "1", letterSpacing: "-0.03em", fontWeight: "700" }],
                /* Micro-typography ramp — sub-12px tokens used for chrome chips
                   (BETA tag, count pills, cell metadata, kbd hints). Tokenised
                   so designers can rebalance one global setting instead of
                   chasing 50+ `text-[Npx]` arbitrary-value escapes. */
                "rb-micro": ["9px", { lineHeight: "1.2", fontWeight: "500" }],
                "rb-micro-sm": ["10px", { lineHeight: "1.2", fontWeight: "500" }],
                "rb-micro-md": ["10.5px", { lineHeight: "1.25", fontWeight: "500" }],
                "rb-mini": ["11px", { lineHeight: "1.3", fontWeight: "500" }],
                "rb-mini-sm": ["11.5px", { lineHeight: "1.3", fontWeight: "500" }],
                "rb-cell": ["12.5px", { lineHeight: "1.4", fontWeight: "400" }],
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "color-mix(in srgb, var(--ring) calc(<alpha-value> * 100%), transparent)",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "color-mix(in srgb, var(--primary) calc(<alpha-value> * 100%), transparent)",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                icon: {
                    DEFAULT: "hsl(var(--icon))",
                    muted: "hsl(var(--icon-muted))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                sidebar: {
                    DEFAULT: "color-mix(in srgb, var(--sidebar-background) calc(<alpha-value> * 100%), transparent)",
                    foreground: "hsl(var(--sidebar-foreground))",
                    primary: "color-mix(in srgb, var(--sidebar-primary) calc(<alpha-value> * 100%), transparent)",
                    "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
                    accent: "hsl(var(--sidebar-accent))",
                    "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
                    border: "hsl(var(--sidebar-border))",
                    ring: "color-mix(in srgb, var(--sidebar-ring) calc(<alpha-value> * 100%), transparent)",
                },
                chat: {
                    user: "hsl(var(--chat-user-bg))",
                    assistant: "hsl(var(--chat-assistant-bg))",
                    input: "hsl(var(--chat-input-bg))",
                    hover: "hsl(var(--chat-hover))",
                },
                /* Riibon brand palette — direct-access utilities (bg-rb-blue-500, text-rb-ink, …)
                   Every value goes through `rbVar()` (see its docblock), so the canonical
                   hex in index.css is the ONLY definition and every token accepts an
                   opacity modifier. This comment used to say opacity support was wired
                   per scale "as needed", which is what left 22 live classes generating
                   nothing.
        
                   This used to read a parallel `--rb-<name>-hsl` triplet maintained by hand
                   beside the hex — 20 colours each written twice. That was not merely a
                   maintenance risk: the two had already DRIFTED. The yellow-600 triplet
                   resolved to #806A14 while its hex said #806F13, and because
                   check:theme-contrast read the triplet, a real 4.48:1 pairing reported a
                   pass for as long as both existed. Deleting the duplicate is what surfaced
                   it. */
                rb: {
                    blue: {
                        DEFAULT: rbVar("blue"),
                        50: rbVar("blue-50"),
                        100: rbVar("blue-100"),
                        200: rbVar("blue-200"),
                        300: rbVar("blue-300"),
                        400: rbVar("blue-400"),
                        500: rbVar("blue-500"),
                        600: rbVar("blue-600"),
                        700: rbVar("blue-700"),
                        800: rbVar("blue-800"),
                        900: rbVar("blue-900"),
                    },
                    coral: {
                        DEFAULT: rbVar("coral"),
                        50: rbVar("coral-50"),
                        100: rbVar("coral-100"),
                        200: rbVar("coral-200"),
                        300: rbVar("coral-300"),
                        400: rbVar("coral-400"),
                        500: rbVar("coral-500"),
                        600: rbVar("coral-600"),
                        700: rbVar("coral-700"),
                        800: rbVar("coral-800"),
                    },
                    amber: {
                        50: rbVar("amber-50"),
                        100: rbVar("amber-100"),
                        300: rbVar("amber-300"),
                        400: rbVar("amber-400"),
                        500: rbVar("amber-500"),
                        600: rbVar("amber-600"),
                        700: rbVar("amber-700"),
                    },
                    yellow: {
                        DEFAULT: rbVar("yellow"),
                        50: rbVar("yellow-50"),
                        100: rbVar("yellow-100"),
                        200: rbVar("yellow-200"),
                        300: rbVar("yellow-300"),
                        400: rbVar("yellow-400"),
                        500: rbVar("yellow-500"),
                        600: rbVar("yellow-600"),
                    },
                    cream: {
                        DEFAULT: rbVar("cream"),
                        50: rbVar("cream-50"),
                        100: rbVar("cream-100"),
                        200: rbVar("cream-200"),
                        300: rbVar("cream-300"),
                    },
                    ink: {
                        DEFAULT: rbVar("ink"),
                        50: rbVar("neutral-50"),
                        100: rbVar("neutral-100"),
                        200: rbVar("neutral-200"),
                        300: rbVar("neutral-300"),
                        400: rbVar("neutral-400"),
                        500: rbVar("neutral-500"),
                        600: rbVar("neutral-600"),
                        700: rbVar("neutral-700"),
                        800: rbVar("neutral-800"),
                        900: rbVar("neutral-900"),
                        950: rbVar("neutral-950"),
                    },
                    neutral: {
                        0: rbVar("neutral-0"),
                        25: rbVar("neutral-25"),
                        50: rbVar("neutral-50"),
                        100: rbVar("neutral-100"),
                        200: rbVar("neutral-200"),
                        300: rbVar("neutral-300"),
                        400: rbVar("neutral-400"),
                        500: rbVar("neutral-500"),
                        600: rbVar("neutral-600"),
                        700: rbVar("neutral-700"),
                        800: rbVar("neutral-800"),
                        900: rbVar("neutral-900"),
                        950: rbVar("neutral-950"),
                    },
                    forest: {
                        50: rbVar("forest-50"),
                        100: rbVar("forest-100"),
                        300: rbVar("forest-300"),
                        500: rbVar("forest-500"),
                        700: rbVar("forest-700"),
                    },
                    terracotta: {
                        50: rbVar("terracotta-50"),
                        300: rbVar("terracotta-300"),
                        500: rbVar("terracotta-500"),
                        700: rbVar("terracotta-700"),
                    },
                    sage: {
                        100: rbVar("sage-100"),
                        300: rbVar("sage-300"),
                        500: rbVar("sage-500"),
                    },
                    plum: {
                        100: rbVar("plum-100"),
                        300: rbVar("plum-300"),
                        500: rbVar("plum-500"),
                    },
                    ochre: {
                        100: rbVar("ochre-100"),
                        300: rbVar("ochre-300"),
                        500: rbVar("ochre-500"),
                    },
                    success: rbVar("success"),
                    "success-bg": rbVar("success-bg"),
                    "success-border": rbVar("success-border"),
                    "success-strong": rbVar("success-strong"),
                    warning: rbVar("warning"),
                    "warning-bg": rbVar("warning-bg"),
                    "warning-border": rbVar("warning-border"),
                    "warning-strong": rbVar("warning-strong"),
                    error: rbVar("error"),
                    "error-bg": rbVar("error-bg"),
                    "error-border": rbVar("error-border"),
                    "error-strong": rbVar("error-strong"),
                    info: rbVar("info"),
                    "info-bg": rbVar("info-bg"),
                    "info-border": rbVar("info-border"),
                    "info-strong": rbVar("info-strong"),
                    highlight: rbVar("highlight"),
                    "highlight-bg": rbVar("highlight-bg"),
                    "highlight-border": rbVar("highlight-border"),
                    /* Surface tiers */
                    "surface-page": rbVar("surface-page"),
                    "surface-section": rbVar("surface-section"),
                    "surface-card": rbVar("surface-card"),
                    "surface-elevated": rbVar("surface-elevated"),
                    "surface-inline": rbVar("surface-inline"),
                    "surface-ink": rbVar("surface-ink"),
                    /* Border tiers.
          
                       `border` is a NESTED group with a DEFAULT, not the flat string key
                       `"border-DEFAULT"` it used to be. That spelling is not the DEFAULT
                       convention — Tailwind read it as a colour literally named
                       "border-DEFAULT" and generated `border-rb-border-DEFAULT`, a class
                       nobody writes. So `border-rb-border` — 758 usages, the most-used
                       colour class in the app — generated NO CSS for its whole life.
          
                       It was invisible because shadcn's base layer paints `* { @apply
                       border-border }` from `--border`, which is a different token: in
                       light mode `--border` is neutral-100 and `--rb-border` is
                       neutral-200, so every border in the app rendered one step lighter
                       than the token every component asked for. Close enough to look
                       deliberate, which is why it survived. */
                    border: {
                        DEFAULT: rbVar("border"),
                        subtle: rbVar("border-subtle"),
                        strong: rbVar("border-strong"),
                    },
                    /* Chart chrome tokens (Recharts grid/axis/tooltip) */
                    "grid": rbVar("grid"),
                    "axis": rbVar("axis"),
                    "tooltip-bg": rbVar("tooltip-bg"),
                    "tooltip-fg": rbVar("tooltip-fg"),
                    /* Text tiers */
                    "text-primary": rbVar("text-primary"),
                    "text-secondary": rbVar("text-secondary"),
                    "text-tertiary": rbVar("text-tertiary"),
                    "text-inverse": rbVar("text-inverse"),
                    "text-on-ink": rbVar("text-on-ink"),
                    "text-accent": rbVar("text-accent"),
                    "text-placeholder": rbVar("text-placeholder"),
                    /* Sequential viz ramp */
                    "seq-100": rbVar("seq-100"),
                    "seq-200": rbVar("seq-200"),
                    "seq-300": rbVar("seq-300"),
                    "seq-400": rbVar("seq-400"),
                    "seq-500": rbVar("seq-500"),
                    "seq-600": rbVar("seq-600"),
                    "seq-700": rbVar("seq-700"),
                    /* Diverging viz ramp */
                    "div-neg-3": rbVar("div-neg-3"),
                    "div-neg-2": rbVar("div-neg-2"),
                    "div-neg-1": rbVar("div-neg-1"),
                    "div-0": rbVar("div-0"),
                    "div-pos-1": rbVar("div-pos-1"),
                    "div-pos-2": rbVar("div-pos-2"),
                    "div-pos-3": rbVar("div-pos-3"),
                    /* Categorical viz */
                    "viz-1": rbVar("viz-1"),
                    "viz-2": rbVar("viz-2"),
                    "viz-3": rbVar("viz-3"),
                    "viz-4": rbVar("viz-4"),
                    "viz-5": rbVar("viz-5"),
                    "viz-6": rbVar("viz-6"),
                    "viz-7": rbVar("viz-7"),
                    "viz-8": rbVar("viz-8"),
                },
            },
            boxShadow: {
                "rb-xs": "var(--rb-shadow-xs)",
                "rb-sm": "var(--rb-shadow-sm)",
                "rb-md": "var(--rb-shadow-md)",
                "rb-lg": "var(--rb-shadow-lg)",
                "rb-xl": "var(--rb-shadow-xl)",
                "rb-ring": "var(--rb-ring)",
                /* Offset hard-shadow — marketing-register brand element (D4). */
                "rb-offset-lg": "var(--rb-shadow-offset-lg)",
                "rb-offset-sm": "var(--rb-shadow-offset-sm)",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
                "rb-xs": "var(--rb-radius-xs)",
                "rb-sm": "var(--rb-radius-sm)",
                "rb-md": "var(--rb-radius-md)",
                "rb-lg": "var(--rb-radius-lg)",
                "rb-xl": "var(--rb-radius-xl)",
                "rb-2xl": "var(--rb-radius-2xl)",
                "rb-pill": "var(--rb-radius-pill)",
                /* The card radius. Density preset B — see the DENSITY block in
                   src/index.css. Every card-like surface uses this, not a step
                   off the generic scale. */
                "rb-card": "var(--rb-card-radius)",
                "rb-control": "var(--rb-control-radius)",
            },
            height: {
                "rb-control": "var(--rb-control-h)",
            },
            minHeight: {
                "rb-control": "var(--rb-control-h)",
            },
            width: {
                "rb-control": "var(--rb-control-h)",
            },
            spacing: {
                "rb-0": "var(--rb-space-0)",
                "rb-1": "var(--rb-space-1)",
                "rb-2": "var(--rb-space-2)",
                "rb-3": "var(--rb-space-3)",
                "rb-4": "var(--rb-space-4)",
                "rb-5": "var(--rb-space-5)",
                "rb-6": "var(--rb-space-6)",
                "rb-7": "var(--rb-space-7)",
                "rb-8": "var(--rb-space-8)",
                "rb-9": "var(--rb-space-9)",
                "rb-10": "var(--rb-space-10)",
                "rb-12": "var(--rb-space-12)",
                "rb-16": "var(--rb-space-16)",
                /* Density preset B — see the DENSITY block in src/index.css. */
                "rb-card-y": "var(--rb-card-pad-y)",
                "rb-card-x": "var(--rb-card-pad-x)",
                "rb-card-gap": "var(--rb-card-gap)",
                "rb-row-y": "var(--rb-row-pad-y)",
                "rb-control": "var(--rb-control-px)",
            },
            transitionTimingFunction: {
                rb: "var(--rb-ease)",
                "rb-in": "var(--rb-ease-in)",
                "rb-out": "var(--rb-ease-out)",
                "rb-in-out": "var(--rb-ease-in-out)",
            },
            transitionDuration: {
                "rb-fast": "var(--rb-dur-fast)",
                "rb-base": "var(--rb-dur-base)",
                "rb-slow": "var(--rb-dur-slow)",
                "rb-slower": "var(--rb-dur-slower)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "rb-pulse": {
                    "0%, 100%": { opacity: "0.3" },
                    "50%": { opacity: "1" },
                },
                "rb-blink": {
                    "0%, 49%": { opacity: "1" },
                    "50%, 100%": { opacity: "0" },
                },
                "rb-slide-up": {
                    from: { transform: "translateY(6px)", opacity: "0" },
                    to: { transform: "translateY(0)", opacity: "1" },
                },
                "rb-slide-left": {
                    from: { transform: "translateX(18px)", opacity: "0" },
                    to: { transform: "translateX(0)", opacity: "1" },
                },
                "rb-fade-in": {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
                "rb-scan": {
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(200%)" },
                },
                "rb-grow": {
                    from: { transform: "scaleY(0)" },
                    to: { transform: "scaleY(1)" },
                },
                "rb-marquee": {
                    from: { transform: "translateX(0)" },
                    to: { transform: "translateX(-50%)" },
                },
                "rb-shimmer": {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
                "rb-fade-up": {
                    from: { opacity: "0", transform: "translateY(6px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "rb-pulse": "rb-pulse 1.4s var(--rb-ease) infinite",
                "rb-blink": "rb-blink 1s steps(1) infinite",
                "rb-slide-up": "rb-slide-up 0.3s var(--rb-ease) both",
                "rb-slide-left": "rb-slide-left 0.3s var(--rb-ease) both",
                "rb-fade-in": "rb-fade-in 0.3s var(--rb-ease) both",
                "rb-scan": "rb-scan 1.6s var(--rb-ease) infinite",
                "rb-grow": "rb-grow 0.3s var(--rb-ease) both",
                "rb-marquee": "rb-marquee 24s linear infinite",
                "rb-shimmer": "rb-shimmer 1.4s linear infinite",
                "rb-fade-up": "rb-fade-up 0.4s var(--rb-ease-out) both",
            },
        },
    },
    plugins: [tailwindcssAnimate, containerQueries],
};
