import React, { useEffect, useRef, useState } from "react";

import { BoardShape } from "../models/BoardArea";
import {
    Orientation,
    PaperSize,
} from "../models/BoardProject";

interface BoardCanvasProps {
    paperSize: PaperSize;
    orientation: Orientation;
    boardShape: BoardShape;
    fieldCount: number;
}

interface FieldPosition {
    x: number;
    y: number;
}

const PAPER_SIZES = {
    A4: {
        width: 210,
        height: 297,
    },

    A3: {
        width: 297,
        height: 420,
    },
};

const SAFE_MARGIN_MM = 15;

export function BoardCanvas({
    paperSize,
    orientation,
    boardShape,
    fieldCount,
}: BoardCanvasProps) {
    const canvasRef = useRef<HTMLElement>(null);

    const [fitScale, setFitScale] = useState(1);

    const paper = PAPER_SIZES[paperSize];

    let width = paper.width;
    let height = paper.height;

    if (orientation === "landscape") {
        [width, height] = [height, width];
    }

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const updateScale = () => {
            const padding = 60;

            const availableWidth =
                canvas.clientWidth - padding;

            const availableHeight =
                canvas.clientHeight - padding;

            const widthScale =
                availableWidth / width;

            const heightScale =
                availableHeight / height;

            const newScale = Math.min(
                widthScale,
                heightScale
            );

            setFitScale(newScale);
        };

        updateScale();

        const resizeObserver =
            new ResizeObserver(updateScale);

        resizeObserver.observe(canvas);

        return () => {
            resizeObserver.disconnect();
        };
    }, [width, height]);

    const zoom = 1;

    const displayScale =
        fitScale * zoom;

    // -------------------------
    // PAPER
    // -------------------------

    const paperWidth =
        width * displayScale;

    const paperHeight =
        height * displayScale;

    // -------------------------
    // SAFE AREA
    // -------------------------

    const safeAvailableWidth =
        width - SAFE_MARGIN_MM * 2;

    const safeAvailableHeight =
        height - SAFE_MARGIN_MM * 2;

    const paperAspectRatio =
        width / height;

    // -------------------------
    // SAFE PAGE
    // -------------------------

    let safePageWidth =
        safeAvailableWidth;

    let safePageHeight =
        safePageWidth / paperAspectRatio;

    if (
        safePageHeight >
        safeAvailableHeight
    ) {
        safePageHeight =
            safeAvailableHeight;

        safePageWidth =
            safePageHeight *
            paperAspectRatio;
    }

    // -------------------------
    // SQUARE / CIRCLE
    // -------------------------

    const maxSquareSizeMm =
        Math.min(
            safeAvailableWidth,
            safeAvailableHeight
        );

    // -------------------------
    // BOARD REAL SIZE IN MM
    // -------------------------

    let boardWidthMm: number;
    let boardHeightMm: number;

    if (boardShape === "full-page") {
        boardWidthMm = width;
        boardHeightMm = height;
    }
    else if (
        boardShape === "square" ||
        boardShape === "circle"
    ) {
        boardWidthMm =
            maxSquareSizeMm;

        boardHeightMm =
            maxSquareSizeMm;
    }
    else {
        // safe-page + custom egyelőre
        boardWidthMm =
            safePageWidth;

        boardHeightMm =
            safePageHeight;
    }

    // -------------------------
    // BOARD DISPLAY SIZE
    // -------------------------

    const boardDisplayWidth =
        boardWidthMm * displayScale;

    const boardDisplayHeight =
        boardHeightMm * displayScale;

    // -------------------------
    // FIELD SIZE
    // -------------------------

    let pathLengthMm = 0;

    if (boardShape === "circle") {
        pathLengthMm =
            Math.PI * boardWidthMm;
    }
    else {
        pathLengthMm =
            2 *
            (
                boardWidthMm +
                boardHeightMm
            );
    }

    const fieldSizeMm =
        fieldCount > 0
            ? Math.min(
                18,
                (pathLengthMm /
                    fieldCount) *
                    0.7
            )
            : 0;

    // -------------------------
    // FIELD POSITIONS
    // -------------------------

    const fieldPositions:
        FieldPosition[] = [];

    if (
        fieldCount > 0 &&
        fieldSizeMm > 0
    ) {
        // -------------------------
        // CIRCLE
        // -------------------------

        if (boardShape === "circle") {
            const centerX =
                boardWidthMm / 2;

            const centerY =
                boardHeightMm / 2;

            const radius =
                (
                    boardWidthMm -
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

                fieldPositions.push({
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
        }

        // -------------------------
        // RECTANGULAR BOARD
        // -------------------------

        else {
            const inset =
                fieldSizeMm / 2;

            const pathWidth =
                boardWidthMm -
                fieldSizeMm;

            const pathHeight =
                boardHeightMm -
                fieldSizeMm;

            const perimeter =
                2 *
                (
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

                fieldPositions.push({
                    x,
                    y,
                });
            }
        }
    }

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
                            width: boardDisplayWidth,
                            height: boardDisplayHeight,
                        }}
                    >
                        {fieldPositions.map(
                            (field, index) => (
                                <div
                                    key={index}
                                    className="board-field"
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