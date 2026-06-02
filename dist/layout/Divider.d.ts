import * as React from "react";
export interface DividerProps {
    orientation?: "horizontal" | "vertical";
    /** Decorative dividers are hidden from assistive tech; semantic ones get role="separator". */
    decorative?: boolean;
    className?: string;
}
/** Thin rule, defaults to a horizontal line in the border colour token. */
export declare function Divider({ orientation, decorative, className }: DividerProps): React.JSX.Element;
