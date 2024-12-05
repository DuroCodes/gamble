<script lang="ts">
  import PlinkoBoard from "./PlinkoBoard.svelte";
  import Sidebar from "./Sidebar.svelte";
  import { setBalance, saveBalance } from "~/utils/balance";

  $effect.root(() => {
    setBalance();
  });
</script>

<svelte:window on:beforeunload={saveBalance} />

<div class="relative flex min-h-dvh w-full flex-col">
  <div class="flex-1 px-5">
    <div class="mx-auto mt-5 min-w-[300px] max-w-xl md:mt-10 lg:max-w-7xl">
      <div
        class="flex flex-col-reverse overflow-hidden rounded-lg lg:w-full lg:flex-row"
      >
        <Sidebar />
        <div class="flex-1 bg-slate-900">
          <PlinkoBoard />
        </div>
      </div>
    </div>
  </div>
</div>
