use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};

use crate::{
    common::{
        config::Config,
        errors::AppError,
        project::apikey::{ApiKey, hash_api_key},
    },
    platform::{
        auth::extractor::AuthUser,
        projects::{
            models::Project,
            requests::{CreateApiKeyRequest, CreateProjectRequest, UpdateProjectRequest},
            responses::{CreateApiKeyResponse, ProjectResponse},
        },
    },
    storage::repositories::platform::projects::{
        create_api_key_for_project, create_project as create_project_db,
        delete_api_key_for_project, delete_project as delete_project_db, get_project_by_id,
        list_projects_by_owner, update_project as update_project_db,
    },
};
fn normalize_api_key_role(role: Option<&str>) -> Result<&'static str, AppError> {
    match role {
        None => Ok("secret"),
        Some(r) if r.eq_ignore_ascii_case("public") => Ok("public"),
        Some(r) if r.eq_ignore_ascii_case("secret") => Ok("secret"),
        Some(r) if r.eq_ignore_ascii_case("service") => Ok("service"),
        Some(r) => Err(AppError::ValidationError(format!(
            "Invalid role '{}'. Allowed: public, secret, service",
            r
        ))),
    }
}

/// Create a new project
pub async fn create_project(
    State(config): State<Arc<Config>>,
    AuthUser(user): AuthUser,
    Json(request): Json<CreateProjectRequest>,
) -> Result<Json<ProjectResponse>, AppError> {
    // Validate name
    if request.name.trim().is_empty() {
        return Err(AppError::ValidationError(
            "Project name is required".to_string(),
        ));
    }

    // Parse and validate status
    let status = request
        .parse_status()
        .map_err(|e| AppError::ValidationError(e))?;

    // Create project in database
    let project_record = create_project_db(
        &config.pg_pool,
        &user.id,
        request.name.trim(),
        request.description.as_deref(),
        status.to_db_str(),
    )
    .await?;

    // Convert to domain model, then to response DTO
    let project: Project = project_record.into();
    Ok(Json(project.into()))
}

/// Get a single project by ID
pub async fn get_project(
    State(config): State<Arc<Config>>,
    AuthUser(user): AuthUser,
    Path(project_id): Path<String>,
) -> Result<Json<ProjectResponse>, AppError> {
    let project_record = get_project_by_id(&config.pg_pool, &project_id, &user.id)
        .await?
        .ok_or_else(|| AppError::ValidationError("Project not found".to_string()))?;

    // Convert DB record → domain model → response DTO
    let project: Project = project_record.into();
    Ok(Json(project.into()))
}

/// List all projects for the authenticated user
pub async fn list_projects(
    State(config): State<Arc<Config>>,
    AuthUser(user): AuthUser,
) -> Result<Json<Vec<ProjectResponse>>, AppError> {
    let project_records = list_projects_by_owner(&config.pg_pool, &user.id).await?;

    // Convert DB records → domain models → response DTOs
    let projects: Vec<ProjectResponse> = project_records
        .into_iter()
        .map(|record| {
            let project: Project = record.into();
            project.into()
        })
        .collect();

    Ok(Json(projects))
}

/// Update an existing project
pub async fn update_project(
    State(config): State<Arc<Config>>,
    AuthUser(user): AuthUser,
    Path(project_id): Path<String>,
    Json(request): Json<UpdateProjectRequest>,
) -> Result<Json<ProjectResponse>, AppError> {
    // Parse and validate status if provided
    let status = request
        .parse_status()
        .map_err(|e| AppError::ValidationError(e))?;

    // Update project in database
    let updated_record = update_project_db(
        &config.pg_pool,
        &project_id,
        &user.id,
        request.name.as_deref().map(str::trim),
        request.description.as_deref(),
        status.as_ref().map(|s| s.to_db_str()),
    )
    .await?
    .ok_or_else(|| AppError::ValidationError("Project not found".to_string()))?;

    // Convert DB record → domain model → response DTO
    let project: Project = updated_record.into();
    Ok(Json(project.into()))
}

/// Delete a project
pub async fn delete_project(
    State(config): State<Arc<Config>>,
    AuthUser(user): AuthUser,
    Path(project_id): Path<String>,
) -> Result<StatusCode, AppError> {
    let deleted = delete_project_db(&config.pg_pool, &project_id, &user.id).await?;

    if !deleted {
        return Err(AppError::ValidationError("Project not found".to_string()));
    }

    Ok(StatusCode::NO_CONTENT)
}

pub async fn create_api_key(
    State(config): State<Arc<Config>>,
    AuthUser(user): AuthUser,
    Path(project_id): Path<String>,
    Json(request): Json<CreateApiKeyRequest>,
) -> Result<Json<CreateApiKeyResponse>, AppError> {
    get_project_by_id(&config.pg_pool, &project_id, &user.id)
        .await?
        .ok_or_else(|| AppError::ValidationError("Project not found".to_string()))?;
    if let Some(name) = request.name.as_deref() {
        if name.trim().is_empty() {
            return Err(AppError::ValidationError(
                "API key name cannot be empty".to_string(),
            ));
        }
    }
    let role = normalize_api_key_role(request.role.as_deref())?;
    let api_key = ApiKey::new(&project_id)?;
    let hash_key = hash_api_key(&api_key.raw_key)?;
    let record = create_api_key_for_project(
        &config.pg_pool,
        &project_id,
        &user.id,
        request.name.as_deref().map(str::trim),
        &hash_key,
        &api_key.prefix,
        role,
    )
    .await?;
    Ok(Json(CreateApiKeyResponse {
        id: record.id,
        project_id: record.project_id,
        name: record.name,
        key: api_key.raw_key, // Return raw key only on creation
        key_prefix: api_key.prefix,
        role: record.role,
        created_at: record.created_at,
        expires_at: record.expires_at,
    }))
}

pub async fn delete_api_key(
    State(config): State<Arc<Config>>,
    AuthUser(user): AuthUser,
    Path((project_id, api_key_id)): Path<(String, String)>,
) -> Result<StatusCode, AppError> {
    let deleted =
        delete_api_key_for_project(&config.pg_pool, &project_id, &user.id, &api_key_id).await?;

    if !deleted {
        return Err(AppError::ValidationError(
            "API key not found for this project".to_string(),
        ));
    }

    Ok(StatusCode::NO_CONTENT)
}
