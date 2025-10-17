export const normalizeWeights = (weights: Record<string, number>) => {
  const sum = Object.values(weights).reduce((acc, value) => acc + value, 0);
  if (sum === 0) return weights;
  return Object.fromEntries(Object.entries(weights).map(([key, value]) => [key, Number((value / sum).toFixed(4))]));
};
