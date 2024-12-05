import { derived, writable } from "svelte/store";
import { DEFAULT_BALANCE, type RowCount } from "./consts";
import type { BetAmountOfBalls, WinRecord } from "./types";
import { getBinColors } from "./colors";
import { countOccurances } from "./number";
import type { PlinkoEngine } from "./engines/plinko";

export const plinkoEngine = writable<PlinkoEngine | null>(null);
export const betAmount = writable(1);
export const betAmountOfBalls = writable<BetAmountOfBalls>({});
export const rowCount = writable<RowCount>(16);
export const winRecords = writable<WinRecord[]>([]);
export const profitHistory = writable([0]);
export const balance = writable(DEFAULT_BALANCE);
export const binColors = derived(rowCount, getBinColors);

export const binProbabilities = derived(
  [winRecords, rowCount],
  ([$winRecords, $rowCount]) => {
    const occurances = countOccurances(
      $winRecords.map(({ binIndex }) => binIndex),
    );

    return Object.fromEntries(
      Array.from({ length: $rowCount + 1 }, (_, i) => [
        i,
        occurances[i] / $winRecords.length,
      ]),
    );
  },
);

export const settingsOpen = writable(false);
export const statsOpen = writable(false);
