import { BoardLayout } from "../models/BoardLayout";
import { BoardShape } from "../models/BoardArea";

export type LayoutSettingsType =
    | "manual-fields"
    | "grid"
    | "monopoly"
    | "none";

interface LayoutConfig {
    label: string;

    allowedShapes: BoardShape[];

    settingsType: LayoutSettingsType;

    canShowFieldNumbers: boolean;
}

export const LAYOUT_CONFIG:
    Record<BoardLayout, LayoutConfig> = {

    perimeter: {
        label: "Perimeter",

        allowedShapes: [
            "rectangle",
            "square",
            "circle",
        ],

        settingsType:
            "manual-fields",

        canShowFieldNumbers:
            true,
    },

    snake: {
        label: "Snake",

        allowedShapes: [
            "rectangle",
            "square",
        ],

        settingsType:
            "manual-fields",

        canShowFieldNumbers:
            true,
    },

    "square-grid": {
        label: "Square Grid",

        allowedShapes: [
            "rectangle",
            "square",
            "circle",
        ],

        settingsType:
            "grid",

        canShowFieldNumbers:
            true,
    },

    "monopoly-ring": {
        label: "Monopoly Ring",

        allowedShapes: [
            "rectangle",
            "square",
        ],

        settingsType:
            "monopoly",

        canShowFieldNumbers:
            true,
    },

    "mill-board": {
        label: "Mill Board",

        allowedShapes: [
            "square",
        ],

        settingsType:
            "none",

        canShowFieldNumbers:
            false,
    },

    "tic-tac-toe": {
        label: "Tic-Tac-Toe",

        allowedShapes: [
            "square",
        ],

        settingsType:
            "none",

        canShowFieldNumbers:
            false,
    },
};