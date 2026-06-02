import * as React from "react";
type ContainerSize = "narrow" | "default" | "wide" | "full";
type ContainerPadding = "none" | "page";
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: ContainerSize;
    padding?: ContainerPadding;
}
/** Centered max-width wrapper. Use at the top of any page-level layout. */
export declare const Container: React.ForwardRefExoticComponent<ContainerProps & React.RefAttributes<HTMLDivElement>>;
export {};
