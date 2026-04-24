use super::models::{Project, ProjectStatus};
use serde::Serialize;

/// Response for project operations
#[derive(Debug, Serialize)]
pub struct ProjectResponse {
    pub id: String,
    pub name: String,
    pub description: String,
    #[serde(rename = "type")]
    pub project_type: String,
    pub status: String,
    pub user_id: String,
    pub created_at: String,
    pub updated_at: String,
}

impl From<Project> for ProjectResponse {
    fn from(project: Project) -> Self {
        Self {
            id: project.id,
            name: project.name,
            description: project.description,
            project_type: project.project_type,
            status: match project.status {
                ProjectStatus::Development => "Development".to_string(),
                ProjectStatus::Active => "Active".to_string(),
                ProjectStatus::Archived => "Archived".to_string(),
                ProjectStatus::Failed => "Failed".to_string(),
            },
            user_id: project.user_id,
            created_at: project.created_at,
            updated_at: project.updated_at,
        }
    }
}
#[derive(Debug, Serialize)]
pub struct CreateApiKeyResponse {
    pub id: String,
    pub project_id: String,
    pub name: Option<String>,
    pub key: String, // raw key shown once
    pub key_prefix: String,
    pub role: String,
    pub created_at: String,
    pub expires_at: Option<String>,
}
