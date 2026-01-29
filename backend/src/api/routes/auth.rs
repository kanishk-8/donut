use axum::{
    Router,
    routing::{get, post},
};

use crate::core::models::AppState;

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/auth-check", get(auth_check))
        .route("/login", post(login))
        .route("/sign-up", post(sign_up))
}

pub async fn auth_check() -> &'static str {
    "auth"
}

pub async fn login() -> &'static str {
    "login"
}

pub async fn sign_up() -> &'static str {
    "signup"
}
