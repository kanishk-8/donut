use crate::common::auth::models::RefreshToken;
use crate::common::errors::AppError;
use chrono::{DateTime, Utc};
use sqlx::PgPool;
use uuid::Uuid;

pub async fn create_refresh_token(
    pool: &PgPool,
    user_id: &str,
    token_hash: &str,
    expires_at: DateTime<Utc>,
) -> Result<(), AppError> {
    let user_id =
        Uuid::parse_str(user_id).map_err(|_| AppError::ValidationError("Invalid UUID".into()))?;

    sqlx::query!(
        r#"INSERT INTO app_sessions (user_id, token_hash, expires_at)
           VALUES ($1, $2, $3)"#,
        user_id,
        token_hash,
        expires_at
    )
    .execute(pool)
    .await
    .map_err(|e| AppError::DatabaseError(format!("Failed to create refresh token: {}", e)))?;

    Ok(())
}

pub async fn find_refresh_token(
    pool: &PgPool,
    token_hash: &str,
) -> Result<Option<RefreshToken>, AppError> {
    sqlx::query_as!(
        RefreshToken,
        r#"SELECT
               id::text as "id!",
               user_id::text as "user_id!",
               token_hash as "token_hash!",
               expires_at as "expires_at!",
               revoked as "revoked!",
               revoked_at
           FROM app_sessions
           WHERE token_hash = $1 AND revoked = FALSE AND expires_at > NOW()"#,
        token_hash
    )
    .fetch_optional(pool)
    .await
    .map_err(|e| AppError::DatabaseError(format!("Failed to find refresh token: {}", e)))
}
pub async fn revoke_refresh_token(pool: &PgPool, token_id: &str) -> Result<(), AppError> {
    sqlx::query!(
        r#"UPDATE app_sessions
           SET revoked = TRUE, revoked_at = NOW()
           WHERE id::text = $1"#,
        token_id
    )
    .execute(pool)
    .await
    .map_err(|e| AppError::DatabaseError(format!("Failed to revoke refresh token: {}", e)))?;

    Ok(())
}
pub async fn revoke_all_for_user(pool: &PgPool, user_id: &str) -> Result<(), AppError> {
    sqlx::query!(
        r#"UPDATE app_sessions
           SET revoked = TRUE, revoked_at = NOW()
           WHERE user_id::text = $1"#,
        user_id
    )
    .execute(pool)
    .await
    .map_err(|e| AppError::DatabaseError(format!("Failed to revoke all tokens: {}", e)))?;

    Ok(())
}
pub async fn delete_expired_refresh_tokens(pool: &PgPool) -> Result<(), AppError> {
    sqlx::query!(
        r#"
            DELETE FROM app_sessions
            WHERE expires_at < NOW()
               OR (
                    revoked = true
                    AND revoked_at IS NOT NULL
                    AND revoked_at < NOW() - INTERVAL '1 day'
               )
            "#
    )
    .execute(pool)
    .await
    .map_err(|e| AppError::DatabaseError(format!("Failed to delete expired tokens: {}", e)))?;

    Ok(())
}
