pub mod handlers;
pub mod middleware;
pub mod routes;

use axum::{
    Router,
    extract::{Path, State},
    http::{HeaderValue, Method, header},
    routing::get,
};
use tower_http::cors::CorsLayer;

use crate::core::models::AppState;

pub fn routes(state: AppState) -> Router {
    let cors = CorsLayer::new()
        .allow_origin("http://localhost:3000".parse::<HeaderValue>().unwrap())
        .allow_headers([header::CONTENT_TYPE, header::AUTHORIZATION])
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE]);
    Router::new()
        .route("/", get(|| async { "hellow" }))
        .route("/name/{name}", get(get_name))
        .merge(routes::auth::routes())
        .layer(cors)
        .with_state(state)
}

pub async fn get_name(State(app_state): State<AppState>, Path(name): Path<String>) -> String {
    format!("hello, {} from app: {}", name, app_state.app_name)
}
