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
} from "../utils/boardGenerator";

interface BoardCanvasProps {
    paperSize: PaperSize;
    orientation: Orientation;
    boardShape: BoardShape;
    fieldCount: number;
    layout: BoardLayout;
    gridPreset: GridPreset;

    monopolySideFields: number;
    monopolyDepthPercent: number;
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
    monopolySideFields,
    monopolyDepthPercent,
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

    // Orientation csak Rectangle esetén számít.
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

    // =========================
    // FIT TO WINDOW
    // =========================

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

    // =========================
    // DISPLAY SCALE
    // =========================

    const zoom = 1;

    const displayScale =
        fitScale * zoom;

    const paperDisplayWidth =
        paperWidthMm *
        displayScale;

    const paperDisplayHeight =
        paperHeightMm *
        displayScale;

    // =========================
    // BOARD SIZE
    // =========================

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

    // =========================
    // GRID
    // =========================

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

    // =========================
    // MONOPOLY RING
    // =========================

    const usesMonopolyRing =
        layout === "monopoly-ring" &&
        boardShape === "square";

    /*
     * Példa:
     * A4 square = 195 mm
     * 16% depth = 31.2 mm
     */
    const monopolyDepthMm =
        boardWidthMm *
        (
            monopolyDepthPercent /
            100
        );

    const monopolyFields =
        usesMonopolyRing
            ? generateMonopolyRing({
                boardWidthMm,
                boardHeightMm,

                sideFieldsPerSide:
                    monopolySideFields,

                fieldDepthMm:
                    monopolyDepthMm,
            })
            : [];

    // =========================
    // NORMAL FIELD SIZE
    // =========================

    let fieldSizeMm = 0;

    if (!usesMonopolyRing) {
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

    // =========================
    // NORMAL FIELD POSITIONS
    // =========================

    const fieldPositions =
        usesMonopolyRing
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

    // =========================
    // RENDER
    // =========================

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
                        {/* MONOPOLY RING */}

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
                                        {index + 1}
                                    </div>
                                )
                            )}

                        {/* OTHER LAYOUTS */}

                        {!usesMonopolyRing &&
                            fieldPositions.map(
                                (
                                    field,
                                    index
                                ) => (
                                    <div
                                        key={index}
                                        className={
                                            `board-field ${
                                                usesGrid
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
                                        {index + 1}
                                    </div>
                                )
                            )}
                    </div>
                </div>
            </div>
        </main>
    );
}