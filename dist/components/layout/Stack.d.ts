import * as React from "react";
type StackGap = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10" | "12";
type StackAlign = "start" | "center" | "end" | "stretch";
type StackJustify = "start" | "center" | "end" | "between" | "around";
export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
    gap?: StackGap;
    align?: StackAlign;
    justify?: StackJustify;
    asChild?: boolean;
    as?: keyof JSX.IntrinsicElements;
}
/** Vertical layout primitive — children stack column-wise with consistent spacing. */
export declare const Stack: React.ForwardRefExoticComponent<StackProps & React.RefAttributes<HTMLDivElement>>;
export {};
