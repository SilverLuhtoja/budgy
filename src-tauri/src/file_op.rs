use std::fs::{self, File};
use std::io::Write;
use std::path::Path;
use std::fs::read_to_string;

#[tauri::command]
pub async fn write_file(path: String, content: String) -> Result<String, String> {
    // if Path::new(&path).exists(){
        // println!("File already exists");
    // }

    match File::create(&path).and_then(|mut file| file.write_all(content.as_bytes())) {
        Ok(_) => Ok("Write succesful".to_string()),
        Err(e) => Err(format!("Failed to create file '{}': {}", path, e.to_string())),
    }
}

#[tauri::command]
pub async fn create_dir(path: String) -> Result<String, String> {
    match fs::create_dir(&path) {
        Ok(_) => Ok("Directory created".to_string()),
        Err(e) => Ok(format!("Failed to create directory '{}': {}", &path, e.to_string()))
    }
}

#[tauri::command]
pub async fn create_file(path: String) -> Result<String, String> {
    match File::create(&path) {
        Ok(_) => Ok("File created".to_string()),
        Err(e) => Ok(format!("Failed to create file '{}': {}", &path, e.to_string()))
    }
}

#[tauri::command]
pub fn read_file(path: String) -> Result<String, String> {
     if !Path::new(&path).exists(){
        println!("No file");
    }
    // Attempt to read the file contents
    match read_to_string(&path) {
        Ok(contents) => Ok(contents),
        Err(e) => Ok(format!("Failed to read file '{}': {}", &path, e.to_string())),
    }
}