import * as React from "react";
type SpacerSize = "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10" | "12" | "16";
export interface SpacerProps {
    size?: SpacerSize;
    axis?: "vertical" | "horizontal";
    /** Push siblings to opposite ends (flex-grow). Use inside Stack/Cluster. */
    flex?: boolean;
    className?: string;
}
/** Whitespace primitive. Prefer Stack/Cluster `gap` over Spacer; reach for this when one item must push apart from another. */
export declare function Spacer({ size, axis, flex, className }: SpacerProps): React.JSX.Element;
export {};
