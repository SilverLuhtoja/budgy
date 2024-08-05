export const getPlannedSpendingTotal = (total, planned_expending_weight) =>
  total * 0.01 * planned_expending_weight;

export const getActualSpendedPercentageFromPLanned = (planned_total, spended_total) =>
  (spended_total / planned_total) * 100;
