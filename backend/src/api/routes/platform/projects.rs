use std::sync::Arc;

use axum::{
    Router,
    routing::{get, post},
};

use crate::{
    common::config::Config,
    platform::projects::handlers::{
        create_api_key, create_project, delete_api_key, delete_project, get_project, list_projects,
        update_project,
    },
};

pub fn routes() -> Router<Arc<Config>> {
    Router::new()
        .route("/projects", get(list_projects).post(create_project))
        .route(
            "/projects/{id}",
            get(get_project).put(update_project).delete(delete_project),
        )
        .route("/projects/{id}/api-keys", post(create_api_key))
        .route("/projects/{id}/api-keys/{api_key_id}", post(delete_api_key))
}
