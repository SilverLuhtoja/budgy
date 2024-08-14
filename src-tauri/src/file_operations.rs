use std::fs::File;
use std::io::prelude::*;

#[tauri::command]
async fn create_file(path: String) {
    let mut file = File::create("foo.txt")?;
    file.write_all(b"Hello, world!")?;
}