#[derive(Clone)]
pub struct AppState {
    pub app_name: String,
}

pub fn state() -> AppState {
    AppState {
        app_name: "Donut".to_string(),
    }
}
