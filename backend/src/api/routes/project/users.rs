use std::sync::Arc;

use axum::{
    Router,
    routing::{get, post},
};

use crate::{
    common::config::Config,
    platform::project_auth::handlers::{me, refresh, update_password},
};

pub fn routes() -> Router<Arc<Config>> {
    Router::new()
        .route("/update-password", post(update_password))
        .route("/me", get(me))
        .route("/refresh", get(refresh))
}
