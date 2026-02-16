use serde::Deserialize;

use super::models::ProjectStatus;

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
