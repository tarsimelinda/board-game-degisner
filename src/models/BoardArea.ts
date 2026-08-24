export type BoardShape =
    | "full-page"
    | "safe-page"
    | "square"
    | "circle"
    | "custom";

export interface BoardArea {
    shape: BoardShape;

    x: number;
    y: number;

    width: number;
    height: number;
}