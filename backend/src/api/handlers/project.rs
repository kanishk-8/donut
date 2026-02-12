use axum::{
    Extension, Json,
    extract::{Path, State},
    http::StatusCode,
};
use serde::{Deserialize, Serialize};

use crate::{
    core::{
        errors::AppError,
        models::{AppState, User},
    },
    db::projects::{
        ProjectRecord, create_project as create_project_db, delete_project as delete_project_db,
        get_project_by_id, list_projects_by_owner, update_project as update_project_db,
    },
};

#[derive(Serialize, Deserialize)]
pub struct Project {
    id: String,
    name: String,
    description: String,
    #[serde(rename = "type")]
    project_type: String,
    status: String,
    user_id: String,
    created_at: String,
    updated_at: String,
}

#[derive(Deserialize)]
pub struct CreateProjectRequest {
    name: String,
    description: Option<String>,
    status: Option<String>,
}

#[derive(Deserialize)]
pub struct UpdateProjectRequest {
    name: Option<String>,
    description: Option<String>,
    status: Option<String>,
}

fn to_db_status(status: Option<&str>) -> Option<&'static str> {
    match status {
        Some(s) if s.eq_ignore_ascii_case("draft") || s.eq_ignore_ascii_case("development") => {
            Some("draft")
        }
        Some(s) if s.eq_ignore_ascii_case("deployed") || s.eq_ignore_ascii_case("active") => {
            Some("deployed")
        }
        Some(s) if s.eq_ignore_ascii_case("archived") => Some("archived"),
        Some(s) if s.eq_ignore_ascii_case("failed") => Some("failed"),
        Some(_) => None,
        None => Some("draft"),
    }
}

fn to_client_status(status: &str) -> String {
    match status {
        "draft" => "Development".to_string(),
        "deployed" => "Active".to_string(),
        "archived" => "Archived".to_string(),
        "failed" => "Failed".to_string(),
        _ => status.to_string(),
    }
}

impl From<ProjectRecord> for Project {
    fn from(value: ProjectRecord) -> Self {
        Self {
            id: value.id,
            name: value.name,
            description: value.description,
            project_type: value.project_type,
            status: to_client_status(&value.status),
            user_id: value.user_id,
            created_at: value.created_at,
            updated_at: value.updated_at,
        }
    }
}

pub async fn create_project(
    State(state): State<AppState>,
    Extension(user): Extension<User>,
    Json(request): Json<CreateProjectRequest>,
) -> Result<Json<Project>, AppError> {
    if request.name.trim().is_empty() {
        return Err(AppError::ValidationError(
            "Project name is required".to_string(),
        ));
    }

    let status = to_db_status(request.status.as_deref()).ok_or(AppError::ValidationError(
        "Invalid status. Allowed: draft, deployed, archived, failed".to_string(),
    ))?;

    let created = create_project_db(
        &state.pg_pool,
        &user.id,
        request.name.trim(),
        request.description.as_deref(),
        status,
    )
    .await?;

    Ok(Json(created.into()))
}

pub async fn get_project(
    State(state): State<AppState>,
    Extension(user): Extension<User>,
    Path(project_id): Path<String>,
) -> Result<Json<Project>, AppError> {
    let project = get_project_by_id(&state.pg_pool, &project_id, &user.id)
        .await?
        .ok_or(AppError::ValidationError("Project not found".to_string()))?;

    Ok(Json(project.into()))
}

pub async fn list_projects(
    State(state): State<AppState>,
    Extension(user): Extension<User>,
) -> Result<Json<Vec<Project>>, AppError> {
    let projects = list_projects_by_owner(&state.pg_pool, &user.id).await?;
    Ok(Json(projects.into_iter().map(Project::from).collect()))
}

pub async fn update_project(
    State(state): State<AppState>,
    Extension(user): Extension<User>,
    Path(project_id): Path<String>,
    Json(request): Json<UpdateProjectRequest>,
) -> Result<Json<Project>, AppError> {
    let status = if let Some(raw_status) = request.status.as_deref() {
        Some(
            to_db_status(Some(raw_status)).ok_or(AppError::ValidationError(
                "Invalid status. Allowed: draft, deployed, archived, failed".to_string(),
            ))?,
        )
    } else {
        None
    };

    let updated = update_project_db(
        &state.pg_pool,
        &project_id,
        &user.id,
        request.name.as_deref().map(str::trim),
        request.description.as_deref(),
        status,
    )
    .await?
    .ok_or(AppError::ValidationError("Project not found".to_string()))?;

    Ok(Json(updated.into()))
}

pub async fn delete_project(
    State(state): State<AppState>,
    Extension(user): Extension<User>,
    Path(project_id): Path<String>,
) -> Result<StatusCode, AppError> {
    let deleted = delete_project_db(&state.pg_pool, &project_id, &user.id).await?;

    if !deleted {
        return Err(AppError::ValidationError("Project not found".to_string()));
    }

    Ok(StatusCode::NO_CONTENT)
}
