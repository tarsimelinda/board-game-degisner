import React, { useEffect, useRef, useState } from "react";

import { BoardShape } from "../models/BoardArea";
import { GridPreset } from "../models/GridPreset";
import {
    Orientation,
    PaperSize,
} from "../models/BoardProject";
import { BoardLayout } from "../models/BoardLayout";

import {
    calculateFieldSize,
    calculateSnakeFieldSize,
    generatePerimeterFields,
    generateSnakeFields,
    generateSquareGrid,
    generateCircleGrid,
    generateMonopolyRing,
    generateMillBoard,
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
}: BoardCanvasProps) {
    const canvasRef =
        useRef<HTMLElement>(null);

    const [fitScale, setFitScale] =
        useState(1);

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
        !usesMillBoard
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
            usesMillBoard
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
                        className={`board board-${boardShape}`}
                        style={{
                            width:
                                boardDisplayWidth,

                            height:
                                boardDisplayHeight,
                        }}
                    >

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
                                        {/* később ide jöhet egyedi ikon vagy kép */}
                                    </div>
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