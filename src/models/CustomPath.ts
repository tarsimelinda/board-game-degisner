export interface PathPoint {
    x: number;
    y: number;
}

export interface CustomPathRoute {
    points: PathPoint[];
}

export type CustomPathDistribution =
    | "spaced"
    | "continuous";