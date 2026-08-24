import { BoardArea } from "./BoardArea";
import { BoardField } from "./BoardField";

export type PaperSize = "A4" | "A3";
export type Orientation = "portrait" | "landscape";

export interface BoardProject {
    id: string;
    name: string;

    page: {
        size: PaperSize;
        orientation: Orientation;
    };

    board: BoardArea;

    fields: BoardField[];
}