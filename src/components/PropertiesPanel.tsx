import React from "react";

import { BoardLayout } from "../models/BoardLayout";
import { GridPreset } from "../models/GridPreset";
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

    layout: BoardLayout;
    setLayout: (layout: BoardLayout) => void;

    gridPreset: GridPreset;
    setGridPreset: (preset: GridPreset) => void;

    monopolyShortSideFields: number;
    setMonopolyShortSideFields:
    (count: number) => void;

    monopolyLongSideFields: number;
    setMonopolyLongSideFields:
    (count: number) => void;

    monopolyDepthPercent: number;
    setMonopolyDepthPercent:
    (depth: number) => void;

    showFieldNumbers: boolean;
    setShowFieldNumbers:
    (show: boolean) => void;
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

    layout,
    setLayout,

    gridPreset,
    setGridPreset,

    onGenerate,

    monopolyShortSideFields,
    setMonopolyShortSideFields,

    monopolyLongSideFields,
    setMonopolyLongSideFields,

    monopolyDepthPercent,
    setMonopolyDepthPercent,

    showFieldNumbers,
    setShowFieldNumbers,
}: PropertiesPanelProps) {

    /*
     * Different layouts need different settings.
     *
     * For now we keep this logic here.
     * Later these settings can be split into
     * separate components.
     */
    const usesGridSettings =
        layout === "square-grid";

    const usesManualFieldCount =
        layout === "perimeter" ||
        layout === "snake";

    const canShowFieldNumbers =
        layout !== "mill-board";

    return (
        <aside className="properties-panel">
            <h2>Board</h2>

            {/* PAPER SIZE */}

            <label>
                Paper size

                <select
                    value={paperSize}
                    onChange={(event) =>
                        setPaperSize(
                            event.target.value as PaperSize
                        )
                    }
                >
                    <option value="A4">
                        A4 — 210 × 297 mm
                    </option>

                    <option value="A3">
                        A3 — 297 × 420 mm
                    </option>
                </select>
            </label>

            {/* ORIENTATION */}

            {boardShape === "rectangle" && (
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
                        <option value="portrait">
                            Portrait
                        </option>

                        <option value="landscape">
                            Landscape
                        </option>
                    </select>
                </label>
            )}

            {/* BOARD SHAPE */}

            <label>
                Board shape

                <select
                    value={boardShape}
                    onChange={(event) => {
                        const newShape =
                            event.target.value as BoardShape;

                        setBoardShape(newShape);

                        /*
                         * Square currently defaults
                         * to Square Grid.
                         */
                        if (newShape === "square") {
                            setLayout("square-grid");
                        }

                        /*
                         * Monopoly Ring is not
                         * supported on circles.
                         */
                        if (
                            newShape === "circle" &&
                            layout === "monopoly-ring"
                        ) {
                            setLayout("perimeter");
                        }

                        /*
                         * Mill Board currently only
                         * supports square boards.
                         */
                        if (
                            newShape !== "square" &&
                            layout === "mill-board"
                        ) {
                            setLayout("perimeter");
                        }
                    }}
                >
                    <option value="rectangle">
                        Rectangle
                    </option>

                    <option value="square">
                        Square
                    </option>

                    <option value="circle">
                        Circle
                    </option>
                </select>
            </label>

            {/* LAYOUT */}

            <label>
                Layout

                <select
                    value={layout}
                    onChange={(event) =>
                        setLayout(
                            event.target.value as BoardLayout
                        )
                    }
                >
                    <option value="perimeter">
                        Perimeter
                    </option>

                    <option
                        value="snake"
                        disabled={
                            boardShape === "circle"
                        }
                    >
                        Snake
                    </option>

                    <option value="square-grid">
                        Square Grid
                    </option>

                    <option
                        value="monopoly-ring"
                        disabled={
                            boardShape === "circle"
                        }
                    >
                        Monopoly Ring
                    </option>

                    <option
                        value="mill-board"
                        disabled={
                            boardShape !== "square"
                        }
                    >
                        Mill Board
                    </option>
                </select>
            </label>

            {/* FIELD NUMBERS */}

            {canShowFieldNumbers && (
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={showFieldNumbers}
                        onChange={(event) =>
                            setShowFieldNumbers(
                                event.target.checked
                            )
                        }
                    />

                    Show field numbers
                </label>
            )}

            {/* SQUARE GRID SETTINGS */}

            {usesGridSettings && (
                <label>
                    Grid size

                    <select
                        value={gridPreset}
                        onChange={(event) =>
                            setGridPreset(
                                event.target.value as GridPreset
                            )
                        }
                    >
                        <option value="large">
                            Large — 5 × 5
                        </option>

                        <option value="medium">
                            Medium — 8 × 8
                        </option>

                        <option value="small">
                            Small — 13 × 13
                        </option>
                    </select>
                </label>
            )}

            {/* MONOPOLY RING SETTINGS */}

            {layout === "monopoly-ring" && (
                <>
                    <label>
                        Short side fields

                        <select
                            value={
                                monopolyShortSideFields
                            }
                            onChange={(event) =>
                                setMonopolyShortSideFields(
                                    Number(
                                        event.target.value
                                    )
                                )
                            }
                        >
                            <option value={3}>
                                3
                            </option>

                            <option value={5}>
                                5
                            </option>

                            <option value={7}>
                                7
                            </option>

                            <option value={9}>
                                9
                            </option>

                            <option value={11}>
                                11
                            </option>

                            <option value={13}>
                                13
                            </option>
                        </select>
                    </label>

                    {boardShape === "rectangle" && (
                        <label>
                            Long side fields

                            <select
                                value={
                                    monopolyLongSideFields
                                }
                                onChange={(event) =>
                                    setMonopolyLongSideFields(
                                        Number(
                                            event.target.value
                                        )
                                    )
                                }
                            >
                                <option value={5}>
                                    5
                                </option>

                                <option value={7}>
                                    7
                                </option>

                                <option value={9}>
                                    9
                                </option>

                                <option value={11}>
                                    11
                                </option>

                                <option value={13}>
                                    13
                                </option>

                                <option value={15}>
                                    15
                                </option>

                                <option value={17}>
                                    17
                                </option>
                            </select>
                        </label>
                    )}

                    <label>
                        Field depth

                        <input
                            type="range"
                            min="8"
                            max="40"
                            step="1"
                            value={
                                monopolyDepthPercent
                            }
                            onChange={(event) =>
                                setMonopolyDepthPercent(
                                    Number(
                                        event.target.value
                                    )
                                )
                            }
                        />

                        <span>
                            {
                                monopolyDepthPercent
                            }%
                        </span>
                    </label>

                    <div>
                        Total fields:{" "}
                        {
                            boardShape ===
                                "rectangle"
                                ? 4 +
                                2 *
                                monopolyShortSideFields +
                                2 *
                                monopolyLongSideFields

                                : 4 +
                                4 *
                                monopolyShortSideFields
                        }
                    </div>
                </>
            )}

            {/* MANUAL FIELD GENERATION */}

            {usesManualFieldCount && (
                <>
                    <label>
                        Number of fields

                        <input
                            type="number"
                            min="2"
                            max="500"
                            value={fieldCount}
                            onChange={(event) =>
                                setFieldCount(
                                    Math.max(
                                        2,
                                        Number(
                                            event.target.value
                                        )
                                    )
                                )
                            }
                        />
                    </label>

                    <button
                        onClick={onGenerate}
                    >
                        Generate fields
                    </button>
                </>
            )}
        </aside>
    );
}