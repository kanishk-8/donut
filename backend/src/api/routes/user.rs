use std::sync::Arc;

use axum::{
    Router,
    routing::{get, post},
};

use crate::{
    api::handlers::auth::{me, update_password},
    core::models::AppState,
};

pub fn routes() -> Router<Arc<AppState>> {
    Router::new()
        .route("/update-password", post(update_password))
        .route("/me", get(me))
}
