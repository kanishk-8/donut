use axum::Json;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Project {
    id: String,
    name: String,
    description: String,
    project_type: String,
    status: String,
    user_id: String,
    created_at: String,
    updated_at: String,
}
pub async fn create_project() -> String {
    "Create Project".to_string()
}

pub async fn get_project() -> Json<Project> {
    let project = Project {
        id: "1".to_string(),
        name: "Project 1".to_string(),
        description: "This is a sample project".to_string(),
        project_type: "Type A".to_string(),
        status: "Active".to_string(),
        user_id: "1".to_string(),
        created_at: "2024-01-01T00:00:00Z".to_string(),
        updated_at: "2024-01-01T00:00:00Z".to_string(),
    };
    Json(project)
}

pub async fn list_projects() -> Json<Vec<Project>> {
    let project = Project {
        id: "1".to_string(),
        name: "Project 1".to_string(),
        description: "This is a sample project".to_string(),
        project_type: "Type A".to_string(),
        status: "Active".to_string(),
        user_id: "1".to_string(),
        created_at: "2024-01-01T00:00:00Z".to_string(),
        updated_at: "2024-01-01T00:00:00Z".to_string(),
    };
    Json(vec![project])
}

pub async fn update_project() -> String {
    "Update Project".to_string()
}

pub async fn delete_project() -> String {
    "Delete Project".to_string()
}
