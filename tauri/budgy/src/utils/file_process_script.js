const OPTIONS_ERROR = 'ERROR: Options are invalid for this file';
const NO_OPTIONS_SELECTED_INFO= 'INFO: No options selected';

const seperateByCategories = () => {

}


const processColumnSelection = (lines, columnOptions) => {
  const newContent = [columnOptions];
  const firstLineColumns = lines[0].split(',');
  if (!isValidOptions(firstLineColumns, columnOptions)) return OPTIONS_ERROR;
  if (columnOptions.length === 0) return NO_OPTIONS_SELECTED_INFO;

  const indexes = getColumnIndexes(firstLineColumns, columnOptions);
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] == "") {
      continue
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
      console.log(column);
      return false;
    }
  });

  return true;
};

export { processColumnSelection };
