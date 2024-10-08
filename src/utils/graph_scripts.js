import { exists } from "@tauri-apps/api/fs";
import { EST_MONTHS, extractMonthYear, readDirPath, readFileContents } from "./file_scripts";
import { roundUpToDecimalsByTwo } from "./file_process_script";
import pathManager from '../routes/pathManager.js'

export const getPlannedSpendingTotal = (total, planned_expending_weight) =>
  total * 0.01 * planned_expending_weight;

export const getActualSpentPercentageFromPLanned = (planned_total, spent_total) =>
  (spent_total / planned_total) * 100;

export const getLastMonthFilename = (currentMonthFilename) => {
  let [currentMonth, year] = extractMonthYear(currentMonthFilename);
  const currentMonthIdx = EST_MONTHS.indexOf(currentMonth)
  
  if(currentMonth == EST_MONTHS[0]) {
    return EST_MONTHS[EST_MONTHS.length - 1] + "_" + (year - 1).toString()
  }

  return EST_MONTHS[currentMonthIdx - 1] + '_' + year.toString();
}

export const getMonthData = async (month, year) => {
  const path = `${pathManager.paths.PROCESSED_FILE_PATH}/${month}_${year}`.toLowerCase();
  if (await exists(path)) {
    return JSON.parse(await readFileContents(path));
  }
};

export const getProcessedAvailableYears = async () => {
    let files = await readDirPath(pathManager.paths.PROCESSED_FILE_PATH);
    return new Set(files.map(file => extractMonthYear(file.name)[1]).sort());
}

export const buildOverView = (data, expen_settings) => {
  let planned_totals = [];
  
  if (data['INCOME'] != undefined || data['INCOME'] != null) {
    let total_income = data['INCOME'].total;
    for (let key in expen_settings) {
      // dont count in expenditure which key value is 0
      // if (data[key] == undefined || expen_settings[key] == 0) continue
      if (data[key] == undefined) continue;
      let gat_data = {};

      gat_data['name'] = key;
      gat_data['planned_percent'] = expen_settings[key];
      gat_data['planned_total'] = roundUpToDecimalsByTwo(getPlannedSpendingTotal(total_income, expen_settings[key]));
      gat_data['actual_percent'] = Math.ceil((data[key].total * 100) / total_income);
      gat_data['actual_total'] = roundUpToDecimalsByTwo(data[key].total);
      gat_data['difference_percent'] = gat_data['planned_percent'] - gat_data['actual_percent'];
      gat_data['difference_total'] = roundUpToDecimalsByTwo(gat_data['planned_total'] - gat_data['actual_total']);

      planned_totals.push(gat_data);
    }

    return planned_totals;
  }

  throw new Error('No income to calculate planned expending totals');
};