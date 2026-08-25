import React, { useEffect, useRef, useState } from "react";

import { BoardShape } from "../models/BoardArea";

import { GridPreset } from "../models/GridPreset";

import {
    Orientation,
    PaperSize,
} from "../models/BoardProject";

import {
    calculateFieldSize,
    calculateSnakeFieldSize,
    generatePerimeterFields,
    generateSnakeFields,
    generateSquareGrid,
} from "../utils/boardGenerator";

import { BoardLayout } from "../models/BoardLayout";

interface BoardCanvasProps {
    paperSize: PaperSize;
    orientation: Orientation;
    boardShape: BoardShape;
    fieldCount: number;
    layout: BoardLayout;
    gridPreset: GridPreset;
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
}: BoardCanvasProps) {
    const canvasRef = useRef<HTMLElement>(null);

    const [fitScale, setFitScale] = useState(1);

    const paper = PAPER_SIZES[paperSize];

    let width = paper.width;
    let height = paper.height;

    let printableWidth =
        paper.printableWidth;

    let printableHeight =
        paper.printableHeight;

    if (
        boardShape === "rectangle" &&
        orientation === "landscape"
    ) {
        [width, height] = [
            height,
            width,
        ];

        [
            printableWidth,
            printableHeight,
        ] = [
                printableHeight,
                printableWidth,
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
                width;

            const heightScale =
                availableHeight /
                height;

            const newScale =
                Math.min(
                    widthScale,
                    heightScale
                );

            setFitScale(newScale);
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
    }, [width, height]);

    const zoom = 1;

    const displayScale =
        fitScale * zoom;

    const paperWidth =
        width * displayScale;

    const paperHeight =
        height * displayScale;

    let boardWidthMm: number;
    let boardHeightMm: number;

    if (
        boardShape === "rectangle"
    ) {

        boardWidthMm =
            printableWidth;

        boardHeightMm =
            printableHeight;
    }
    else {

        const shapeSizeMm =
            Math.min(
                printableWidth,
                printableHeight
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

    const squareGrid =
        layout === "square-grid"
            ? generateSquareGrid({
                boardWidthMm,
                boardHeightMm,
                preset: gridPreset,
            })
            : null;

    const fieldSizeMm =
        squareGrid
            ? squareGrid.fieldSizeMm
            : layout === "snake"
                ? calculateSnakeFieldSize({
                    boardWidthMm,
                    boardHeightMm,
                    boardShape,
                    fieldCount,
                })
                : calculateFieldSize({
                    boardWidthMm,
                    boardHeightMm,
                    boardShape,
                    fieldCount,
                });

    const fieldPositions =
        squareGrid
            ? squareGrid.positions
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
                        width: paperWidth,
                        height: paperHeight,
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
                        {fieldPositions.map(
                            (
                                field,
                                index
                            ) => (
                                <div
                                    key={index}
                                    className={`board-field ${layout === "square-grid"
                                            ? "board-field-square"
                                            : ""
                                        }`}
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