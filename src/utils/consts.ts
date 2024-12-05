import { getBinColors, type BinColors } from "./colors";

export const DEFAULT_BALANCE = 200;
export const BALANCE_STORAGE_KEY = "gamble_balance";

export const rowCountOptions = [8, 9, 10, 11, 12, 13, 14, 15, 16] as const;
export type RowCount = (typeof rowCountOptions)[number];

export const binColorsByRowCount = rowCountOptions.reduce((acc, rowCount) => {
  acc[rowCount] = getBinColors(rowCount);
  return acc;
}, {} as Record<RowCount, BinColors>);

export const BIN_PAYOUTS: Record<RowCount, number[]> = {
  8: [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13],
  9: [18, 4, 1.7, 0.9, 0.5, 0.5, 0.9, 1.7, 4, 18],
  10: [22, 5, 2, 1.4, 0.6, 0.4, 0.6, 1.4, 2, 5, 22],
  11: [24, 6, 3, 1.8, 0.7, 0.5, 0.5, 0.7, 1.8, 3, 6, 24],
  12: [33, 11, 4, 2, 1.1, 0.6, 0.3, 0.6, 1.1, 2, 4, 11, 33],
  13: [43, 13, 6, 3, 1.3, 0.7, 0.4, 0.4, 0.7, 1.3, 3, 6, 13, 43],
  14: [58, 15, 7, 4, 1.9, 1, 0.5, 0.2, 0.5, 1, 1.9, 4, 7, 15, 58],
  15: [88, 18, 11, 5, 3, 1.3, 0.5, 0.3, 0.3, 0.5, 1.3, 3, 5, 11, 18, 88],
  16: [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110],
} as const;

export const binColor = {
  background: {
    red: [255, 0, 63],
    yellow: [255, 192, 0],
  },
  shadow: {
    red: [166, 0, 4],
    yellow: [171, 121, 0],
  },
} as const;
