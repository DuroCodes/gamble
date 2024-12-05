import type { RowCount } from "./consts";

export type BetAmountOfBalls = Record<number, number>;

type Payout = [multiplier: number, payout: number];

export interface WinRecord {
  id: string;
  betAmount: number;
  rowCount: RowCount;
  binIndex: number;
  payout: Payout;
  profit: number;
}
