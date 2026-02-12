use axum::{
    Router,
    routing::{get, post},
};

use crate::{
    api::handlers::project::{create_project, get_project, list_projects},
    core::models::AppState,
};

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/projects", get(list_projects))
        .route("/projects/{id}", get(get_project))
}
