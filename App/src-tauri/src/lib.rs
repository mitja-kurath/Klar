use std::sync::{Arc, Mutex};
use std::time::Duration;
use tauri::{Emitter, Manager, State, WebviewUrl, WebviewWindowBuilder};
use serde::{Deserialize, Serialize};
use tokio::time::interval;
#[derive(Debug, Clone, Serialize, Deserialize)]
struct Task {
    id: String,
    text: String,
    completed: bool,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
struct TasksState {
    tasks: Vec<Task>,
    completed_tasks: usize,
    total_tasks: usize,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
struct TimerState {
    time_left: u32,
    is_active: bool,
    is_paused: bool,
    is_break: bool,
}
type AppState = Arc<Mutex<(TimerState, TasksState)>>;
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
#[tauri::command]
async fn timer_start(state: State<'_, AppState>, app: tauri::AppHandle) -> Result<(), String> {
    let mut app_state = state.lock().map_err(|e| e.to_string())?;
    app_state.0.is_active = true;
    app_state.0.is_paused = false;
    app.emit("timer-update", &app_state.0).map_err(|e| e.to_string())?;
    let state_clone = state.inner().clone();
    let app_clone = app.clone();
    tokio::spawn(async move {
        let mut interval = interval(Duration::from_secs(1));
        loop {
            interval.tick().await;
            let should_continue = {
                let mut app_state = match state_clone.lock() {
                    Ok(state) => state,
                    Err(_) => break,
                };
                if app_state.0.is_active && !app_state.0.is_paused {
                    if app_state.0.time_left > 0 {
                        app_state.0.time_left -= 1;
                        if let Err(e) = app_clone.emit("timer-update", &app_state.0) {
                            println!("Failed to emit timer update: {}", e);
                        }
                        if app_state.0.time_left == 0 {
                            app_state.0.is_active = false;
                            app_state.0.is_break = !app_state.0.is_break;
                            app_state.0.time_left = if app_state.0.is_break { 300 } else { 1500 };
                            if let Err(e) = app_clone.emit("timer-update", &app_state.0) {
                                println!("Failed to emit timer completion: {}", e);
                            }
                        }
                        true
                    } else {
                        false
                    }
                } else {
                    app_state.0.is_active
                }
            };
            if !should_continue {
                break;
            }
        }
    });
    Ok(())
}
#[tauri::command]
async fn timer_pause(state: State<'_, AppState>, app: tauri::AppHandle) -> Result<(), String> {
    let mut app_state = state.lock().map_err(|e| e.to_string())?;
    app_state.0.is_paused = !app_state.0.is_paused;
    app.emit("timer-update", &app_state.0).map_err(|e| e.to_string())?;
    Ok(())
}
#[tauri::command]
async fn timer_stop(state: State<'_, AppState>, app: tauri::AppHandle) -> Result<(), String> {
    let mut app_state = state.lock().map_err(|e| e.to_string())?;
    app_state.0.is_active = false;
    app_state.0.is_paused = false;
    app_state.0.time_left = 1500;
    app.emit("timer-update", &app_state.0).map_err(|e| e.to_string())?;
    Ok(())
}
#[tauri::command]
async fn get_timer_state(state: State<'_, AppState>) -> Result<TimerState, String> {
    let app_state = state.lock().map_err(|e| e.to_string())?;
    Ok(app_state.0.clone())
}
#[tauri::command]
async fn get_tasks(state: State<'_, AppState>) -> Result<TasksState, String> {
    let app_state = state.lock().map_err(|e| e.to_string())?;
    Ok(app_state.1.clone())
}
#[tauri::command]
async fn toggle_task(id: String, state: State<'_, AppState>, app: tauri::AppHandle) -> Result<(), String> {
    let mut app_state = state.lock().map_err(|e| e.to_string())?;
    if let Some(task) = app_state.1.tasks.iter_mut().find(|t| t.id == id) {
        task.completed = !task.completed;
        app_state.1.completed_tasks = app_state.1.tasks.iter().filter(|t| t.completed).count();
        app.emit("tasks-update", &app_state.1).map_err(|e| e.to_string())?;
    }
    Ok(())
}
#[tauri::command]
async fn create_timer_widget_window(app: tauri::AppHandle) -> Result<(), String> {
    println!("Creating timer widget window...");
    let window = WebviewWindowBuilder::new(
        &app,
        "timer-widget",
        WebviewUrl::App("timer-widget.html".into())
    )
    .title("Timer Widget")
    .inner_size(320.0, 350.0)
    .resizable(false)
    .always_on_top(true)
    .skip_taskbar(true)
    .decorations(false)
    .transparent(true)
    .shadow(false)
    .position(100.0, 100.0)
    .visible(true)
    .build()
    .map_err(|e| {
        println!("Failed to create timer widget window: {}", e);
        e.to_string()
    })?;
    window.show().map_err(|e| {
        println!("Failed to show timer widget window: {}", e);
        e.to_string()
    })?;
    window.set_focus().map_err(|e| {
        println!("Failed to focus timer widget window: {}", e);
        e.to_string()
    })?;
    println!("Timer widget window created successfully");
    Ok(())
}
#[tauri::command]
async fn create_tasks_widget_window(app: tauri::AppHandle) -> Result<(), String> {
    println!("Creating tasks widget window...");
    let window = WebviewWindowBuilder::new(
        &app,
        "tasks-widget",
        WebviewUrl::App("tasks-widget.html".into())
    )
    .title("Tasks Widget")
    .inner_size(320.0, 400.0)
    .resizable(false)
    .always_on_top(true)
    .skip_taskbar(true)
    .decorations(false)
    .transparent(true)
    .shadow(false)
    .position(450.0, 100.0)
    .visible(true)
    .build()
    .map_err(|e| {
        println!("Failed to create tasks widget window: {}", e);
        e.to_string()
    })?;
    window.show().map_err(|e| {
        println!("Failed to show tasks widget window: {}", e);
        e.to_string()
    })?;
    window.set_focus().map_err(|e| {
        println!("Failed to focus tasks widget window: {}", e);
        e.to_string()
    })?;
    println!("Tasks widget window created successfully");
    Ok(())
}
#[tauri::command]
async fn close_timer_widget(app: tauri::AppHandle) -> Result<(), String> {
    println!("Closing timer widget window...");
    if let Some(timer_window) = app.get_webview_window("timer-widget") {
        if let Err(e) = timer_window.close() {
            println!("Failed to close timer widget: {}", e);
            return Err(e.to_string());
        } else {
            println!("Timer widget closed successfully");
        }
    } else {
        println!("Timer widget not found (already closed)");
    }
    Ok(())
}
#[tauri::command]
async fn close_tasks_widget(app: tauri::AppHandle) -> Result<(), String> {
    println!("Closing tasks widget window...");
    if let Some(tasks_window) = app.get_webview_window("tasks-widget") {
        if let Err(e) = tasks_window.close() {
            println!("Failed to close tasks widget: {}", e);
            return Err(e.to_string());
        } else {
            println!("Tasks widget closed successfully");
        }
    } else {
        println!("Tasks widget not found (already closed)");
    }
    Ok(())
}
#[tauri::command]
async fn close_all_widgets(app: tauri::AppHandle) -> Result<(), String> {
    println!("Closing all widget windows...");
    if let Some(timer_window) = app.get_webview_window("timer-widget") {
        if let Err(e) = timer_window.close() {
            println!("Failed to close timer widget: {}", e);
        } else {
            println!("Timer widget closed successfully");
        }
    }
    if let Some(tasks_window) = app.get_webview_window("tasks-widget") {
        if let Err(e) = tasks_window.close() {
            println!("Failed to close tasks widget: {}", e);
        } else {
            println!("Tasks widget closed successfully");
        }
    }
    println!("All widgets closed");
    Ok(())
}
#[tauri::command]
async fn remove_task(id: String, state: State<'_, AppState>, app: tauri::AppHandle) -> Result<(), String> {
    let mut app_state = state.lock().map_err(|e| e.to_string())?;
    app_state.1.tasks.retain(|t| t.id != id);
    app_state.1.total_tasks = app_state.1.tasks.len();
    app_state.1.completed_tasks = app_state.1.tasks.iter().filter(|t| t.completed).count();
    app.emit("tasks-update", &app_state.1).map_err(|e| e.to_string())?;
    Ok(())
}
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let initial_timer_state = TimerState {
        time_left: 1500,
        is_active: false,
        is_paused: false,
        is_break: false,
    };
    let initial_tasks_state = TasksState {
        tasks: vec![
            Task {
                id: "1".to_string(),
                text: "Complete project setup".to_string(),
                completed: false,
            },
            Task {
                id: "2".to_string(),
                text: "Test widget functionality".to_string(),
                completed: false,
            },
        ],
        completed_tasks: 0,
        total_tasks: 2,
    };
    let app_state: AppState = Arc::new(Mutex::new((initial_timer_state, initial_tasks_state)));
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![
            greet,
            timer_start,
            timer_pause,
            timer_stop,
            get_timer_state,
            get_tasks,
            toggle_task,
            remove_task,
            create_timer_widget_window,
            create_tasks_widget_window,
            close_timer_widget,
            close_tasks_widget,
            close_all_widgets
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


