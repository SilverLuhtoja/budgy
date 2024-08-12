// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs::{read_to_string, File}, io::Write};
use std::path::Path;
// use std::io::prelude::*;

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

// #[tauri::command]
// fn create_file(path: String) -> Result<(), String> {
//     // Attempt to create and write to the file
//     let mut file = File::create(path)
//         .map_err(|e| e.to_string())?; // Convert the error to a String
//     file.write_all(b"Hello, world!")
//         .map_err(|e| e.to_string())?; // Convert the error to a String
//     Ok(())
// }

#[tauri::command]
async fn write_file(path: String, content: String) -> Result<String, String> {
    if Path::new(&path).exists(){
        println!("File already exists");
    }

    match File::create(&path).and_then(|mut file| file.write_all(content.as_bytes())) {
        Ok(_) => Ok("Write succesful".to_string()),
        Err(e) => Err(format!("Failed to create file '{}': {}", path, e.to_string())),
    }
}

#[tauri::command]
async fn create_file(path: String) -> Result<String, String> {
    match File::create(&path) {
        Ok(_) => Ok("file created".to_string()),
        Err(e) => Ok(format!("Failed to create file '{}': {}", &path, e.to_string()))
    }
}

#[tauri::command]
fn read_file(path: String) -> Result<String, String> {
    // Attempt to read the file contents
    match read_to_string(&path) {
        Ok(contents) => Ok(contents),
        Err(e) => Ok(format!("Failed to read file '{}': {}", &path, e.to_string())),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, create_file, read_file, write_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
