<script lang="ts">
  import { binColorsByRowCount } from "~/utils/consts";
  import { winRecords } from "~/utils/stores";

  export let winCount = 4;

  $: lastWins = $winRecords.slice(-winCount).toReversed();
</script>

<div
  class="flex w-[clamp(1.5rem,0.893rem+2.857vw,2rem)] flex-col overflow-hidden rounded-sm text-[clamp(8px,5.568px+0.714vw,10px)] md:rounded-md lg:w-12 lg:text-sm"
  style:aspect-ratio={`1 / ${winCount}`}
>
  {#each lastWins as { binIndex, rowCount, payout: [multiplier] }}
    <div
      class="flex aspect-square items-center justify-center font-bold text-gray-950"
      style:background-color={binColorsByRowCount[rowCount].background[
        binIndex
      ]}
    >
      {multiplier}×
    </div>
  {/each}
</div>
