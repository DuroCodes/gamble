<script lang="ts">
  import { balance } from "~/utils/stores";

  $: balanceFormatted = $balance.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const amounts = [100, 500, 1000];
  let selectedAmount = amounts[0];

  function adjustBalance(multiplier: number) {
    $balance += selectedAmount * multiplier;
  }
</script>

<div class="relative">
  <p class="text-sm font-medium text-slate-300">Balance</p>
  <div class="flex">
    <div class="relative flex-1">
      <div
        class="w-full rounded-l-md border-2 border-slate-600 bg-slate-900 py-2 pl-7 pr-2 text-sm text-white"
      >
        <div
          class="absolute left-3 top-2 select-none text-base text-slate-500"
          aria-hidden="true"
        >
          $
        </div>
        <div>{balanceFormatted}</div>
      </div>
    </div>
    <select
      bind:value={selectedAmount}
      class="border-y-2 border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white appearance-none focus:outline-none"
    >
      {#each amounts as amount}
        <option value={amount}>${amount}</option>
      {/each}
    </select>
    <div class="flex">
      <button
        on:click={() => adjustBalance(-1)}
        class="touch-manipulation bg-slate-600 px-4 font-bold text-white transition-colors hover:bg-slate-500 active:bg-slate-400"
      >
        -
      </button>
      <button
        on:click={() => adjustBalance(1)}
        class="relative touch-manipulation rounded-r-md bg-slate-600 px-4 text-sm font-bold text-white transition-colors after:absolute after:left-0 after:inline-block after:h-1/2 after:w-[2px] after:bg-slate-800 after:content-[''] hover:bg-slate-500 active:bg-slate-400"
      >
        +
      </button>
    </div>
  </div>
</div>
