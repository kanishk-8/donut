use sqlx::{FromRow, PgPool};

use crate::core::errors::AppError;

#[derive(Debug, FromRow)]
pub struct ProjectRecord {
    pub id: String,
    pub name: String,
    pub description: String,
    pub project_type: String,
    pub status: String,
    pub user_id: String,
    pub created_at: String,
    pub updated_at: String,
}

pub async fn list_projects_by_owner(
    pool: &PgPool,
    owner_id: &str,
) -> Result<Vec<ProjectRecord>, AppError> {
    sqlx::query_as::<_, ProjectRecord>(
        r#"SELECT
               id::text as id,
               name,
               COALESCE(description, '') as description,
               'Chatbot'::text as project_type,
               status,
               owner_id::text as user_id,
               created_at::text as created_at,
               updated_at::text as updated_at
           FROM projects
           WHERE owner_id::text = $1
           ORDER BY created_at DESC"#,
    )
    .bind(owner_id)
    .fetch_all(pool)
    .await
    .map_err(|e| AppError::DatabaseError(format!("Failed to list projects: {e}")))
}

pub async fn get_project_by_id(
    pool: &PgPool,
    project_id: &str,
    owner_id: &str,
) -> Result<Option<ProjectRecord>, AppError> {
    sqlx::query_as::<_, ProjectRecord>(
        r#"SELECT
               id::text as id,
               name,
               COALESCE(description, '') as description,
               'Chatbot'::text as project_type,
               status,
               owner_id::text as user_id,
               created_at::text as created_at,
               updated_at::text as updated_at
           FROM projects
           WHERE id::text = $1 AND owner_id::text = $2"#,
    )
    .bind(project_id)
    .bind(owner_id)
    .fetch_optional(pool)
    .await
    .map_err(|e| AppError::DatabaseError(format!("Failed to get project: {e}")))
}

pub async fn create_project(
    pool: &PgPool,
    owner_id: &str,
    name: &str,
    description: Option<&str>,
    status: &str,
) -> Result<ProjectRecord, AppError> {
    sqlx::query_as::<_, ProjectRecord>(
        r#"INSERT INTO projects (owner_id, name, description, status)
           VALUES ($1::uuid, $2, $3, $4)
           RETURNING
               id::text as id,
               name,
               COALESCE(description, '') as description,
               'Chatbot'::text as project_type,
               status,
               owner_id::text as user_id,
               created_at::text as created_at,
               updated_at::text as updated_at"#,
    )
    .bind(owner_id)
    .bind(name)
    .bind(description)
    .bind(status)
    .fetch_one(pool)
    .await
    .map_err(|e| AppError::DatabaseError(format!("Failed to create project: {e}")))
}

pub async fn update_project(
    pool: &PgPool,
    project_id: &str,
    owner_id: &str,
    name: Option<&str>,
    description: Option<&str>,
    status: Option<&str>,
) -> Result<Option<ProjectRecord>, AppError> {
    sqlx::query_as::<_, ProjectRecord>(
        r#"UPDATE projects
           SET
               name = COALESCE($3, name),
               description = COALESCE($4, description),
               status = COALESCE($5, status),
               updated_at = CURRENT_TIMESTAMP
           WHERE id::text = $1 AND owner_id::text = $2
           RETURNING
               id::text as id,
               name,
               COALESCE(description, '') as description,
               'Chatbot'::text as project_type,
               status,
               owner_id::text as user_id,
               created_at::text as created_at,
               updated_at::text as updated_at"#,
    )
    .bind(project_id)
    .bind(owner_id)
    .bind(name)
    .bind(description)
    .bind(status)
    .fetch_optional(pool)
    .await
    .map_err(|e| AppError::DatabaseError(format!("Failed to update project: {e}")))
}

pub async fn delete_project(
    pool: &PgPool,
    project_id: &str,
    owner_id: &str,
) -> Result<bool, AppError> {
    let result = sqlx::query(
        r#"DELETE FROM projects
           WHERE id::text = $1 AND owner_id::text = $2"#,
    )
    .bind(project_id)
    .bind(owner_id)
    .execute(pool)
    .await
    .map_err(|e| AppError::DatabaseError(format!("Failed to delete project: {e}")))?;

    Ok(result.rows_affected() > 0)
}
