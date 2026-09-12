import React, { useEffect, useRef, useState } from "react";

import { BoardShape } from "../models/BoardArea";
import { GridPreset } from "../models/GridPreset";
import {
    Orientation,
    PaperSize,
} from "../models/BoardProject";
import { BoardLayout } from "../models/BoardLayout";

import {
    CustomPathDistribution,
    PathPoint,
} from "../models/CustomPath";

import {
    FieldShape,
} from "../models/FieldShape";

import {
    CustomPathFieldShape,
} from "./CustomPathFieldShape";

import {
    calculateFieldSize,
    calculateSnakeFieldSize,
    generatePerimeterFields,
    generateSnakeFields,
    generateSquareGrid,
    generateCircleGrid,
    generateMonopolyRing,
    generateMillBoard,
    generateTicTacToeBoard,
    generateFieldsAlongPath,
    generateContinuousPath,
} from "../utils/boardGenerator";

interface BoardCanvasProps {
    paperSize: PaperSize;
    orientation: Orientation;
    boardShape: BoardShape;
    fieldCount: number;
    layout: BoardLayout;
    gridPreset: GridPreset;

    monopolyShortSideFields: number;
    monopolyLongSideFields: number;
    monopolyDepthPercent: number;

    showFieldNumbers: boolean;
    customPathPoints: PathPoint[];

    generatedCustomPathPoints: PathPoint[];

    customPathFieldSizeMm: number;

    onCustomPathChange:
    (points: PathPoint[]) => void;

    customPathDistribution:
    CustomPathDistribution;

    continuousPathWidthMm: number;

    customPathFieldShape:
    FieldShape;
}

const PAPER_SIZES = {
    A4: {
        width: 210,
        height: 297,
        printableWidth: 195,
        printableHeight: 282,
    },

    A3: {
        width: 297,
        height: 420,
        printableWidth: 282,
        printableHeight: 405,
    },
};

export function BoardCanvas({
    paperSize,
    orientation,
    boardShape,
    fieldCount,
    layout,
    gridPreset,
    monopolyShortSideFields,
    monopolyLongSideFields,
    monopolyDepthPercent,
    showFieldNumbers,

    customPathPoints,
    generatedCustomPathPoints,
    onCustomPathChange,
    customPathFieldSizeMm,
    customPathDistribution,
    continuousPathWidthMm,
    customPathFieldShape,
}: BoardCanvasProps) {
    const canvasRef =
        useRef<HTMLElement>(null);

    const [fitScale, setFitScale] =
        useState(1);

    const [
        isDrawingCustomPath,
        setIsDrawingCustomPath,
    ] = useState(false);

    const paper =
        PAPER_SIZES[paperSize];

    let paperWidthMm =
        paper.width;

    let paperHeightMm =
        paper.height;

    let printableWidthMm =
        paper.printableWidth;

    let printableHeightMm =
        paper.printableHeight;

    if (
        boardShape === "rectangle" &&
        orientation === "landscape"
    ) {
        [
            paperWidthMm,
            paperHeightMm,
        ] = [
                paperHeightMm,
                paperWidthMm,
            ];

        [
            printableWidthMm,
            printableHeightMm,
        ] = [
                printableHeightMm,
                printableWidthMm,
            ];
    }

    useEffect(() => {
        const canvas =
            canvasRef.current;

        if (!canvas) {
            return;
        }

        const updateScale = () => {
            const padding = 60;

            const availableWidth =
                canvas.clientWidth -
                padding;

            const availableHeight =
                canvas.clientHeight -
                padding;

            const widthScale =
                availableWidth /
                paperWidthMm;

            const heightScale =
                availableHeight /
                paperHeightMm;

            setFitScale(
                Math.min(
                    widthScale,
                    heightScale
                )
            );
        };

        updateScale();

        const resizeObserver =
            new ResizeObserver(
                updateScale
            );

        resizeObserver.observe(
            canvas
        );

        return () => {
            resizeObserver.disconnect();
        };
    }, [
        paperWidthMm,
        paperHeightMm,
    ]);

    const zoom = 1;

    const displayScale =
        fitScale * zoom;

    const paperDisplayWidth =
        paperWidthMm *
        displayScale;

    const paperDisplayHeight =
        paperHeightMm *
        displayScale;

    let boardWidthMm: number;
    let boardHeightMm: number;

    if (
        boardShape === "rectangle"
    ) {
        boardWidthMm =
            printableWidthMm;

        boardHeightMm =
            printableHeightMm;
    }
    else {
        const shapeSizeMm =
            Math.min(
                printableWidthMm,
                printableHeightMm
            );

        boardWidthMm =
            shapeSizeMm;

        boardHeightMm =
            shapeSizeMm;
    }

    const boardDisplayWidth =
        boardWidthMm *
        displayScale;

    const boardDisplayHeight =
        boardHeightMm *
        displayScale;

    const usesCustomPath =
        layout === "custom-path";

    const getCustomPathPoint = (
        event:
            React.PointerEvent<HTMLDivElement>
    ): PathPoint => {
        const rect =
            event.currentTarget
                .getBoundingClientRect();

        const relativeX =
            (
                event.clientX -
                rect.left
            ) /
            rect.width;

        const relativeY =
            (
                event.clientY -
                rect.top
            ) /
            rect.height;

        return {
            x:
                Math.max(
                    0,
                    Math.min(
                        boardWidthMm,
                        relativeX *
                        boardWidthMm
                    )
                ),

            y:
                Math.max(
                    0,
                    Math.min(
                        boardHeightMm,
                        relativeY *
                        boardHeightMm
                    )
                ),
        };
    };

    const handleCustomPathPointerDown = (
        event:
            React.PointerEvent<HTMLDivElement>
    ) => {
        if (!usesCustomPath) {
            return;
        }

        event.currentTarget
            .setPointerCapture(
                event.pointerId
            );

        const point =
            getCustomPathPoint(
                event
            );

        onCustomPathChange([
            point,
        ]);

        setIsDrawingCustomPath(
            true
        );
    };

    const handleCustomPathPointerMove = (
        event:
            React.PointerEvent<HTMLDivElement>
    ) => {
        if (
            !usesCustomPath ||
            !isDrawingCustomPath
        ) {
            return;
        }

        const point =
            getCustomPathPoint(
                event
            );

        const previousPoint =
            customPathPoints[
            customPathPoints.length - 1
            ];

        if (!previousPoint) {
            onCustomPathChange([
                point,
            ]);

            return;
        }

        const distance =
            Math.hypot(
                point.x -
                previousPoint.x,

                point.y -
                previousPoint.y
            );

        const minimumDistanceMm =
            1.5;

        if (
            distance <
            minimumDistanceMm
        ) {
            return;
        }

        onCustomPathChange([
            ...customPathPoints,
            point,
        ]);
    };

    const handleCustomPathPointerUp = (
        event:
            React.PointerEvent<HTMLDivElement>
    ) => {
        if (!usesCustomPath) {
            return;
        }

        setIsDrawingCustomPath(
            false
        );

        if (
            event.currentTarget
                .hasPointerCapture(
                    event.pointerId
                )
        ) {
            event.currentTarget
                .releasePointerCapture(
                    event.pointerId
                );
        }
    };

    const customPathFields =
        usesCustomPath &&
            customPathDistribution ===
            "spaced"
            ? generateFieldsAlongPath({
                points:
                    generatedCustomPathPoints,

                fieldCount,
            })
            : [];

    const continuousPath =
        usesCustomPath &&
            customPathDistribution ===
            "continuous"
            ? generateContinuousPath({
                points:
                    generatedCustomPathPoints,

                fieldCount,

                pathWidthMm:
                    continuousPathWidthMm,
            })
            : null;

    const usesMillBoard =
        layout === "mill-board" &&
        boardShape === "square";

    const millBoard =
        usesMillBoard
            ? generateMillBoard({
                boardWidthMm,
                boardHeightMm,
            })
            : null;

    const usesTicTacToe =
        layout === "tic-tac-toe" &&
        boardShape === "square";

    const ticTacToeBoard =
        usesTicTacToe
            ? generateTicTacToeBoard({
                boardWidthMm,
                boardHeightMm,
            })
            : null;

    const usesGrid =
        layout === "square-grid";

    const grid =
        !usesGrid
            ? null
            : boardShape === "circle"
                ? generateCircleGrid({
                    boardWidthMm,
                    boardHeightMm,
                    preset: gridPreset,
                })
                : generateSquareGrid({
                    boardWidthMm,
                    boardHeightMm,
                    preset: gridPreset,
                });

    const usesMonopolyRing =
        layout === "monopoly-ring" &&
        boardShape !== "circle";

    const monopolyDepthMm =
        Math.min(
            boardWidthMm,
            boardHeightMm
        ) *
        (
            monopolyDepthPercent /
            100
        );

    const isLandscapeBoard =
        boardWidthMm >
        boardHeightMm;

    let monopolyHorizontalFields: number;
    let monopolyVerticalFields: number;

    if (boardShape === "square") {
        monopolyHorizontalFields =
            monopolyShortSideFields;

        monopolyVerticalFields =
            monopolyShortSideFields;
    }
    else if (isLandscapeBoard) {
        monopolyHorizontalFields =
            monopolyLongSideFields;

        monopolyVerticalFields =
            monopolyShortSideFields;
    }
    else {
        monopolyHorizontalFields =
            monopolyShortSideFields;

        monopolyVerticalFields =
            monopolyLongSideFields;
    }

    const monopolyFields =
        usesMonopolyRing
            ? generateMonopolyRing({
                boardWidthMm,
                boardHeightMm,

                horizontalFields:
                    monopolyHorizontalFields,

                verticalFields:
                    monopolyVerticalFields,

                fieldDepthMm:
                    monopolyDepthMm,
            })
            : [];

    let fieldSizeMm = 0;

    if (
        !usesMonopolyRing &&
        !usesMillBoard &&
        !usesTicTacToe &&
        !usesCustomPath
    ) {
        if (grid) {
            fieldSizeMm =
                grid.fieldSizeMm;
        }
        else if (
            layout === "snake"
        ) {
            fieldSizeMm =
                calculateSnakeFieldSize({
                    boardWidthMm,
                    boardHeightMm,
                    boardShape,
                    fieldCount,
                });
        }
        else {
            fieldSizeMm =
                calculateFieldSize({
                    boardWidthMm,
                    boardHeightMm,
                    boardShape,
                    fieldCount,
                });
        }
    }

    const fieldPositions =
        usesMonopolyRing ||
            usesMillBoard ||
            usesTicTacToe ||
            usesCustomPath
            ? []
            : grid
                ? grid.positions
                : layout === "snake"
                    ? generateSnakeFields({
                        boardWidthMm,
                        boardHeightMm,
                        boardShape,
                        fieldCount,
                    })
                    : generatePerimeterFields({
                        boardWidthMm,
                        boardHeightMm,
                        boardShape,
                        fieldCount,
                    });

    return (
        <main
            ref={canvasRef}
            className="canvas-area"
        >
            <div className="canvas-content">
                <div
                    className="paper"
                    style={{
                        width:
                            paperDisplayWidth,

                        height:
                            paperDisplayHeight,
                    }}
                >
                    <div
                        className={
                            `board board-${boardShape} board-layout-${layout}`
                        }
                        style={{
                            width:
                                boardDisplayWidth,

                            height:
                                boardDisplayHeight,
                        }}

                        onPointerDown={
                            handleCustomPathPointerDown
                        }

                        onPointerMove={
                            handleCustomPathPointerMove
                        }

                        onPointerUp={
                            handleCustomPathPointerUp
                        }

                        onPointerCancel={
                            handleCustomPathPointerUp
                        }
                    >

                        {usesCustomPath &&
                            customPathPoints.length >= 2 &&
                            !(
                                customPathDistribution ===
                                "continuous" &&
                                generatedCustomPathPoints.length >=
                                2
                            ) && (
                                <svg
                                    className="custom-path-svg"

                                    viewBox={
                                        `0 0 ${boardWidthMm} ${boardHeightMm}`
                                    }

                                    preserveAspectRatio="none"
                                >
                                    <polyline
                                        className="custom-path-source"

                                        points={
                                            customPathPoints
                                                .map(
                                                    (point) =>
                                                        `${point.x},${point.y}`
                                                )
                                                .join(" ")
                                        }
                                    />
                                </svg>
                            )}

                        {usesCustomPath &&
                            customPathDistribution ===
                            "continuous" &&
                            generatedCustomPathPoints.length >=
                            2 &&
                            continuousPath && (
                                <>
                                    <svg
                                        className="custom-path-svg"
                                        viewBox={
                                            `0 0 ${boardWidthMm} ${boardHeightMm}`
                                        }
                                        preserveAspectRatio="none"
                                    >

                                        <polyline
                                            className="continuous-path-outline"
                                            points={
                                                generatedCustomPathPoints
                                                    .map(
                                                        (point) =>
                                                            `${point.x},${point.y}`
                                                    )
                                                    .join(" ")
                                            }
                                            style={{
                                                strokeWidth:
                                                    continuousPathWidthMm +
                                                    1.5,
                                            }}
                                        />

                                        <polyline
                                            className="continuous-path-body"
                                            points={
                                                generatedCustomPathPoints
                                                    .map(
                                                        (point) =>
                                                            `${point.x},${point.y}`
                                                    )
                                                    .join(" ")
                                            }
                                            style={{
                                                strokeWidth:
                                                    continuousPathWidthMm,
                                            }}
                                        />

                                        {continuousPath.dividers.map(
                                            (
                                                divider,
                                                index
                                            ) => (
                                                <line
                                                    key={
                                                        `continuous-divider-${index}`
                                                    }

                                                    className="continuous-path-divider"

                                                    x1={
                                                        divider.x1
                                                    }

                                                    y1={
                                                        divider.y1
                                                    }

                                                    x2={
                                                        divider.x2
                                                    }

                                                    y2={
                                                        divider.y2
                                                    }
                                                />
                                            )
                                        )}
                                    </svg>

                                    {showFieldNumbers &&
                                        continuousPath.fields.map(
                                            (
                                                field,
                                                index
                                            ) => (
                                                <div
                                                    key={
                                                        `continuous-number-${index}`
                                                    }

                                                    className="continuous-path-number"

                                                    style={{
                                                        left:
                                                            field.x *
                                                            displayScale,

                                                        top:
                                                            field.y *
                                                            displayScale,
                                                    }}
                                                >
                                                    {index + 1}
                                                </div>
                                            )
                                        )}
                                </>
                            )}


                        {usesCustomPath &&
                            customPathDistribution ===
                            "spaced" &&
                            customPathFields.map(
                                (
                                    field,
                                    index
                                ) => {
                                    const angle =
                                        field.angle ?? 0;

                                    return (
                                        <div
                                            key={
                                                `custom-path-${index}`
                                            }

                                            className="custom-path-field-wrapper"

                                            style={{
                                                width:
                                                    customPathFieldSizeMm *
                                                    displayScale,

                                                height:
                                                    customPathFieldSizeMm *
                                                    displayScale,

                                                left:
                                                    field.x *
                                                    displayScale,

                                                top:
                                                    field.y *
                                                    displayScale,

                                                transform:
                                                    `translate(-50%, -50%) rotate(${angle}rad)`,
                                            }}
                                        >
                                            <CustomPathFieldShape
                                                shape={
                                                    customPathFieldShape
                                                }

                                                number={
                                                    index + 1
                                                }

                                                angle={
                                                    angle
                                                }

                                                showNumber={
                                                    showFieldNumbers
                                                }
                                            />
                                        </div>
                                    );
                                }
                            )}

                        {usesMillBoard &&
                            millBoard?.lines.map(
                                (line, index) => (
                                    <div
                                        key={`mill-line-${index}`}
                                        className="mill-line"
                                        style={{
                                            left:
                                                line.x1 *
                                                displayScale,
                                            top:
                                                line.y1 *
                                                displayScale,
                                            width:
                                                Math.hypot(
                                                    line.x2 - line.x1,
                                                    line.y2 - line.y1
                                                ) * displayScale,
                                            transform: `translate(0, -50%) rotate(${Math.atan2(
                                                line.y2 - line.y1,
                                                line.x2 - line.x1
                                            )}rad)`,
                                            transformOrigin:
                                                "0 50%",
                                        }}
                                    />
                                )
                            )}

                        {usesMillBoard &&
                            millBoard?.points.map(
                                (point, index) => (
                                    <div
                                        key={`mill-point-${index}`}
                                        className="board-field board-field-mill"
                                        style={{
                                            width:
                                                millBoard.pointSizeMm *
                                                displayScale,

                                            height:
                                                millBoard.pointSizeMm *
                                                displayScale,

                                            left:
                                                point.x *
                                                displayScale,

                                            top:
                                                point.y *
                                                displayScale,
                                        }}
                                    >
                                    </div>
                                )
                            )}

                        {usesTicTacToe &&
                            ticTacToeBoard?.lines.map(
                                (line, index) => (
                                    <div
                                        key={`tic-tac-toe-line-${index}`}
                                        className="tic-tac-toe-line"
                                        style={{
                                            left:
                                                line.x1 *
                                                displayScale,

                                            top:
                                                line.y1 *
                                                displayScale,

                                            width:
                                                Math.hypot(
                                                    line.x2 - line.x1,
                                                    line.y2 - line.y1
                                                ) *
                                                displayScale,

                                            transform: `translate(0, -50%) rotate(${Math.atan2(
                                                line.y2 - line.y1,
                                                line.x2 - line.x1
                                            )}rad)`,

                                            transformOrigin:
                                                "0 50%",
                                        }}
                                    />
                                )
                            )}

                        {usesMonopolyRing &&
                            monopolyFields.map(
                                (
                                    field,
                                    index
                                ) => (
                                    <div
                                        key={`monopoly-${index}`}
                                        className="board-field board-field-monopoly"
                                        style={{
                                            width:
                                                field.width *
                                                displayScale,

                                            height:
                                                field.height *
                                                displayScale,

                                            left:
                                                field.x *
                                                displayScale,

                                            top:
                                                field.y *
                                                displayScale,
                                        }}
                                    >
                                        {showFieldNumbers && (
                                            <span className="field-number">
                                                {index + 1}
                                            </span>
                                        )}
                                    </div>
                                )
                            )}


                        {!usesMonopolyRing &&
                            !usesMillBoard &&
                            !usesTicTacToe &&
                            !usesCustomPath &&
                            fieldPositions.map(
                                (
                                    field,
                                    index
                                ) => (
                                    <div
                                        key={index}
                                        className={
                                            `board-field ${usesGrid
                                                ? "board-field-square"
                                                : ""
                                            }`
                                        }
                                        style={{
                                            width:
                                                fieldSizeMm *
                                                displayScale,

                                            height:
                                                fieldSizeMm *
                                                displayScale,

                                            left:
                                                field.x *
                                                displayScale,

                                            top:
                                                field.y *
                                                displayScale,
                                        }}
                                    >
                                        {showFieldNumbers && (
                                            <span className="field-number">
                                                {index + 1}
                                            </span>
                                        )}
                                    </div>
                                )
                            )}
                    </div>
                </div>
            </div>
        </main>
    );
}