import {
    PathPoint,
} from "../models/CustomPath";

import {
    LineSegment,
} from "../models/Geometry";

export interface PathFieldPosition {
    x: number;
    y: number;
    angle: number;
}

export interface ContinuousPathResult {
    fields: PathFieldPosition[];

    dividers: LineSegment[];

    fieldLengthMm: number;
}

interface PathSegment {
    start: PathPoint;
    end: PathPoint;

    length: number;

    startDistance: number;
}

interface PathMetrics {
    segments: PathSegment[];

    totalLength: number;
}

interface PathSample {
    x: number;
    y: number;

    angle: number;
}

function buildPathMetrics(
    points: PathPoint[]
): PathMetrics {
    const segments:
        PathSegment[] = [];

    let totalLength = 0;

    for (
        let i = 0;
        i < points.length - 1;
        i++
    ) {
        const start =
            points[i];

        const end =
            points[i + 1];

        const dx =
            end.x - start.x;

        const dy =
            end.y - start.y;

        const length =
            Math.hypot(
                dx,
                dy
            );

        if (length <= 0.001) {
            continue;
        }

        segments.push({
            start,
            end,
            length,

            startDistance:
                totalLength,
        });

        totalLength +=
            length;
    }

    return {
        segments,
        totalLength,
    };
}

function samplePathAtDistance(
    metrics: PathMetrics,
    targetDistance: number
): PathSample | null {
    if (
        metrics.segments.length ===
        0
    ) {
        return null;
    }

    const distance =
        Math.max(
            0,
            Math.min(
                metrics.totalLength,
                targetDistance
            )
        );

    for (
        let i = 0;
        i < metrics.segments.length;
        i++
    ) {
        const segment =
            metrics.segments[i];

        const segmentEndDistance =
            segment.startDistance +
            segment.length;

        if (
            distance <=
            segmentEndDistance
        ) {
            const distanceInsideSegment =
                distance -
                segment.startDistance;

            const ratio =
                Math.max(
                    0,
                    Math.min(
                        1,
                        distanceInsideSegment /
                        segment.length
                    )
                );

            const dx =
                segment.end.x -
                segment.start.x;

            const dy =
                segment.end.y -
                segment.start.y;

            return {
                x:
                    segment.start.x +
                    dx * ratio,

                y:
                    segment.start.y +
                    dy * ratio,

                angle:
                    Math.atan2(
                        dy,
                        dx
                    ),
            };
        }
    }

    const lastSegment =
        metrics.segments[
        metrics.segments.length -
        1
        ];

    return {
        x:
            lastSegment.end.x,

        y:
            lastSegment.end.y,

        angle:
            Math.atan2(
                lastSegment.end.y -
                lastSegment.start.y,

                lastSegment.end.x -
                lastSegment.start.x
            ),
    };
}

interface GenerateFieldsAlongPathOptions {
    points: PathPoint[];

    fieldCount: number;
}

export function generateFieldsAlongPath({
    points,
    fieldCount,
}: GenerateFieldsAlongPathOptions): PathFieldPosition[] {
    if (
        points.length < 2 ||
        fieldCount < 2
    ) {
        return [];
    }

    const metrics =
        buildPathMetrics(
            points
        );

    if (
        metrics.totalLength <= 0
    ) {
        return [];
    }

    const spacing =
        metrics.totalLength /
        (fieldCount - 1);

    const fields:
        PathFieldPosition[] = [];

    for (
        let i = 0;
        i < fieldCount;
        i++
    ) {
        const distance =
            Math.min(
                i * spacing,
                metrics.totalLength
            );

        const sample =
            samplePathAtDistance(
                metrics,
                distance
            );

        if (sample) {
            fields.push(
                sample
            );
        }
    }

    return fields;
}

interface GenerateContinuousPathOptions {
    points: PathPoint[];

    fieldCount: number;

    pathWidthMm: number;
}

export function generateContinuousPath({
    points,
    fieldCount,
    pathWidthMm,
}: GenerateContinuousPathOptions): ContinuousPathResult {
    if (
        points.length < 2 ||
        fieldCount < 1 ||
        pathWidthMm <= 0
    ) {
        return {
            fields: [],
            dividers: [],
            fieldLengthMm: 0,
        };
    }

    const metrics =
        buildPathMetrics(
            points
        );

    if (
        metrics.totalLength <= 0
    ) {
        return {
            fields: [],
            dividers: [],
            fieldLengthMm: 0,
        };
    }

    const fieldLengthMm =
        metrics.totalLength /
        fieldCount;

    const fields:
        PathFieldPosition[] = [];

    const dividers:
        LineSegment[] = [];

    for (
        let i = 0;
        i < fieldCount;
        i++
    ) {
        const distance =
            (
                i + 0.5
            ) *
            fieldLengthMm;

        const sample =
            samplePathAtDistance(
                metrics,
                distance
            );

        if (sample) {
            fields.push(
                sample
            );
        }
    }

    for (
        let i = 1;
        i < fieldCount;
        i++
    ) {
        const distance =
            i *
            fieldLengthMm;

        const sample =
            samplePathAtDistance(
                metrics,
                distance
            );

        if (!sample) {
            continue;
        }

        const normalAngle =
            sample.angle +
            Math.PI / 2;

        const halfWidth =
            pathWidthMm / 2;

        const offsetX =
            Math.cos(
                normalAngle
            ) *
            halfWidth;

        const offsetY =
            Math.sin(
                normalAngle
            ) *
            halfWidth;

        dividers.push({
            x1:
                sample.x -
                offsetX,

            y1:
                sample.y -
                offsetY,

            x2:
                sample.x +
                offsetX,

            y2:
                sample.y +
                offsetY,
        });
    }

    return {
        fields,
        dividers,
        fieldLengthMm,
    };
}

export function calculatePathLength(
    points: PathPoint[]
): number {
    return buildPathMetrics(
        points
    ).totalLength;
}

interface CalculateRecommendedMaxFieldsOptions {
    points: PathPoint[];

    fieldSizeMm: number;

    minimumGapMm?: number;
}

export function calculateRecommendedMaxFields({
    points,
    fieldSizeMm,
    minimumGapMm = 1,
}: CalculateRecommendedMaxFieldsOptions): number {
    if (
        points.length < 2 ||
        fieldSizeMm <= 0
    ) {
        return 0;
    }

    const pathLength =
        calculatePathLength(
            points
        );

    if (pathLength <= 0) {
        return 0;
    }

    const requiredSpacing =
        fieldSizeMm +
        minimumGapMm;

    return Math.max(
        2,
        Math.floor(
            pathLength /
            requiredSpacing
        ) + 1
    );
}

function fieldsOverlap(
    fields: PathFieldPosition[],
    fieldSizeMm: number,
    minimumGapMm: number
): boolean {
    const minimumDistance =
        fieldSizeMm +
        minimumGapMm;

    for (
        let i = 0;
        i < fields.length;
        i++
    ) {
        for (
            let j = i + 1;
            j < fields.length;
            j++
        ) {
            const distance =
                Math.hypot(
                    fields[i].x -
                    fields[j].x,

                    fields[i].y -
                    fields[j].y
                );

            if (
                distance <
                minimumDistance
            ) {
                return true;
            }
        }
    }

    return false;
}

interface CustomPathOverlapOptions {
    points: PathPoint[];

    fieldCount: number;

    fieldSizeMm: number;

    minimumGapMm?: number;
}

export function customPathHasOverlap({
    points,
    fieldCount,
    fieldSizeMm,
    minimumGapMm = 1,
}: CustomPathOverlapOptions): boolean {
    const fields =
        generateFieldsAlongPath({
            points,
            fieldCount,
        });

    return fieldsOverlap(
        fields,
        fieldSizeMm,
        minimumGapMm
    );
}

interface FindSafeFieldCountOptions {
    points: PathPoint[];

    requestedFieldCount: number;

    fieldSizeMm: number;

    minimumGapMm?: number;
}

export function findSafeFieldCount({
    points,
    requestedFieldCount,
    fieldSizeMm,
    minimumGapMm = 1,
}: FindSafeFieldCountOptions): number {
    if (
        points.length < 2 ||
        requestedFieldCount < 2
    ) {
        return 0;
    }

    const recommendedMax =
        calculateRecommendedMaxFields({
            points,
            fieldSizeMm,
            minimumGapMm,
        });

    let candidateCount =
        Math.min(
            requestedFieldCount,
            recommendedMax
        );

    while (
        candidateCount >= 2
    ) {
        const fields =
            generateFieldsAlongPath({
                points,

                fieldCount:
                    candidateCount,
            });

        if (
            !fieldsOverlap(
                fields,
                fieldSizeMm,
                minimumGapMm
            )
        ) {
            return candidateCount;
        }

        candidateCount--;
    }

    return 0;
}