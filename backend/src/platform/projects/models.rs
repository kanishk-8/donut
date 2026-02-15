use serde::{Deserialize, Serialize};

use crate::storage::repositories::projects::ProjectRecord;

/// Domain model for Project (used in business logic)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub description: String,
    #[serde(rename = "type")]
    pub project_type: String,
    pub status: ProjectStatus,
    pub user_id: String,
    pub created_at: String,
    pub updated_at: String,
}

/// Project status enum (domain representation)
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub enum ProjectStatus {
    Development,
    Active,
    Archived,
    Failed,
}

impl ProjectStatus {
    /// Convert from database string representation
    pub fn from_db_str(s: &str) -> Self {
        match s {
            "draft" => ProjectStatus::Development,
            "deployed" => ProjectStatus::Active,
            "archived" => ProjectStatus::Archived,
            "failed" => ProjectStatus::Failed,
            _ => ProjectStatus::Development,
        }
    }

    /// Convert to database string representation
    pub fn to_db_str(&self) -> &'static str {
        match self {
            ProjectStatus::Development => "draft",
            ProjectStatus::Active => "deployed",
            ProjectStatus::Archived => "archived",
            ProjectStatus::Failed => "failed",
        }
    }
}

/// Convert database record to domain model
impl From<ProjectRecord> for Project {
    fn from(record: ProjectRecord) -> Self {
        Self {
            id: record.id,
            name: record.name,
            description: record.description,
            project_type: record.project_type,
            status: ProjectStatus::from_db_str(&record.status),
            user_id: record.user_id,
            created_at: record.created_at,
            updated_at: record.updated_at,
        }
    }
}
