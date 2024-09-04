import { EST_MONTHS, extractMonthYear } from "./file_scripts";

export const getPlannedSpendingTotal = (total, planned_expending_weight) =>
  total * 0.01 * planned_expending_weight;

export const getActualSpendedPercentageFromPLanned = (planned_total, spended_total) =>
  (spended_total / planned_total) * 100;

export const getLastMonthFilename = (currentMonthFilename) => {
  let [currentMonth, year] = extractMonthYear(currentMonthFilename);
  const currentMonthIdx = EST_MONTHS.indexOf(currentMonth)
  
  if(currentMonth == EST_MONTHS[0]) {
    return EST_MONTHS[EST_MONTHS.length - 1] + "_" + (year - 1).toString()
  }

  return EST_MONTHS[currentMonthIdx - 1] + '_' + year.toString();
}