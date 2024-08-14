import { ask, open } from '@tauri-apps/api/dialog';
import {
  readTextFile,
  exists,
  createDir,
  copyFile,
  readDir,
  writeFile,
} from '@tauri-apps/api/fs';

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
    await copyFile(source_path, destination_path);
  } catch (err) {
    console.error(err);
  }
};

const saveProcessFile = async (source_path, fileContent) => {
  if (!source_path) return
  const destination_path = PROCESSED_FILE_PATH + '/' + source_path;
  const isOriginalFile = await exists(destination_path);

  if (isOriginalFile) {
    const answer = await ask(
      `File ${getFileName(
        source_path
      )} is already present in destination. Would you like to overwrite it ?`,
      { type: 'info', okLabel: 'Yes', cancelLabel: 'No' }
    );
    if (!answer) return;
  }


  try {
    await writeFile({
      path: destination_path,
      contents: JSON.stringify(fileContent, null, 2),
    });
  } catch (err) {
    console.error(err);
  }
};

const getConfigurations = async () => {
  let isCreated = await exists(CONFIGURATIONS_FILE_PATH);
  if (!isCreated) {
    await writeFile({
      path: CONFIGURATIONS_FILE_PATH,
      contents: JSON.stringify({}, null, 2),
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
        return await readTextFile(path);
    }

    const selectedPath = await open({
      multiple: false,
      title: 'Open text file',
      defaultPath: '../',
    });

    if (!selectedPath) return;

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
    console.log('directory created : ', dir_path);
  } catch (err) {
    console.error(err);
  }
};

const readDirPath = async dir_path => {
  const files = await readDir(dir_path);
  return files;
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
};