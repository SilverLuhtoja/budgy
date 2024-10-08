import { readFileContents } from './file_scripts';
import pathManager from '../routes/pathManager.js'

const OPTIONS_ERROR = 'ERROR: Options are invalid for this file';
const NO_COLUMN_ERROR = 'ERROR: No column available';
const NO_OPTIONS_SELECTED_INFO = 'INFO: No options selected';

const FILTER_PAYMENT_DESCRIPTION = 'Selgitus';
const FILTER_RECEIVER_PAYER = 'Saaja/Maksja';
const FILTER_SUM_VALUE = 'Summa';
const FILTER_DEBIT_CREDIT = 'Deebet/Kreedit';

const COLUMN_OPTIONS = ['Kuupäev', 'Saaja/Maksja', 'Selgitus', 'Summa', 'Deebet/Kreedit'];

// fileContent is array of lines
const processStatment = async fileContent => {
  const removedColumnContent = processColumnSelection(fileContent, COLUMN_OPTIONS);
  let filteredByCategoryContent = await filterExpenses(removedColumnContent);
  return filteredByCategoryContent;
};

const filterExpenses = async data => {
  const optionsData = JSON.parse( await readFileContents(pathManager.paths.CONFIGURATIONS_FILE_PATH));
  let entries = Object.entries(optionsData);
  let not_filtered_list = []
  let SumUpCategories = {};
  const receiverPayerIdx = getColumnIndex(data[0], FILTER_RECEIVER_PAYER);
  const explanationIdx = getColumnIndex(data[0], FILTER_PAYMENT_DESCRIPTION);
  const sumIdx = getColumnIndex(data[0], FILTER_SUM_VALUE);
  const debetIdx = getColumnIndex(data[0], FILTER_DEBIT_CREDIT);

  for (let i = 1; i < data.length; i++) {
    let pushed = false
    for (const [key, values] of entries) {
      if (key == 'saved-options') continue
      if (isMatch(values, data[i], [explanationIdx, receiverPayerIdx]) && values.length > 0) {
        let number = Number(data[i][sumIdx]);
        if (data[i][debetIdx] == 'K' && key != 'INCOME') {
          number = -number;
        }

        if (!SumUpCategories[key]) {
          SumUpCategories[key] = {
            total: 0,
            details: [],
          };
        }

        SumUpCategories[key]['total'] += number;
        SumUpCategories[key]['total'] = roundUpToDecimalsByTwo(SumUpCategories[key]['total'])
        SumUpCategories[key]['details'].push(data[i]);
        pushed = true
        break;
      }
    }

    if(!pushed){
      not_filtered_list.push(data[i]);
    }
  }

  not_filtered_list = removeExtraFields(not_filtered_list)
  if (not_filtered_list.length > 0){
    SumUpCategories['not_filtered'] = {
      details: not_filtered_list,
    };
  }

  return SumUpCategories;
};

const roundUpToDecimalsByTwo = (num) => {
  const factor = Math.pow(10, 2);
  return Math.ceil(num * factor) / factor;
};

function isMatch(values, data_row, filterIndexes) {
  // const pattern = new RegExp(`\\b(${values.join('|')})\\b`, 'i')
  const pattern = new RegExp(`(?:\\W|^)(${values.join('|')})(?:\\W|$)`, 'i');;
  
  if (pattern.test(data_row[filterIndexes[0]]) || pattern.test(data_row[filterIndexes[1]])) {
    return true;
  }
  return false;
}

const processColumnSelection = (lines, columnOptions) => {
  const newContent = [columnOptions];
  const firstLineColumns = lines[0].split(',');
  if (!isValidOptions(firstLineColumns, columnOptions)) return OPTIONS_ERROR;
  if (columnOptions.length === 0) return NO_OPTIONS_SELECTED_INFO;

  const indexes = getColumnIndexes(firstLineColumns, columnOptions);
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] == '') {
      continue;
    }
    let filteredContent = [];
    let choppedLine = lines[i].split(',');

    if (choppedLine.length != firstLineColumns.length) {
      choppedLine = replaceCommasInsideQuotes(lines[i]).split(',');
    }

    indexes.forEach(idx => filteredContent.push(choppedLine[idx]));
    newContent.push(filteredContent);
  }

  return newContent;
};

const replaceCommasInsideQuotes = line => {
  // Match the section within quotes
  return line.replace(/"(.*?)"/g, function (match) {
    // Replace commas within the matched section
    return match.replace(/,/g, ';');
  });
};

const getColumnIndex = (fileColumns, columnName) => {
  for (let i = 0; i < fileColumns.length; i++) {
    if (fileColumns[i] == columnName) {
      return i;
    }
  }

  throw NO_COLUMN_ERROR;
};

const getColumnIndexes = (fileColumns, givenOptions) => {
  let indexes = [];
  for (let i = 0; i < fileColumns.length; i++) {
    for (let j = 0; j < givenOptions.length; j++) {
      if (fileColumns[i] == givenOptions[j]) {
        indexes.push(i);
      }
    }
  }

  return indexes;
};

const isValidOptions = (fileColumns, givenOptions) => {
  givenOptions.forEach(column => {
    if (!fileColumns.includes(column)) {
      return false;
    }
  });

  return true;
};

const removeExtraFields = list => {
  if (list.length <= 4) {
    return [];
  }
  return list.slice(1, -3);
};

export { processColumnSelection, processStatment, roundUpToDecimalsByTwo };
