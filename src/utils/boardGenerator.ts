import { BoardShape } from "../models/BoardArea";

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
    } else {
        pathLengthMm =
            2 * (boardWidthMm + boardHeightMm);
    }

    return Math.min(
        18,
        (pathLengthMm / fieldCount) * 0.7
    );
}

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
            (i / fieldCount) *
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
        2 * (pathWidth + pathHeight);

    for (
        let i = 0;
        i < fieldCount;
        i++
    ) {
        let distance =
            (i / fieldCount) *
            perimeter;

        let x: number;
        let y: number;

        // Top
        if (
            distance <= pathWidth
        ) {
            x =
                inset +
                distance;

            y = inset;
        }

        // Right
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

        // Bottom
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

        // Left
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

export function calculateSnakeFieldSize({
    boardWidthMm,
    boardHeightMm,
    fieldCount,
}: GenerateFieldsOptions): number {
    if (fieldCount <= 0) {
        return 0;
    }

    const aspectRatio =
        boardWidthMm / boardHeightMm;

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
            fieldCount / columns
        );

    const cellWidth =
        boardWidthMm / columns;

    const cellHeight =
        boardHeightMm / rows;

    return Math.min(
        18,
        cellWidth * 0.65,
        cellHeight * 0.65
    );
}

export function generateSnakeFields({
    boardWidthMm,
    boardHeightMm,
    fieldCount,
}: GenerateFieldsOptions): FieldPosition[] {
    if (fieldCount <= 0) {
        return [];
    }

    const aspectRatio =
        boardWidthMm / boardHeightMm;

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
            fieldCount / columns
        );

    const cellWidth =
        boardWidthMm / columns;

    const cellHeight =
        boardHeightMm / rows;

    const positions: FieldPosition[] = [];

    for (
        let i = 0;
        i < fieldCount;
        i++
    ) {
        const row =
            Math.floor(i / columns);

        const positionInRow =
            i % columns;

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