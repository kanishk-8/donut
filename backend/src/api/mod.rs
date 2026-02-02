pub mod handlers;
pub mod middleware;
pub mod routes;

use axum::{
    Router,
    extract::{Path, State},
    routing::get,
};

use crate::core::models::AppState;

pub fn routes(state: AppState) -> Router {
    Router::new()
        .route("/", get(|| async { "hellow" }))
        .route("/name/{name}", get(get_name))
        .merge(routes::auth::routes())
        .with_state(state)
}

pub async fn get_name(State(app_state): State<AppState>, Path(name): Path<String>) -> String {
    format!("hello, {} from app: {}", name, app_state.app_name)
}
