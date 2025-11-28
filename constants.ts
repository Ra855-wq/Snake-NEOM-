export const GRID_SIZE = 20; // Size of one grid cell in pixels (logical)
export const CANVAS_SIZE = 400; // Total canvas size in pixels
export const GRID_COUNT = CANVAS_SIZE / GRID_SIZE; // Number of cells per row/col

export const INITIAL_SPEED = 150; // ms per tick
export const MIN_SPEED = 50; // Fastest speed
export const SPEED_DECREMENT = 2; // How much speed increases per food

export const COLOR_NEON_BLUE = '#06b6d4'; // Tailwind cyan-500
export const COLOR_NEON_GLOW = 'rgba(6, 182, 212, 0.5)';
export const COLOR_BG = '#020617'; // Tailwind slate-950
export const COLOR_GRID = '#1e293b'; // Tailwind slate-800

export const KEY_HIGH_SCORE = 'snake_neom_highscore';