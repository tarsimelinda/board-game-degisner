import React from "react";

import { BoardLayout } from "../models/BoardLayout";
import { GridPreset } from "../models/GridPreset";
import { BoardShape } from "../models/BoardArea";

import {
    LAYOUT_CONFIG,
} from "../config/layoutConfig";

import {
    Orientation,
    PaperSize,
} from "../models/BoardProject";

import {
    CustomPathDistribution,
} from "../models/CustomPath";

interface PropertiesPanelProps {
    paperSize: PaperSize;
    setPaperSize:
    (size: PaperSize) => void;

    orientation: Orientation;
    setOrientation:
    (orientation: Orientation) => void;

    boardShape: BoardShape;
    setBoardShape:
    (shape: BoardShape) => void;

    fieldCount: number;
    setFieldCount:
    (count: number) => void;

    onGenerate:
    () => void;

    onClearCustomPath:
    () => void;

    layout: BoardLayout;
    setLayout:
    (layout: BoardLayout) => void;

    gridPreset: GridPreset;
    setGridPreset:
    (preset: GridPreset) => void;

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

    customPathFieldSizeMm: number;

    setCustomPathFieldSizeMm:
    (size: number) => void;

    preventFieldOverlap: boolean;

    setPreventFieldOverlap:
    (prevent: boolean) => void;

    customPathMessage:
    string | null;

    customPathDistribution:
    CustomPathDistribution;

    setCustomPathDistribution:
    (
        distribution:
            CustomPathDistribution
    ) => void;

    continuousPathWidthMm: number;

    setContinuousPathWidthMm:
    (width: number) => void;
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
    onClearCustomPath,

    layout,
    setLayout,

    gridPreset,
    setGridPreset,

    monopolyShortSideFields,
    setMonopolyShortSideFields,

    monopolyLongSideFields,
    setMonopolyLongSideFields,

    monopolyDepthPercent,
    setMonopolyDepthPercent,

    showFieldNumbers,
    setShowFieldNumbers,

    customPathFieldSizeMm,
    setCustomPathFieldSizeMm,

    preventFieldOverlap,
    setPreventFieldOverlap,

    customPathMessage,

    customPathDistribution,
    setCustomPathDistribution,

    continuousPathWidthMm,
    setContinuousPathWidthMm,
}: PropertiesPanelProps) {
    const currentLayoutConfig =
        LAYOUT_CONFIG[layout];

    const usesGridSettings =
        currentLayoutConfig.settingsType ===
        "grid";

    const usesManualFieldCount =
        currentLayoutConfig.settingsType ===
        "manual-fields";

    const usesMonopolySettings =
        currentLayoutConfig.settingsType ===
        "monopoly";

    const usesCustomPathSettings =
        currentLayoutConfig.settingsType ===
        "custom-path";

    const canShowFieldNumbers =
        currentLayoutConfig.canShowFieldNumbers;

    return (
        <aside className="properties-panel">
            <h2>Board</h2>

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

            <label>
                Board shape

                <select
                    value={boardShape}
                    onChange={(event) => {
                        const newShape =
                            event.target.value as BoardShape;

                        setBoardShape(
                            newShape
                        );

                        const layoutIsSupported =
                            currentLayoutConfig
                                .allowedShapes
                                .includes(
                                    newShape
                                );

                        if (
                            !layoutIsSupported
                        ) {
                            setLayout(
                                "perimeter"
                            );
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
                    {(
                        Object.entries(
                            LAYOUT_CONFIG
                        ) as [
                            BoardLayout,
                            typeof currentLayoutConfig
                        ][]
                    ).map(
                        ([
                            layoutValue,
                            config,
                        ]) => (
                            <option
                                key={
                                    layoutValue
                                }
                                value={
                                    layoutValue
                                }
                                disabled={
                                    !config
                                        .allowedShapes
                                        .includes(
                                            boardShape
                                        )
                                }
                            >
                                {
                                    config.label
                                }
                            </option>
                        )
                    )}
                </select>
            </label>

            {canShowFieldNumbers && (
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={
                            showFieldNumbers
                        }
                        onChange={(event) =>
                            setShowFieldNumbers(
                                event.target
                                    .checked
                            )
                        }
                    />

                    Show field numbers
                </label>
            )}

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

            {usesMonopolySettings && (
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
                                        event.target
                                            .value
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

                    {boardShape ===
                        "rectangle" && (
                            <label>
                                Long side fields

                                <select
                                    value={
                                        monopolyLongSideFields
                                    }
                                    onChange={(event) =>
                                        setMonopolyLongSideFields(
                                            Number(
                                                event
                                                    .target
                                                    .value
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
                                        event.target
                                            .value
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

            {usesCustomPathSettings && (
                <>
                    <div className="custom-path-help">
                        Draw a path directly
                        on the board.
                    </div>

                    <label>
                        Field distribution

                        <select
                            value={
                                customPathDistribution
                            }
                            onChange={(event) =>
                                setCustomPathDistribution(
                                    event.target.value as
                                    CustomPathDistribution
                                )
                            }
                        >
                            <option value="spaced">
                                Spaced
                            </option>

                            <option value="continuous">
                                Continuous
                            </option>
                        </select>
                    </label>

                    {customPathDistribution ===
                        "spaced" && (
                            <>
                                <label>
                                    Field size

                                    <input
                                        type="range"
                                        min="5"
                                        max="25"
                                        step="1"
                                        value={
                                            customPathFieldSizeMm
                                        }
                                        onChange={(event) =>
                                            setCustomPathFieldSizeMm(
                                                Number(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            )
                                        }
                                    />

                                    <span>
                                        {
                                            customPathFieldSizeMm
                                        }{" "}
                                        mm
                                    </span>
                                </label>

                                <label>
                                    Number of fields

                                    <input
                                        type="number"
                                        min="2"
                                        max="500"
                                        value={
                                            fieldCount
                                        }
                                        onChange={(event) =>
                                            setFieldCount(
                                                Math.max(
                                                    2,
                                                    Number(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                )
                                            )
                                        }
                                    />
                                </label>

                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={
                                            preventFieldOverlap
                                        }
                                        onChange={(event) =>
                                            setPreventFieldOverlap(
                                                event
                                                    .target
                                                    .checked
                                            )
                                        }
                                    />

                                    Prevent field overlap
                                </label>

                                {!preventFieldOverlap && (
                                    <div className="custom-path-warning">
                                        Overlap protection
                                        is off. Fields may
                                        overlap, so check
                                        the board carefully.
                                    </div>
                                )}
                            </>
                        )}

                    {customPathDistribution ===
                        "continuous" && (
                            <>
                                <label>
                                    Path width

                                    <input
                                        type="range"
                                        min="6"
                                        max="30"
                                        step="1"
                                        value={
                                            continuousPathWidthMm
                                        }
                                        onChange={(event) =>
                                            setContinuousPathWidthMm(
                                                Number(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            )
                                        }
                                    />

                                    <span>
                                        {
                                            continuousPathWidthMm
                                        }{" "}
                                        mm
                                    </span>
                                </label>

                                <label>
                                    Number of fields

                                    <input
                                        type="number"
                                        min="2"
                                        max="500"
                                        value={
                                            fieldCount
                                        }
                                        onChange={(event) =>
                                            setFieldCount(
                                                Math.max(
                                                    2,
                                                    Number(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                )
                                            )
                                        }
                                    />
                                </label>

                                <div className="custom-path-help">
                                    Field length is
                                    calculated automatically
                                    so the whole path is
                                    filled.
                                </div>
                            </>
                        )}

                    {customPathMessage && (
                        <div className="custom-path-message">
                            {customPathMessage}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={onGenerate}
                    >
                        Generate path
                    </button>

                    <button
                        type="button"
                        onClick={
                            onClearCustomPath
                        }
                    >
                        Clear drawing
                    </button>
                </>
            )}

            {usesManualFieldCount && (
                <>
                    <label>
                        Number of fields

                        <input
                            type="number"
                            min="2"
                            max="500"
                            value={
                                fieldCount
                            }
                            onChange={(event) =>
                                setFieldCount(
                                    Math.max(
                                        2,
                                        Number(
                                            event
                                                .target
                                                .value
                                        )
                                    )
                                )
                            }
                        />
                    </label>

                    <button
                        type="button"
                        onClick={
                            onGenerate
                        }
                    >
                        Generate fields
                    </button>
                </>
            )}
        </aside>
    );
}