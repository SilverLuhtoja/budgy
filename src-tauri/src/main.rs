// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::File;
use std::io::prelude::*;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// #[tauri::command]
// fn expand_scope(app_handle: tauri::AppHandle, folder_path: std::path::PathBuf) -> Result<(), String> {
//   // If possible, verify your path if it comes from your frontend.

//   // true means that we want inner directories allowed too
//   app_handle.fs_scope().allow_directory(&folder_path, true)
//     .map_err(|err| err.to_string())
// }

#[tauri::command]
fn create_file(path: String) -> Result<(), String> {
    // Attempt to create and write to the file
    let mut file = File::create(path)
        .map_err(|e| e.to_string())?; // Convert the error to a String
    file.write_all(b"Hello, world!")
        .map_err(|e| e.to_string())?; // Convert the error to a String
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, create_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
