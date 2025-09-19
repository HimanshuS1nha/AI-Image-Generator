// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use dotenv::dotenv;
use reqwest::{Client, StatusCode};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Deserialize, Serialize)]
struct ResponseData {
    image: String,
}

#[derive(Deserialize, Serialize)]
struct ResponseError {
    error: String,
}

#[derive(Deserialize, Serialize)]
struct RequestError(String);

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn generate_image(prompt: String, aspect_ratio: String) -> Result<String, RequestError> {
    let mut url = std::env::var("API_URL").expect("API_URL not set");
    url = url + "/api/generate";

    let mut map = HashMap::new();

    map.insert("prompt", prompt);
    map.insert("aspectRatio", aspect_ratio);

    let client = Client::new();

    let res = client.post(&url).json(&map).send().await.map_err(|err| {
        RequestError(format!(
            "Error occured during the request: {}",
            err.to_string()
        ))
    })?;

    let status = res.status();

    if status == StatusCode::OK {
        let data: ResponseData = res.json().await.map_err(|err| {
            RequestError(format!(
                "Error occured while parsing the response: {}",
                err.to_string()
            ))
        })?;

        Ok(data.image)
    } else {
        let data: ResponseError = res.json().await.map_err(|err| {
            RequestError(format!(
                "Error occured while parsing the response: {}",
                err.to_string()
            ))
        })?;

        Err(RequestError(data.error))
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    dotenv().ok();

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, generate_image])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
