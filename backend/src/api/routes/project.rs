use std::sync::Arc;

use axum::{Router, routing::get};

use crate::{
    api::handlers::project::{
        create_project, delete_project, get_project, list_projects, update_project,
    },
    core::models::AppState,
};

pub fn routes() -> Router<Arc<AppState>> {
    Router::new()
        .route("/projects", get(list_projects).post(create_project))
        .route(
            "/projects/{id}",
            get(get_project).put(update_project).delete(delete_project),
        )
}
