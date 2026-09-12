import React from "react";

import {
    FieldShape,
} from "../models/FieldShape";

interface CustomPathFieldShapeProps {
    shape: FieldShape;

    number: number;

    angle: number;

    showNumber: boolean;
}

export function CustomPathFieldShape({
    shape,
    number,
    angle,
    showNumber,
}: CustomPathFieldShapeProps) {
    return (
        <>
            <svg
                className="custom-path-field-shape"
                viewBox="0 0 100 100"
            >
                {shape === "circle" && (
                    <circle
                        cx="50"
                        cy="50"
                        r="46"
                        className="custom-path-shape-element"
                    />
                )}

                {shape === "square" && (
                    <rect
                        x="4"
                        y="4"
                        width="92"
                        height="92"
                        className="custom-path-shape-element"
                    />
                )}

                {shape === "diamond" && (
                    <polygon
                        points="
                            50,3
                            97,50
                            50,97
                            3,50
                        "
                        className="custom-path-shape-element"
                    />
                )}

                {shape === "heart" && (
                    <path
                        d="
                            M 50 90

                            C 42 82,
                              10 62,
                              10 34

                            C 10 17,
                              21 8,
                              34 8

                            C 42 8,
                              48 13,
                              50 19

                            C 52 13,
                              58 8,
                              66 8

                            C 79 8,
                              90 17,
                              90 34

                            C 90 62,
                              58 82,
                              50 90

                            Z
                        "
                        className="custom-path-shape-element"
                    />
                )}
            </svg>

            {showNumber && (
                <span
                    className="custom-path-field-number"
                    style={{
                        transform:
                            `translate(-50%, -50%) rotate(${-angle}rad)`,
                    }}
                >
                    {number}
                </span>
            )}
        </>
    );
}