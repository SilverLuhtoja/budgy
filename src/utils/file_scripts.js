import { ask, open } from '@tauri-apps/api/dialog';
import {
  readTextFile,
  exists,
  createDir,
  copyFile,
  readDir,
  writeFile,
} from '@tauri-apps/api/fs';
import { remove_file } from './rust_file_scripts';

export const EST_MONTHS = ['jaanuar', 'veebruar', 'märts', 'aprill', 'mai', 'juuni', 'juuli', 'august', 'september', 'oktoober', 'november', 'detsember']
const YEAR_SUFFIX = ['2023','2024', '2025']

export const ORGINAL_FILE_PATH = `./resources/original_files`;
export const PROCESSED_FILE_PATH = `./resources/processed_files`;
export const CONFIG_FILE_PATH = `./resources/configurations`
export const CONFIGURATIONS_FILE_PATH = `${CONFIG_FILE_PATH}/configurations.json`;
export const EXPENDITURE_SETTINGS_PATH = `${CONFIG_FILE_PATH}/expenditure_settings.json`;

const getFileName = path => {
  let splitted = path.split('/');
  return splitted[splitted.length - 1];
};

const getFileNameInOriginalDir = path => {
  return ORGINAL_FILE_PATH + '/' + getFileName(path);
};

const createOriginalFile = async source_path => {
  const destination_path = ORGINAL_FILE_PATH + '/' + getFileName(source_path);
  const isOriginalFile = await exists(destination_path);
  if (isOriginalFile) {
    const answer = await ask(
      `File ${getFileName(source_path)} is already present in destination. Would you like to overwrite it ?`,
      { type: 'info', okLabel: 'Yes', cancelLabel: 'No' }
    );
    if (!answer) return;
  }

  try {
    let content = await readFileContents(source_path);
    let lines = content.split('\n');
    let new_content = []
    for (let i = 0; i < lines.length; i++) {
      if (lines[i] == '') {
        continue;
      }

      new_content.push(normalizeLine(lines[i]));
    }

    await writeFile({
      path: destination_path,
      contents: new_content.join("\n"),
    });
  } catch (err) {
    console.error(err);
  }
};

const normalizeLine = (line) => {
  return replaceCommasInsideQuotes(line)
    .replaceAll(',', '.')
    .replaceAll('"', '')
    .replaceAll(';', ',');
}

const replaceCommasInsideQuotes = line => {
  // Match the section within quotes
  return line.replace(/"(.*?)"/g, function (match) {
      // Replace commas within the matched section
      return match.replace(/;/g, '-');
    });
};

const saveProcessFile = async (source_path, fileContent) => {
  if (!source_path) return
  const destination_path = PROCESSED_FILE_PATH + '/' + source_path;
  const isOriginalFile = await exists(destination_path);
  const saving_path = anyNotFilteredContent(fileContent) ? destination_path + '(!)' : destination_path;

  if (isOriginalFile) {
    const answer = await ask(
      `File ${getFileName(source_path)} is already present in destination. Would you like to overwrite it ?`,
      { type: 'info', okLabel: 'Yes', cancelLabel: 'No' }
    );
    if (!answer) return;
  }
  
  const removable_file = saving_path.includes('(!)') ? destination_path : destination_path + '(!)';
  if (await exists(removable_file)) {
    await remove_file(removable_file);
  }
    
  try {
    await writeFile({
      path: saving_path,
      contents: JSON.stringify(fileContent, null, 2),
    });
  } catch (err) {
    console.error(err);
  }
};

const anyNotFilteredContent = fileContent => {
  return Object.keys(fileContent).includes('not_filtered');
};

const getConfigurations = async () => {
  let isCreated = await exists(CONFIGURATIONS_FILE_PATH);
  if (!isCreated) {
    let default_configs = {
      "INCOME" : []
    }
    await writeFile({
      path: CONFIGURATIONS_FILE_PATH,
      contents: JSON.stringify(default_configs, null, 2),
    });
    return;
  }
  return await readTextFile(CONFIGURATIONS_FILE_PATH);
}

const saveConfigurationFile = async (configurations) => {
  if (configurations === '' || configurations === undefined) return;

  try {
    await writeFile({
      path: CONFIGURATIONS_FILE_PATH,
      contents: JSON.stringify(configurations, null, 2),
    });
  } catch (err) {
    console.error(err);
  }
}

const getExpenditureConfigurations = async () => {
  let isCreated = await exists(EXPENDITURE_SETTINGS_PATH);
  if (!isCreated) {
    await writeFile({
      path: EXPENDITURE_SETTINGS_PATH,
      contents: JSON.stringify({}, null, 2),
    });
    return;
  }
  return await readTextFile(EXPENDITURE_SETTINGS_PATH);
};

const saveExpenditureConfigurations = async configurations => {
  if (configurations === '' || configurations === undefined) return;

  try {
    await writeFile({
      path: EXPENDITURE_SETTINGS_PATH,
      contents: JSON.stringify(configurations, null, 2),
    });
  } catch (err) {
    console.error(err);
  }
};

const readFileContents = async (path = null) => {
  try {
    if (path != null) {
        return await readTextFile(path.toLowerCase());
    }

    const selectedPath = await open({
      multiple: false,
      title: 'Open text file',
      defaultPath: '../',
    });

    if (!selectedPath) return;

    const parts = getFileName(selectedPath).split('_');
    
    if (parts.length != 2) {
      return new Error('Filename should have format > month_year.csv');
    }
    
    if (!EST_MONTHS.includes(parts[0].toLowerCase())) {
      return new Error(`Filename not correct, should contain values > ${EST_MONTHS}`);
    }
    
    const suffix_part = parts[1].split(".")[0]
    if (!YEAR_SUFFIX.includes(suffix_part)) {
      return new Error(`File year not correct, should contain values > ${YEAR_SUFFIX}`);
    }

    await createOriginalFile(selectedPath);
    return await readTextFile(getFileNameInOriginalDir(selectedPath));
  } catch (err) {
    console.error(err);
  }
};

const createDirPath = async dir_path => {
  try {
    const isOriginalDir = await exists(dir_path);
    if (isOriginalDir) return;

    await createDir(dir_path, { recursive: true });
  } catch (err) {
    console.error(err);
  }
};

const readDirPath = async dir_path => {
  const files = await readDir(dir_path);
  return files;
};

const sortFilesByMonthsAndYear = files => {
  // Filter out the files with month names
  let monthFiles = files.filter(file =>
    EST_MONTHS.some(month => file.name.includes(month))
  );

  // Sort monthFiles by year and month
  monthFiles.sort((a, b) => {
    let [monthA, yearA] = extractMonthYear(a.name);
    let [monthB, yearB] = extractMonthYear(b.name);

    if (yearA === yearB) {
      return EST_MONTHS.indexOf(monthA) - EST_MONTHS.indexOf(monthB);
    } 
    return yearA - yearB;
  });

  // Get the non-month files
  let notSorted = files.filter(
    file => !EST_MONTHS.some(month => file.name.includes(month))
  );

  return monthFiles.concat(notSorted);
};

const extractMonthYear = filename => {
  for (const month of EST_MONTHS) {
    if (filename.includes(month)) {
      let yearMatch = filename.match(/\d{4}/);
      let year = yearMatch ? parseInt(yearMatch[0]) : null;
      return [month, year];
    }
  }
  return [null, null];
};

export {
  readFileContents,
  createDirPath,
  readDirPath,
  saveProcessFile,
  getFileName,
  getConfigurations,
  saveConfigurationFile,
  getExpenditureConfigurations,
  saveExpenditureConfigurations,
  sortFilesByMonthsAndYear,
  extractMonthYear,
};