<script lang="ts">
  import { rowCountOptions } from "~/utils/consts";
  import {
    balance,
    betAmount,
    betAmountOfBalls,
    plinkoEngine,
    rowCount,
  } from "~/utils/stores";
  import type { FormEventHandler } from "svelte/elements";
  import { twMerge } from "tailwind-merge";
  import Profit from "./Profit.svelte";
  import ProfitHistoryChart from "./ProfitHistoryChart.svelte";
  import Balance from "./Balance.svelte";

  $: betAmountNegative = $betAmount < 0;
  $: betExceedsBalance = $betAmount > $balance;
  $: ballDropDisabled =
    !$plinkoEngine || betAmountNegative || betExceedsBalance;
  $: inGame = Object.keys($betAmountOfBalls).length > 0;

  const betAmountFocusOut: FormEventHandler<HTMLInputElement> = (e) => {
    const parsed = parseFloat(e.currentTarget.value.trim());
    if (isNaN(parsed)) {
      $betAmount = -1;
      $betAmount = 0;
    }

    $betAmount = parsed;
  };

  const betClick = () => $plinkoEngine?.dropBall();

  const rowCounts = rowCountOptions.map((value) => ({
    value,
    label: value.toString(),
  }));
</script>

<div class="flex flex-col gap-5 bg-slate-700 p-3 lg:max-w-80">
  <Balance />
  <div class="relative">
    <label for="betAmount" class="text-sm font-medium text-slate-300">
      Bet Amount
    </label>
    <div class="flex">
      <div class="relative flex-1">
        <input
          id="betAmount"
          value={$betAmount}
          on:focusout={betAmountFocusOut}
          type="number"
          min="0"
          step="0.01"
          inputmode="decimal"
          class={twMerge(
            "w-full rounded-l-md border-2 border-slate-600 bg-slate-900 py-2 pl-7 pr-2 text-sm text-white transition-colors hover:cursor-pointer focus:border-slate-500 focus:outline-none disabled:cursor-not-allowed  disabled:opacity-50 hover:[&:not(:disabled)]:border-slate-500",
            (betAmountNegative || betExceedsBalance) &&
              "border-red-500 focus:border-red-400 hover:[&:not(:disabled)]:border-red-400",
          )}
        />
        <div
          class="absolute left-3 top-2 select-none text-slate-500"
          aria-hidden="true"
        >
          $
        </div>
      </div>
      <button
        on:click={() => {
          $betAmount = parseFloat(($betAmount / 2).toFixed(2));
        }}
        class="touch-manipulation bg-slate-600 px-4 font-bold diagonal-fractions text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:[&:not(:disabled)]:bg-slate-500 active:[&:not(:disabled)]:bg-slate-400"
      >
        1/2
      </button>
      <button
        on:click={() => {
          $betAmount = parseFloat(($betAmount * 2).toFixed(2));
        }}
        class="relative touch-manipulation rounded-r-md bg-slate-600 px-4 text-sm font-bold text-white transition-colors after:absolute after:left-0 after:inline-block after:h-1/2 after:w-[2px] after:bg-slate-800 after:content-[''] disabled:cursor-not-allowed disabled:opacity-50 hover:[&:not(:disabled)]:bg-slate-500 active:[&:not(:disabled)]:bg-slate-400"
      >
        2×
      </button>
    </div>
    {#if betAmountNegative}
      <p class="absolute text-xs leading-5 text-red-400">
        Bet amount must be a positive number
      </p>
    {:else if betExceedsBalance}
      <p class="absolute text-xs leading-S text-red-400">
        You don't have enough money
      </p>
    {/if}
  </div>

  <div>
    <label for="rowCount" class="text-sm font-medium text-slate-300">
      Rows
    </label>

    <select
      id="rowCount"
      bind:value={$rowCount}
      disabled={inGame}
      class="block w-full appearance-none rounded-md border-2 border-slate-600 bg-slate-900 py-2 pl-3 pr-8 text-sm text-white transition hover:cursor-pointer focus:border-slate-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 hover:[&:not(:disabled)]:border-slate-500"
    >
      {#each rowCounts as { value, label }}
        <option {value}>{label}</option>
      {/each}
    </select>
  </div>

  <button
    on:click={betClick}
    disabled={ballDropDisabled}
    class="touch-manipulation rounded-md bg-green-500 py-3 font-semibold text-slate-900 transition-colors hover:bg-green-400 active:bg-green-600 disabled:bg-neutral-600 disabled:text-neutral-400"
  >
    Drop Ball
  </button>

  <div class="flex flex-col gap-4">
    <Profit />
    <ProfitHistoryChart />
  </div>
</div>
