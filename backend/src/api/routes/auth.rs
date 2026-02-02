use axum::{
    Router,
    routing::{get, post},
};

use crate::{
    api::handlers::auth::{auth_check, login, logout, sign_up},
    core::models::AppState,
};
pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/auth-check", get(auth_check))
        .route("/login", post(login))
        .route("/sign-up", post(sign_up))
        .route("/logout", post(logout))
}
