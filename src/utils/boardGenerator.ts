import { BoardShape } from "../models/BoardArea";

import {
    GridPreset,
    GRID_PRESET_SIZE,
} from "../models/GridPreset";


// =====================================================
// COMMON TYPES
// =====================================================

export interface FieldPosition {
    x: number;
    y: number;
}

interface GenerateFieldsOptions {
    boardWidthMm: number;
    boardHeightMm: number;
    boardShape: BoardShape;
    fieldCount: number;
}


// =====================================================
// PERIMETER FIELD SIZE
// =====================================================

export function calculateFieldSize({
    boardWidthMm,
    boardHeightMm,
    boardShape,
    fieldCount,
}: GenerateFieldsOptions): number {
    if (fieldCount <= 0) {
        return 0;
    }

    let pathLengthMm: number;

    if (boardShape === "circle") {
        pathLengthMm =
            Math.PI * boardWidthMm;
    }
    else {
        pathLengthMm =
            2 * (
                boardWidthMm +
                boardHeightMm
            );
    }

    return Math.min(
        18,
        (
            pathLengthMm /
            fieldCount
        ) * 0.7
    );
}


// =====================================================
// PERIMETER GENERATION
// =====================================================

export function generatePerimeterFields({
    boardWidthMm,
    boardHeightMm,
    boardShape,
    fieldCount,
}: GenerateFieldsOptions): FieldPosition[] {
    if (fieldCount <= 0) {
        return [];
    }

    const fieldSizeMm =
        calculateFieldSize({
            boardWidthMm,
            boardHeightMm,
            boardShape,
            fieldCount,
        });

    if (fieldSizeMm <= 0) {
        return [];
    }

    if (boardShape === "circle") {
        return generateCircleFields(
            boardWidthMm,
            boardHeightMm,
            fieldCount,
            fieldSizeMm
        );
    }

    return generateRectangleFields(
        boardWidthMm,
        boardHeightMm,
        fieldCount,
        fieldSizeMm
    );
}


// =====================================================
// CIRCLE PERIMETER
// =====================================================

function generateCircleFields(
    boardWidthMm: number,
    boardHeightMm: number,
    fieldCount: number,
    fieldSizeMm: number
): FieldPosition[] {
    const positions: FieldPosition[] = [];

    const centerX =
        boardWidthMm / 2;

    const centerY =
        boardHeightMm / 2;

    const radius =
        (
            Math.min(
                boardWidthMm,
                boardHeightMm
            ) -
            fieldSizeMm
        ) / 2;

    for (
        let i = 0;
        i < fieldCount;
        i++
    ) {
        const angle =
            (
                i /
                fieldCount
            ) *
            Math.PI *
            2 -
            Math.PI / 2;

        positions.push({
            x:
                centerX +
                Math.cos(angle) *
                radius,

            y:
                centerY +
                Math.sin(angle) *
                radius,
        });
    }

    return positions;
}


// =====================================================
// RECTANGLE PERIMETER
// =====================================================

function generateRectangleFields(
    boardWidthMm: number,
    boardHeightMm: number,
    fieldCount: number,
    fieldSizeMm: number
): FieldPosition[] {
    const positions: FieldPosition[] = [];

    const inset =
        fieldSizeMm / 2;

    const pathWidth =
        boardWidthMm -
        fieldSizeMm;

    const pathHeight =
        boardHeightMm -
        fieldSizeMm;

    const perimeter =
        2 * (
            pathWidth +
            pathHeight
        );

    for (
        let i = 0;
        i < fieldCount;
        i++
    ) {
        let distance =
            (
                i /
                fieldCount
            ) *
            perimeter;

        let x: number;
        let y: number;

        // TOP
        if (
            distance <=
            pathWidth
        ) {
            x =
                inset +
                distance;

            y = inset;
        }

        // RIGHT
        else if (
            distance <=
            pathWidth +
            pathHeight
        ) {
            distance -=
                pathWidth;

            x =
                boardWidthMm -
                inset;

            y =
                inset +
                distance;
        }

        // BOTTOM
        else if (
            distance <=
            pathWidth * 2 +
            pathHeight
        ) {
            distance -=
                pathWidth +
                pathHeight;

            x =
                boardWidthMm -
                inset -
                distance;

            y =
                boardHeightMm -
                inset;
        }

        // LEFT
        else {
            distance -=
                pathWidth * 2 +
                pathHeight;

            x = inset;

            y =
                boardHeightMm -
                inset -
                distance;
        }

        positions.push({
            x,
            y,
        });
    }

    return positions;
}


// =====================================================
// SNAKE FIELD SIZE
// =====================================================

export function calculateSnakeFieldSize({
    boardWidthMm,
    boardHeightMm,
    fieldCount,
}: GenerateFieldsOptions): number {
    if (fieldCount <= 0) {
        return 0;
    }

    const aspectRatio =
        boardWidthMm /
        boardHeightMm;

    const columns =
        Math.max(
            1,
            Math.ceil(
                Math.sqrt(
                    fieldCount *
                    aspectRatio
                )
            )
        );

    const rows =
        Math.ceil(
            fieldCount /
            columns
        );

    const cellWidth =
        boardWidthMm /
        columns;

    const cellHeight =
        boardHeightMm /
        rows;

    return Math.min(
        18,
        cellWidth * 0.65,
        cellHeight * 0.65
    );
}


// =====================================================
// SNAKE GENERATION
// =====================================================

export function generateSnakeFields({
    boardWidthMm,
    boardHeightMm,
    fieldCount,
}: GenerateFieldsOptions): FieldPosition[] {
    if (fieldCount <= 0) {
        return [];
    }

    const aspectRatio =
        boardWidthMm /
        boardHeightMm;

    const columns =
        Math.max(
            1,
            Math.ceil(
                Math.sqrt(
                    fieldCount *
                    aspectRatio
                )
            )
        );

    const rows =
        Math.ceil(
            fieldCount /
            columns
        );

    const cellWidth =
        boardWidthMm /
        columns;

    const cellHeight =
        boardHeightMm /
        rows;

    const positions:
        FieldPosition[] = [];

    for (
        let i = 0;
        i < fieldCount;
        i++
    ) {
        const row =
            Math.floor(
                i /
                columns
            );

        const positionInRow =
            i %
            columns;

        const isReverseRow =
            row % 2 === 1;

        const column =
            isReverseRow
                ? columns -
                1 -
                positionInRow
                : positionInRow;

        const x =
            column *
            cellWidth +
            cellWidth / 2;

        const y =
            row *
            cellHeight +
            cellHeight / 2;

        positions.push({
            x,
            y,
        });
    }

    return positions;
}


// =====================================================
// SQUARE GRID
// =====================================================

interface GenerateSquareGridOptions {
    boardWidthMm: number;
    boardHeightMm: number;
    preset: GridPreset;
}

export interface SquareGridResult {
    positions: FieldPosition[];
    fieldSizeMm: number;
    rows: number;
    columns: number;
}

export function generateSquareGrid({
    boardWidthMm,
    boardHeightMm,
    preset,
}: GenerateSquareGridOptions): SquareGridResult {
    const baseGridSize =
        GRID_PRESET_SIZE[preset];

    /*
     * A rövidebb oldalon:
     *
     * Large  = 5 mező
     * Medium = 8 mező
     * Small  = 13 mező
     */
    const shorterSide =
        Math.min(
            boardWidthMm,
            boardHeightMm
        );

    const fieldSizeMm =
        shorterSide /
        baseGridSize;

    let columns: number;
    let rows: number;

    /*
     * Álló Rectangle vagy Square:
     *
     * pl. 195 × 282
     *
     * Medium:
     * 8 oszlop
     * 11 sor
     */
    if (
        boardWidthMm <=
        boardHeightMm
    ) {
        columns =
            baseGridSize;

        rows =
            Math.floor(
                boardHeightMm /
                fieldSizeMm
            );
    }

    /*
     * Fekvő Rectangle:
     *
     * pl. 282 × 195
     *
     * Medium:
     * 11 oszlop
     * 8 sor
     */
    else {
        rows =
            baseGridSize;

        columns =
            Math.floor(
                boardWidthMm /
                fieldSizeMm
            );
    }

    const gridWidth =
        columns *
        fieldSizeMm;

    const gridHeight =
        rows *
        fieldSizeMm;

    /*
     * A maradék hely mindig
     * szimmetrikusan oszlik el.
     */
    const offsetX =
        (
            boardWidthMm -
            gridWidth
        ) / 2;

    const offsetY =
        (
            boardHeightMm -
            gridHeight
        ) / 2;

    const positions:
        FieldPosition[] = [];

    for (
        let row = 0;
        row < rows;
        row++
    ) {
        for (
            let column = 0;
            column < columns;
            column++
        ) {
            positions.push({
                x:
                    offsetX +
                    column *
                    fieldSizeMm +
                    fieldSizeMm / 2,

                y:
                    offsetY +
                    row *
                    fieldSizeMm +
                    fieldSizeMm / 2,
            });
        }
    }

    return {
        positions,
        fieldSizeMm,
        rows,
        columns,
    };
}