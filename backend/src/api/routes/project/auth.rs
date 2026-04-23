use std::sync::Arc;

use axum::{Router, routing::post};

use crate::{
    common::config::Config,
    platform::project_auth::handlers::{forgot_password, login, logout, sign_up},
};
pub fn routes() -> Router<Arc<Config>> {
    Router::new()
        .route("/login", post(login))
        .route("/sign-up", post(sign_up))
        .route("/logout", post(logout))
        .route("/forgot-password", post(forgot_password))
}
