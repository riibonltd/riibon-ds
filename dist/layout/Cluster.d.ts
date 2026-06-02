import * as React from "react";
type ClusterGap = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8";
type ClusterAlign = "start" | "center" | "end" | "baseline";
type ClusterJustify = "start" | "center" | "end" | "between";
export interface ClusterProps extends React.HTMLAttributes<HTMLDivElement> {
    gap?: ClusterGap;
    align?: ClusterAlign;
    justify?: ClusterJustify;
    wrap?: boolean;
}
/** Horizontal layout primitive — children flow row-wise, wrapping by default. */
export declare const Cluster: React.ForwardRefExoticComponent<ClusterProps & React.RefAttributes<HTMLDivElement>>;
export {};
