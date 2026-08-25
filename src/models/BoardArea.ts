export type BoardShape =
    | "rectangle"
    | "square"
    | "circle";

export interface BoardArea {
    shape: BoardShape;

    x: number;
    y: number;

    width: number;
    height: number;
}