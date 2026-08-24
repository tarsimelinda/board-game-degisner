import React from "react";

import { BoardShape } from "../models/BoardArea";
import {
    Orientation,
    PaperSize,
} from "../models/BoardProject";

interface PropertiesPanelProps {
    paperSize: PaperSize;
    setPaperSize: (size: PaperSize) => void;

    orientation: Orientation;
    setOrientation: (orientation: Orientation) => void;

    boardShape: BoardShape;
    setBoardShape: (shape: BoardShape) => void;

    fieldCount: number;
    setFieldCount: (count: number) => void;
    onGenerate: () => void;
}

export function PropertiesPanel({
    paperSize,
    setPaperSize,
    orientation,
    setOrientation,
    boardShape,
    setBoardShape,
    fieldCount,
    setFieldCount,
    onGenerate,
}: PropertiesPanelProps) {
    return (
        <aside className="properties-panel">
            <h2>Board</h2>

            <label>
                Paper size

                <select
                    value={paperSize}
                    onChange={(event) =>
                        setPaperSize(event.target.value as PaperSize)
                    }
                >
                    <option value="A4">A4</option>
                    <option value="A3">A3</option>
                </select>
            </label>

            <label>
                Orientation

                <select
                    value={orientation}
                    onChange={(event) =>
                        setOrientation(
                            event.target.value as Orientation
                        )
                    }
                >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                </select>
            </label>

            <label>
                Board shape

                <select
                    value={boardShape}
                    onChange={(event) =>
                        setBoardShape(
                            event.target.value as BoardShape
                        )
                    }
                >
                    <option value="safe-page">
                        Safe page
                    </option>

                    <option value="full-page">
                        Full page
                    </option>

                    <option value="square">
                        Square
                    </option>

                    <option value="circle">
                        Circle
                    </option>

                    <option value="custom">
                        Custom
                    </option>
                </select>
            </label>

            <label>
                Number of fields

                <input
                    type="number"
                    min="2"
                    max="500"
                    value={fieldCount}
                    onChange={(event) =>
                        setFieldCount(
                            Math.max(2, Number(event.target.value))
                        )
                    }
                />
            </label>

            <button onClick={onGenerate}>
                Generate fields
            </button>
        </aside>
    );
}