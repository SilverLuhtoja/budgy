// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod file_op;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            file_op::create_dir,
            file_op::create_dir_all,
            file_op::create_file, 
            file_op::read_file, 
            file_op::write_file,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
