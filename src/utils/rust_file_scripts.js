import { invoke } from "@tauri-apps/api";

export const write_file = async (path, content) => {
    return await invoke('write_file', {
      path: path,
      content: JSON.stringify(content, null, 2),
    });
}

export const read_file = async (path) => {
  return await invoke('read_file', { path });
};
