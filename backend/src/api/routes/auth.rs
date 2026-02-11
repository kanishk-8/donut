use axum::{Router, routing::post};

use crate::{
    api::handlers::auth::{login, logout, sign_up},
    core::models::AppState,
};
pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/login", post(login))
        .route("/sign-up", post(sign_up))
        .route("/logout", post(logout))
}
