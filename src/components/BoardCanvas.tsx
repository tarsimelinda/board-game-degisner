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

    // Később ezt fogjuk tényleges zoom state-re cserélni.
    const zoom = 1;

    const displayScale = fitScale * zoom;

    // A papír képernyőn megjelenő mérete
    const paperWidth =
        width * displayScale;

    const paperHeight =
        height * displayScale;

    // Ennyi hely marad a 15 mm-es
    // biztonsági margón belül.
    const safeAvailableWidth =
        width - SAFE_MARGIN_MM * 2;

    const safeAvailableHeight =
        height - SAFE_MARGIN_MM * 2;

    // A papír eredeti oldalaránya.
    const paperAspectRatio =
        width / height;

    /*
     * SAFE PAGE
     *
     * A lehető legnagyobb olyan téglalapot számoljuk ki,
     * amely:
     *
     * 1. belefér a safe area-ba,
     * 2. megtartja az A4/A3 eredeti oldalarányát.
     */
    let safePageWidth =
        safeAvailableWidth;

    let safePageHeight =
        safePageWidth / paperAspectRatio;

    if (safePageHeight > safeAvailableHeight) {
        safePageHeight =
            safeAvailableHeight;

        safePageWidth =
            safePageHeight * paperAspectRatio;
    }

    // Safe page képernyőméretei
    const safePageDisplayWidth =
        safePageWidth * displayScale;

    const safePageDisplayHeight =
        safePageHeight * displayScale;

    // Teljes safe area képernyőmérete.
    // A square és circle ebből számolódik.
    const safeDisplayWidth =
        safeAvailableWidth * displayScale;

    const safeDisplayHeight =
        safeAvailableHeight * displayScale;

    const maxSquareSize =
        Math.min(
            safeDisplayWidth,
            safeDisplayHeight
        );

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
                        style={
                            boardShape === "full-page"
                                ? {
                                    width: "100%",
                                    height: "100%",
                                }

                                : boardShape === "safe-page"
                                    ? {
                                        width: safePageDisplayWidth,
                                        height: safePageDisplayHeight,
                                    }

                                    : boardShape === "square"
                                        ? {
                                            width: maxSquareSize,
                                            height: maxSquareSize,
                                        }

                                        : boardShape === "circle"
                                            ? {
                                                width: maxSquareSize,
                                                height: maxSquareSize,
                                            }

                                            : {
                                                // Custom egyelőre ugyanúgy
                                                // jelenik meg, mint Safe page.
                                                width: safePageDisplayWidth,
                                                height: safePageDisplayHeight,
                                            }
                        }
                    >
                        Board
                    </div>
                </div>
            </div>
        </main>
    );
}