<script lang="ts">
  import type { Action } from "svelte/action";
  import { BIN_PAYOUTS, binColorsByRowCount } from "~/utils/consts";
  import { plinkoEngine, rowCount, winRecords } from "~/utils/stores";
  import { getBinsWidthPercentage } from "~/utils/engines/plinko";

  let binAnimations = $state<Animation[]>([]);
  let currentRowCount = $derived($rowCount);
  let records = $derived($winRecords);
  let engine = $derived($plinkoEngine);

  $effect(() => {
    if (records.length) {
      const lastWinBinIndex = records[records.length - 1].binIndex;
      playAnimation(lastWinBinIndex);
    }
  });

  const initAnimation: Action<HTMLDivElement> = (node) => {
    const bounceAnimation = node.animate(
      [
        { transform: "translateY(0)" },
        { transform: "translateY(30%)" },
        { transform: "translateY(0)" },
      ],
      {
        duration: 300,
        easing: "cubic-bezier(0.18, 0.89, 0.32, 1.28)",
      },
    );
    bounceAnimation.pause();
    binAnimations.push(bounceAnimation);
  };

  const playAnimation = (binIndex: number) => {
    const animation = binAnimations[binIndex];
    animation.cancel();
    animation.play();
  };
</script>

<div
  class="flex h-[clamp(10px,0.352px+2.609vw,16px)] w-full justify-center lg:h-7"
>
  {#if engine}
    <div
      class="flex gap-[1%]"
      style:width={`${getBinsWidthPercentage(currentRowCount) * 100}%`}
    >
      {#each BIN_PAYOUTS[currentRowCount] as payout, binIndex}
        <div
          use:initAnimation
          class="flex min-w-0 flex-1 items-center justify-center rounded-sm text-[clamp(6px,2.784px+0.87vw,8px)] font-bold text-gray-950 shadow-[0_2px_var(--shadow-color)] lg:rounded-md lg:text-[clamp(10px,-16.944px+2.632vw,12px)]"
          style:background-color={binColorsByRowCount[currentRowCount]
            .background[binIndex]}
          style:--shadow-color={binColorsByRowCount[currentRowCount].shadow[
            binIndex
          ]}
        >
          {payout}×
        </div>
      {/each}
    </div>
  {/if}
</div>
