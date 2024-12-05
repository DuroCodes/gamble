<script lang="ts">
  import { winRecords } from "~/utils/stores";
  import { formatCurrency } from "~/utils/number";

  $: profit = $winRecords.reduce((acc, record) => acc + record.profit, 0);
  $: wins = $winRecords.filter((record) => record.profit > 0).length;
  $: losses = $winRecords.filter((record) => record.profit < 0).length;

  $: winsFormatted = wins.toLocaleString("en-US");
  $: lossesFormatted = losses.toLocaleString("en-US");
</script>

<div class="rounded-md bg-slate-900 p-4 text-sm">
  <div class="flex md:grid md:grid-cols-3 gap-6">
    <div class="flex md:flex-col md:w-full md:text-center">
      <span class="font-medium text-slate-400 md:mb-1">Profit:</span>
      <span
        class={`ml-2 md:ml-0 font-semibold tabular-nums ${profit >= 0 ? "text-green-400" : "text-red-400"}`}
      >
        {formatCurrency(profit)}
      </span>
    </div>
    <div class="flex md:flex-col md:w-full md:text-center">
      <span class="font-medium text-slate-400 md:mb-1">Wins:</span>
      <span class="ml-2 md:ml-0 font-semibold tabular-nums text-green-400">
        {winsFormatted}
      </span>
    </div>
    <div class="flex md:flex-col md:w-full md:text-center">
      <span class="font-medium text-slate-400 md:mb-1">Losses:</span>
      <span class="ml-2 md:ml-0 font-semibold tabular-nums text-red-400">
        {lossesFormatted}
      </span>
    </div>
  </div>
</div>
