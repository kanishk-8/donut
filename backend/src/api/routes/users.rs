use std::sync::Arc;

use axum::{
    Router,
    routing::{get, post},
};

use crate::{
    core::models::Config,
    platform::auth::handlers::{me, update_password},
};

pub fn routes() -> Router<Arc<Config>> {
    Router::new()
        .route("/update-password", post(update_password))
        .route("/me", get(me))
}
