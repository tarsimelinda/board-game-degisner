export type FieldShape =
    | "circle"
    | "square"
    | "diamond"
    | "heart";

export interface BoardField {
    id: string;

    x: number;
    y: number;

    width: number;
    height: number;

    shape: FieldShape;

    rotation: number;

    backgroundColor: string;
}