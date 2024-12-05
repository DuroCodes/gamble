<script lang="ts">
  import CircleNotch from "phosphor-svelte/lib/CircleNotch";
  import type { Action } from "svelte/action";
  import BinsRow from "./BinsRow.svelte";
  import LastWins from "./LastWins.svelte";
  import { config, createPlinkoEngine } from "~/utils/engines/plinko";
  import { plinkoEngine } from "~/utils/stores";

  const makePlinko: Action<HTMLCanvasElement> = (node) => {
    $plinkoEngine = createPlinkoEngine(node);
    $plinkoEngine.start();

    return {
      destroy: () => {
        $plinkoEngine?.stop();
      },
    };
  };
</script>

<div class="relative bg-gray-900">
  <div
    class="mx-auto flex h-full flex-col px-4 pb-4"
    style:max-width={`${config.width}px`}
  >
    <div
      class="relative w-full"
      style:aspect-ratio={`${config.width} / ${config.height}`}
    >
      {#if $plinkoEngine === null}
        <div
          class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <CircleNotch
            class="size-20 animate-spin text-slate-600"
            weight="bold"
          />
        </div>
      {/if}

      <canvas
        use:makePlinko
        width={config.width}
        height={config.height}
        class="absolute inset-0 h-full w-full"
      ></canvas>
    </div>
    <BinsRow />
  </div>
  <div class="absolute right-[5%] top-1/2 -translate-y-1/2">
    <LastWins />
  </div>
</div>
