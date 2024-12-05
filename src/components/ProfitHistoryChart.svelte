<script lang="ts">
  import { profitHistory } from "~/utils/stores";
  import { formatCurrency } from "~/utils/number";
  import Chart, { type ScriptableLineSegmentContext } from "chart.js/auto";
  import type { Action } from "svelte/action";

  let hoveredProfit: number | null = null;

  const WIN_COLOR = "rgb(74, 222, 128)";
  const WIN_COLOR_FILL = "rgba(74, 222, 128, 0.3)";
  const LOSS_COLOR = "rgb(248, 113, 113)";
  const LOSS_COLOR_FILL = "rgba(248, 113, 113, 0.3)";
  const X_AXIS_COLOR = "rgb(30, 41, 59)";
  const POINT_HOVER_COLOR = "rgb(255, 255, 255)";

  const makeChart: Action<HTMLCanvasElement, { profit: number[] }> = (
    node,
    { profit },
  ) => {
    const chart = new Chart(node, {
      type: "line",
      data: {
        labels: Array(profit.length).fill(""),
        datasets: [
          {
            label: "Profit",
            data: profit,
            fill: {
              target: "origin",
              above: WIN_COLOR_FILL,
              below: LOSS_COLOR_FILL,
            },
            cubicInterpolationMode: "monotone",
            segment: {
              borderColor: (ctx: ScriptableLineSegmentContext) =>
                ctx.p1.parsed.y === 0
                  ? ctx.p0.parsed.y < 0
                    ? LOSS_COLOR
                    : WIN_COLOR
                  : ctx.p1.parsed.y < 0
                    ? LOSS_COLOR
                    : WIN_COLOR,
            },
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: POINT_HOVER_COLOR,
            pointHoverBorderColor: POINT_HOVER_COLOR,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animations: {
          y: { duration: 0 },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
        scales: {
          x: {
            border: { display: false },
            grid: { display: false },
            ticks: { display: false },
          },
          y: {
            border: { display: false },
            grid: {
              color: (ctx) => (ctx.tick.value === 0 ? X_AXIS_COLOR : undefined),
              lineWidth: 2,
            },
            ticks: { display: false },
            grace: "1%",
          },
        },
        onHover: (_, elements) => {
          if (elements.length) {
            const selectedIdx = elements[0].index;
            hoveredProfit = $profitHistory[selectedIdx];
          }
        },
      },
    });

    return {
      update: ({ profit }) => {
        chart.data.labels = Array(profit.length).fill("");
        chart.data.datasets[0].data = profit;
        chart.update();
      },
      destroy: () => chart.destroy(),
    };
  };
</script>

<div class="relative rounded-md bg-slate-900 p-4 text-sm">
  <p class="font-medium text-slate-400">Profit History</p>
  <p
    class={`absolute font-semibold tabular-nums ${hoveredProfit !== null && hoveredProfit >= 0 ? "text-green-400" : "text-red-400"}`}
  >
    {hoveredProfit !== null ? formatCurrency(hoveredProfit) : "N/A"}
  </p>
  <div class="mt-6">
    <canvas
      use:makeChart={{ profit: $profitHistory }}
      on:mouseleave={() => (hoveredProfit = null)}
    ></canvas>
  </div>
</div>
