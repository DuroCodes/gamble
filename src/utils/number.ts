export const countOccurances = <T extends string | number>(values: T[]) =>
  values.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {} as Record<T, number>);

export const randomBetween = (min: number, max: number) =>
  min + Math.random() * (max - min);

export const formatCurrency = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
