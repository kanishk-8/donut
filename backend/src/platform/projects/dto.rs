use serde::{Deserialize, Serialize};

use super::models::{Project, ProjectStatus};

/// Request to create a new project
#[derive(Debug, Deserialize)]
pub struct CreateProjectRequest {
    pub name: String,
    pub description: Option<String>,
    pub status: Option<String>,
}

/// Request to update an existing project
#[derive(Debug, Deserialize)]
pub struct UpdateProjectRequest {
    pub name: Option<String>,
    pub description: Option<String>,
    pub status: Option<String>,
}

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

impl CreateProjectRequest {
    /// Validate and parse status string to ProjectStatus
    pub fn parse_status(&self) -> Result<ProjectStatus, String> {
        match self.status.as_deref() {
            None => Ok(ProjectStatus::Development),
            Some(s) if s.eq_ignore_ascii_case("draft") || s.eq_ignore_ascii_case("development") => {
                Ok(ProjectStatus::Development)
            }
            Some(s) if s.eq_ignore_ascii_case("deployed") || s.eq_ignore_ascii_case("active") => {
                Ok(ProjectStatus::Active)
            }
            Some(s) if s.eq_ignore_ascii_case("archived") => Ok(ProjectStatus::Archived),
            Some(s) if s.eq_ignore_ascii_case("failed") => Ok(ProjectStatus::Failed),
            Some(s) => Err(format!(
                "Invalid status '{}'. Allowed: draft, development, deployed, active, archived, failed",
                s
            )),
        }
    }
}

impl UpdateProjectRequest {
    /// Validate and parse status string to ProjectStatus
    pub fn parse_status(&self) -> Result<Option<ProjectStatus>, String> {
        match self.status.as_deref() {
            None => Ok(None),
            Some(s) if s.eq_ignore_ascii_case("draft") || s.eq_ignore_ascii_case("development") => {
                Ok(Some(ProjectStatus::Development))
            }
            Some(s) if s.eq_ignore_ascii_case("deployed") || s.eq_ignore_ascii_case("active") => {
                Ok(Some(ProjectStatus::Active))
            }
            Some(s) if s.eq_ignore_ascii_case("archived") => Ok(Some(ProjectStatus::Archived)),
            Some(s) if s.eq_ignore_ascii_case("failed") => Ok(Some(ProjectStatus::Failed)),
            Some(s) => Err(format!(
                "Invalid status '{}'. Allowed: draft, development, deployed, active, archived, failed",
                s
            )),
        }
    }
}
