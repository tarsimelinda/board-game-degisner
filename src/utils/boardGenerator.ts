import { BoardShape } from "../models/BoardArea";

import { PathPoint } from "../models/CustomPath";

import {
    GridPreset,
    GRID_PRESET_SIZE,
} from "../models/GridPreset";

export interface FieldPosition {
    x: number;
    y: number;

    angle?: number;
}
export interface FieldGeometry {
    x: number;
    y: number;

    width: number;
    height: number;
}

export interface LineSegment {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export interface MillBoardResult {
    points: FieldPosition[];
    lines: LineSegment[];
    pointSizeMm: number;
}

interface GenerateFieldsOptions {
    boardWidthMm: number;
    boardHeightMm: number;
    boardShape: BoardShape;
    fieldCount: number;
}

export interface TicTacToeBoardResult {
    lines: LineSegment[];
}

export interface ContinuousPathField {
    x: number;
    y: number;
    angle: number;
}

export interface ContinuousPathResult {
    fields: ContinuousPathField[];
    dividers: LineSegment[];
    fieldLengthMm: number;
}

interface GenerateContinuousPathOptions {
    points: PathPoint[];
    fieldCount: number;
    pathWidthMm: number;
}

export function generateContinuousPath({
    points,
    fieldCount,
    pathWidthMm,
}: GenerateContinuousPathOptions): ContinuousPathResult {
    if (
        points.length < 2 ||
        fieldCount < 1 ||
        pathWidthMm <= 0
    ) {
        return {
            fields: [],
            dividers: [],
            fieldLengthMm: 0,
        };
    }

    const totalLength =
        calculatePathLength(
            points
        );

    if (totalLength <= 0) {
        return {
            fields: [],
            dividers: [],
            fieldLengthMm: 0,
        };
    }

    const fieldLengthMm =
        totalLength /
        fieldCount;

    const fields:
        ContinuousPathField[] = [];

    const dividers:
        LineSegment[] = [];

    for (
        let i = 0;
        i < fieldCount;
        i++
    ) {
        const distance =
            (
                i + 0.5
            ) *
            fieldLengthMm;

        const sample =
            getPathSampleAtDistance(
                points,
                distance
            );

        if (sample) {
            fields.push({
                x:
                    sample.x,

                y:
                    sample.y,

                angle:
                    sample.angle,
            });
        }
    }

    for (
        let i = 1;
        i < fieldCount;
        i++
    ) {
        const distance =
            i *
            fieldLengthMm;

        const sample =
            getPathSampleAtDistance(
                points,
                distance
            );

        if (!sample) {
            continue;
        }

        const normalAngle =
            sample.angle +
            Math.PI / 2;

        const halfWidth =
            pathWidthMm / 2;

        const offsetX =
            Math.cos(
                normalAngle
            ) *
            halfWidth;

        const offsetY =
            Math.sin(
                normalAngle
            ) *
            halfWidth;

        dividers.push({
            x1:
                sample.x -
                offsetX,

            y1:
                sample.y -
                offsetY,

            x2:
                sample.x +
                offsetX,

            y2:
                sample.y +
                offsetY,
        });
    }

    return {
        fields,
        dividers,
        fieldLengthMm,
    };
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

        if (
            distance <=
            pathWidth
        ) {
            x =
                inset +
                distance;

            y = inset;
        }

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

interface GenerateCircleGridOptions {
    boardWidthMm: number;
    boardHeightMm: number;
    preset: GridPreset;
}

export function generateCircleGrid({
    boardWidthMm,
    boardHeightMm,
    preset,
}: GenerateCircleGridOptions): SquareGridResult {
    const baseGridSize =
        GRID_PRESET_SIZE[preset];

    const diameter =
        Math.min(
            boardWidthMm,
            boardHeightMm
        );

    const radius =
        diameter / 2;

    const fieldSizeMm =
        diameter / baseGridSize;

    const centerX =
        boardWidthMm / 2;

    const centerY =
        boardHeightMm / 2;

    const positions: FieldPosition[] = [];

    for (
        let row = 0;
        row < baseGridSize;
        row++
    ) {
        for (
            let column = 0;
            column < baseGridSize;
            column++
        ) {
            const x =
                column * fieldSizeMm +
                fieldSizeMm / 2;

            const y =
                row * fieldSizeMm +
                fieldSizeMm / 2;

            const half =
                fieldSizeMm / 2;

            const corners = [
                {
                    x: x - half,
                    y: y - half,
                },
                {
                    x: x + half,
                    y: y - half,
                },
                {
                    x: x - half,
                    y: y + half,
                },
                {
                    x: x + half,
                    y: y + half,
                },
            ];

            const fitsInsideCircle =
                corners.every((corner) => {
                    const dx =
                        corner.x -
                        centerX;

                    const dy =
                        corner.y -
                        centerY;

                    const distanceSquared =
                        dx * dx +
                        dy * dy;

                    return (
                        distanceSquared <=
                        radius * radius
                    );
                });

            if (fitsInsideCircle) {
                positions.push({
                    x,
                    y,
                });
            }
        }
    }

    return {
        positions,
        fieldSizeMm,
        rows: baseGridSize,
        columns: baseGridSize,
    };
}

interface GenerateMonopolyRingOptions {
    boardWidthMm: number;
    boardHeightMm: number;

    horizontalFields: number;
    verticalFields: number;

    fieldDepthMm: number;
}

export function generateMonopolyRing({
    boardWidthMm,
    boardHeightMm,
    horizontalFields,
    verticalFields,
    fieldDepthMm,
}: GenerateMonopolyRingOptions): FieldGeometry[] {
    if (
        horizontalFields <= 0 ||
        verticalFields <= 0
    ) {
        return [];
    }

    const maxDepth =
        Math.min(
            boardWidthMm,
            boardHeightMm
        ) / 2 - 0.01;

    const depth =
        Math.min(
            fieldDepthMm,
            maxDepth
        );

    const horizontalFieldWidth =
        (
            boardWidthMm -
            2 * depth
        ) /
        horizontalFields;

    const verticalFieldHeight =
        (
            boardHeightMm -
            2 * depth
        ) /
        verticalFields;

    const fields: FieldGeometry[] = [];

    fields.push({
        x:
            boardWidthMm -
            depth / 2,

        y:
            boardHeightMm -
            depth / 2,

        width: depth,
        height: depth,
    });

    for (
        let i = 0;
        i < horizontalFields;
        i++
    ) {
        fields.push({
            x:
                boardWidthMm -
                depth -
                (
                    i + 0.5
                ) *
                horizontalFieldWidth,

            y:
                boardHeightMm -
                depth / 2,

            width:
                horizontalFieldWidth,

            height:
                depth,
        });
    }

    fields.push({
        x:
            depth / 2,

        y:
            boardHeightMm -
            depth / 2,

        width:
            depth,

        height:
            depth,
    });

    for (
        let i = 0;
        i < verticalFields;
        i++
    ) {
        fields.push({
            x:
                depth / 2,

            y:
                boardHeightMm -
                depth -
                (
                    i + 0.5
                ) *
                verticalFieldHeight,

            width:
                depth,

            height:
                verticalFieldHeight,
        });
    }

    fields.push({
        x:
            depth / 2,

        y:
            depth / 2,

        width:
            depth,

        height:
            depth,
    });

    for (
        let i = 0;
        i < horizontalFields;
        i++
    ) {
        fields.push({
            x:
                depth +
                (
                    i + 0.5
                ) *
                horizontalFieldWidth,

            y:
                depth / 2,

            width:
                horizontalFieldWidth,

            height:
                depth,
        });
    }

    fields.push({
        x:
            boardWidthMm -
            depth / 2,

        y:
            depth / 2,

        width:
            depth,

        height:
            depth,
    });

    for (
        let i = 0;
        i < verticalFields;
        i++
    ) {
        fields.push({
            x:
                boardWidthMm -
                depth / 2,

            y:
                depth +
                (
                    i + 0.5
                ) *
                verticalFieldHeight,

            width:
                depth,

            height:
                verticalFieldHeight,
        });
    }

    return fields;
}

interface GenerateMillBoardOptions {
    boardWidthMm: number;
    boardHeightMm: number;
}

export function generateMillBoard({
    boardWidthMm,
    boardHeightMm,
}: GenerateMillBoardOptions): MillBoardResult {
    const size =
        Math.min(
            boardWidthMm,
            boardHeightMm
        );

    const center =
        size / 2;

    const outerInset =
        size * 0.08;

    const middleInset =
        size * 0.24;

    const innerInset =
        size * 0.40;

    const pointSizeMm =
        Math.max(
            6,
            size * 0.035
        );

    const squarePoints = (
        inset: number
    ): FieldPosition[] => {
        const min = inset;
        const max = size - inset;
        const mid = center;

        return [
            { x: min, y: min },
            { x: mid, y: min },
            { x: max, y: min },

            { x: max, y: mid },
            { x: max, y: max },

            { x: mid, y: max },
            { x: min, y: max },

            { x: min, y: mid },
        ];
    };

    const outerPoints =
        squarePoints(outerInset);

    const middlePoints =
        squarePoints(middleInset);

    const innerPoints =
        squarePoints(innerInset);

    const points = [
        ...outerPoints,
        ...middlePoints,
        ...innerPoints,
    ];

    const squareLines = (
        inset: number
    ): LineSegment[] => {
        const min = inset;
        const max = size - inset;

        return [
            {
                x1: min,
                y1: min,
                x2: max,
                y2: min,
            },
            {
                x1: max,
                y1: min,
                x2: max,
                y2: max,
            },
            {
                x1: max,
                y1: max,
                x2: min,
                y2: max,
            },
            {
                x1: min,
                y1: max,
                x2: min,
                y2: min,
            },
        ];
    };

    const lines: LineSegment[] = [
        ...squareLines(outerInset),
        ...squareLines(middleInset),
        ...squareLines(innerInset),

        {
            x1: center,
            y1: outerInset,
            x2: center,
            y2: middleInset,
        },
        {
            x1: center,
            y1: size - outerInset,
            x2: center,
            y2: size - middleInset,
        },
        {
            x1: center,
            y1: middleInset,
            x2: center,
            y2: innerInset,
        },
        {
            x1: center,
            y1: size - middleInset,
            x2: center,
            y2: size - innerInset,
        },

        {
            x1: outerInset,
            y1: center,
            x2: middleInset,
            y2: center,
        },
        {
            x1: size - outerInset,
            y1: center,
            x2: size - middleInset,
            y2: center,
        },
        {
            x1: middleInset,
            y1: center,
            x2: innerInset,
            y2: center,
        },
        {
            x1: size - middleInset,
            y1: center,
            x2: size - innerInset,
            y2: center,
        },
    ];

    return {
        points,
        lines,
        pointSizeMm,
    };
}

interface GenerateTicTacToeBoardOptions {
    boardWidthMm: number;
    boardHeightMm: number;
}

export function generateTicTacToeBoard({
    boardWidthMm,
    boardHeightMm,
}: GenerateTicTacToeBoardOptions): TicTacToeBoardResult {
    const size =
        Math.min(
            boardWidthMm,
            boardHeightMm
        );

    const oneThird =
        size / 3;

    const twoThirds =
        oneThird * 2;

    const lines: LineSegment[] = [
        {
            x1: oneThird,
            y1: 0,
            x2: oneThird,
            y2: size,
        },

        {
            x1: twoThirds,
            y1: 0,
            x2: twoThirds,
            y2: size,
        },

        {
            x1: 0,
            y1: oneThird,
            x2: size,
            y2: oneThird,
        },

        {
            x1: 0,
            y1: twoThirds,
            x2: size,
            y2: twoThirds,
        },
    ];

    return {
        lines,
    };
}

interface GenerateFieldsAlongPathOptions {
    points: PathPoint[];
    fieldCount: number;
}

export function generateFieldsAlongPath({
    points,
    fieldCount,
}: GenerateFieldsAlongPathOptions): FieldPosition[] {
    if (
        points.length < 2 ||
        fieldCount < 2
    ) {
        return [];
    }

    const segments: {
        start: PathPoint;
        end: PathPoint;
        length: number;
    }[] = [];

    let totalLength = 0;

    for (
        let i = 0;
        i < points.length - 1;
        i++
    ) {
        const start =
            points[i];

        const end =
            points[i + 1];

        const dx =
            end.x - start.x;

        const dy =
            end.y - start.y;

        const length =
            Math.hypot(
                dx,
                dy
            );

        if (length <= 0.001) {
            continue;
        }

        segments.push({
            start,
            end,
            length,
        });

        totalLength +=
            length;
    }

    if (
        segments.length === 0 ||
        totalLength === 0
    ) {
        return [];
    }

    const fields:
        FieldPosition[] = [];

    const spacing =
        totalLength /
        (fieldCount - 1);

    let currentSegmentIndex = 0;
    let distanceBeforeSegment = 0;

    for (
        let fieldIndex = 0;
        fieldIndex < fieldCount;
        fieldIndex++
    ) {
        const targetDistance =
            Math.min(
                fieldIndex * spacing,
                totalLength
            );

        while (
            currentSegmentIndex <
            segments.length - 1 &&
            distanceBeforeSegment +
            segments[currentSegmentIndex].length <
            targetDistance
        ) {
            distanceBeforeSegment +=
                segments[
                    currentSegmentIndex
                ].length;

            currentSegmentIndex++;
        }

        const segment =
            segments[
            currentSegmentIndex
            ];

        const distanceInsideSegment =
            targetDistance -
            distanceBeforeSegment;

        const ratio =
            Math.min(
                1,
                distanceInsideSegment /
                segment.length
            );

        const angle =
            Math.atan2(
                segment.end.y -
                segment.start.y,

                segment.end.x -
                segment.start.x
            );

        fields.push({
            x:
                segment.start.x +
                (
                    segment.end.x -
                    segment.start.x
                ) *
                ratio,

            y:
                segment.start.y +
                (
                    segment.end.y -
                    segment.start.y
                ) *
                ratio,

            angle,
        });
    }

    return fields;
}

export function calculatePathLength(
    points: PathPoint[]
): number {
    let totalLength = 0;

    for (
        let i = 0;
        i < points.length - 1;
        i++
    ) {
        totalLength +=
            Math.hypot(
                points[i + 1].x -
                points[i].x,

                points[i + 1].y -
                points[i].y
            );
    }

    return totalLength;
}

interface CalculateRecommendedMaxFieldsOptions {
    points: PathPoint[];
    fieldSizeMm: number;
    minimumGapMm?: number;
}

export function calculateRecommendedMaxFields({
    points,
    fieldSizeMm,
    minimumGapMm = 1,
}: CalculateRecommendedMaxFieldsOptions): number {
    if (
        points.length < 2 ||
        fieldSizeMm <= 0
    ) {
        return 0;
    }

    const pathLength =
        calculatePathLength(
            points
        );

    if (pathLength <= 0) {
        return 0;
    }

    const requiredSpacing =
        fieldSizeMm +
        minimumGapMm;

    return Math.max(
        2,
        Math.floor(
            pathLength /
            requiredSpacing
        ) + 1
    );
}

function fieldsOverlap(
    fields: FieldPosition[],
    fieldSizeMm: number,
    minimumGapMm: number
): boolean {
    const minimumDistance =
        fieldSizeMm +
        minimumGapMm;

    for (
        let i = 0;
        i < fields.length;
        i++
    ) {
        for (
            let j = i + 1;
            j < fields.length;
            j++
        ) {
            const distance =
                Math.hypot(
                    fields[i].x -
                    fields[j].x,

                    fields[i].y -
                    fields[j].y
                );

            if (
                distance <
                minimumDistance
            ) {
                return true;
            }
        }
    }

    return false;
}

interface CustomPathOverlapOptions {
    points: PathPoint[];
    fieldCount: number;
    fieldSizeMm: number;
    minimumGapMm?: number;
}

export function customPathHasOverlap({
    points,
    fieldCount,
    fieldSizeMm,
    minimumGapMm = 1,
}: CustomPathOverlapOptions): boolean {
    const fields =
        generateFieldsAlongPath({
            points,
            fieldCount,
        });

    return fieldsOverlap(
        fields,
        fieldSizeMm,
        minimumGapMm
    );
}

interface PathSample {
    x: number;
    y: number;
    angle: number;
}

function getPathSampleAtDistance(
    points: PathPoint[],
    targetDistance: number
): PathSample | null {
    if (points.length < 2) {
        return null;
    }

    let travelledDistance = 0;

    for (
        let i = 0;
        i < points.length - 1;
        i++
    ) {
        const start =
            points[i];

        const end =
            points[i + 1];

        const dx =
            end.x - start.x;

        const dy =
            end.y - start.y;

        const segmentLength =
            Math.hypot(
                dx,
                dy
            );

        if (
            segmentLength <= 0.001
        ) {
            continue;
        }

        if (
            travelledDistance +
            segmentLength >=
            targetDistance
        ) {
            const distanceInsideSegment =
                targetDistance -
                travelledDistance;

            const ratio =
                Math.max(
                    0,
                    Math.min(
                        1,
                        distanceInsideSegment /
                        segmentLength
                    )
                );

            return {
                x:
                    start.x +
                    dx * ratio,

                y:
                    start.y +
                    dy * ratio,

                angle:
                    Math.atan2(
                        dy,
                        dx
                    ),
            };
        }

        travelledDistance +=
            segmentLength;
    }

    const lastPoint =
        points[
        points.length - 1
        ];

    const previousPoint =
        points[
        points.length - 2
        ];

    return {
        x:
            lastPoint.x,

        y:
            lastPoint.y,

        angle:
            Math.atan2(
                lastPoint.y -
                previousPoint.y,

                lastPoint.x -
                previousPoint.x
            ),
    };
}

interface FindSafeFieldCountOptions {
    points: PathPoint[];
    requestedFieldCount: number;
    fieldSizeMm: number;
    minimumGapMm?: number;
}

export function findSafeFieldCount({
    points,
    requestedFieldCount,
    fieldSizeMm,
    minimumGapMm = 1,
}: FindSafeFieldCountOptions): number {
    if (
        points.length < 2 ||
        requestedFieldCount < 2
    ) {
        return 0;
    }

    const recommendedMax =
        calculateRecommendedMaxFields({
            points,
            fieldSizeMm,
            minimumGapMm,
        });

    let candidateCount =
        Math.min(
            requestedFieldCount,
            recommendedMax
        );

    while (
        candidateCount >= 2
    ) {
        const fields =
            generateFieldsAlongPath({
                points,
                fieldCount:
                    candidateCount,
            });

        if (
            !fieldsOverlap(
                fields,
                fieldSizeMm,
                minimumGapMm
            )
        ) {
            return candidateCount;
        }

        candidateCount--;
    }

    return 0;
}