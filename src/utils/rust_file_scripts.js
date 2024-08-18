import { invoke } from '@tauri-apps/api';
import { exists } from '@tauri-apps/api/fs';

export const write_file = async (path, content) => {
  if (content === '' || content === undefined) return;

  return await invoke('write_file', {
    path: path,
    content: JSON.stringify(content, null, 2),
  });
};

export const read_file = async path => {
  return await invoke('read_file', { path });
};

export const create_dir = async path => {
  return await invoke('create_dir', { path });
};

export const create_file = async path => {
  return await invoke('create_file', { path });
};

export const create_empty_json_file = async path => {
  const isCreated = await exists(path);
  if (!isCreated) return await invoke('write_file', { path: path, content: '{}' });
};