import { ask, open } from '@tauri-apps/api/dialog';
import {
  readTextFile,
  exists,
  createDir,
  copyFile,
  readDir,
} from '@tauri-apps/api/fs';

const BASE_PATH = '.';
const ORGINAL_FILE_BATH = `${BASE_PATH}/resources/original_files`;
const PROCESSED_FILE_BATH = `${BASE_PATH}/resources/processed_files`;
const OPTIONS_FILE_BATH = `${BASE_PATH}/resources/options`;

const getFileName = path => {
  let splitted = path.split('/');
  return splitted[splitted.length - 1];
};

const getFileNameInOriginalDir = path => {
  return ORGINAL_FILE_BATH + '/' + getFileName(path);
};

const createFile = async source_path => {
  const destination_path = ORGINAL_FILE_BATH + '/' + getFileName(source_path);
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

    await createFile(selectedPath);
    return await readTextFile(getFileNameInOriginalDir(selectedPath));
  } catch (err) {
    console.error(err);
  }
};

const createOriginalDir = async () => {
  try {
    const isOriginalDir = await exists(ORGINAL_FILE_BATH);
    if (isOriginalDir) return;

    await createDir(ORGINAL_FILE_BATH, { recursive: true });
    console.log('directory created : ', ORGINAL_FILE_BATH);
  } catch (err) {
    console.error(err);
  }
};

const readOriginalDir = async () => {
  const files = await readDir(ORGINAL_FILE_BATH);
  return files
};

export { readFileContents, createOriginalDir, readOriginalDir };