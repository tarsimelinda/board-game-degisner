import React, { useEffect, useRef, useState } from "react";

import { BoardShape } from "../models/BoardArea";
import {
    Orientation,
    PaperSize,
} from "../models/BoardProject";

import {
    calculateFieldSize,
    generatePerimeterFields,
} from "../utils/boardGenerator";

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

    const paperWidth =
        width * displayScale;

    const paperHeight =
        height * displayScale;

    const safeAvailableWidth =
        width - SAFE_MARGIN_MM * 2;

    const safeAvailableHeight =
        height - SAFE_MARGIN_MM * 2;

    const paperAspectRatio =
        width / height;

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

    const maxSquareSizeMm =
        Math.min(
            safeAvailableWidth,
            safeAvailableHeight
        );

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
        boardWidthMm =
            safePageWidth;

        boardHeightMm =
            safePageHeight;
    }

    const boardDisplayWidth =
        boardWidthMm * displayScale;

    const boardDisplayHeight =
        boardHeightMm * displayScale;

    const fieldSizeMm =
        calculateFieldSize({
            boardWidthMm,
            boardHeightMm,
            boardShape,
            fieldCount,
        });

    const fieldPositions =
        generatePerimeterFields({
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