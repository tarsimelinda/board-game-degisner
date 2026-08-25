export type GridPreset =
    | "large"
    | "medium"
    | "small";

export const GRID_PRESET_SIZE: Record<GridPreset, number> = {
    large: 5,
    medium: 8,
    small: 13,
};