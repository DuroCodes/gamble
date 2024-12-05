import type { RowCount } from "./consts";

type RgbColor = readonly [red: number, green: number, blue: number];

export const gradient = (start: RgbColor, end: RgbColor, length: number) =>
  Array.from(
    { length },
    (_, i) =>
      [
        Math.round(start[0] + ((end[0] - start[0]) / (length - 1)) * i),
        Math.round(start[1] + ((end[1] - start[1]) / (length - 1)) * i),
        Math.round(start[2] + ((end[2] - start[2]) / (length - 1)) * i),
      ] as const,
  );

export const rgbToCss = (rgb: RgbColor) => `rgb(${rgb.join(", ")})`;

export type BinColors = ReturnType<typeof getBinColors>;
export const getBinColors = (rowCount: RowCount) => {
  const binCount = rowCount + 1;
  const binsEven = binCount % 2 === 0;
  const gradientLength = Math.ceil(binCount / 2);

  const binGradientBg = gradient(
    [255, 0, 63],
    [255, 192, 0],
    gradientLength,
  ).map(rgbToCss);

  const binGradientShadow = gradient(
    [166, 0, 4],
    [171, 121, 0],
    gradientLength,
  ).map(rgbToCss);

  return {
    background: [
      ...binGradientBg,
      ...binGradientBg.toReversed().slice(binsEven ? 0 : 1),
    ],
    shadow: [
      ...binGradientShadow,
      ...binGradientShadow.toReversed().slice(binsEven ? 0 : 1),
    ],
  };
};
