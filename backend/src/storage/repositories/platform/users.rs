use crate::common::{auth::models::User, errors::AppError};
use sqlx::PgPool;

/// Create a new user in the database
pub async fn create_user(
    pool: &PgPool,
    username: &str,
    email: &str,
    password_hash: &str,
) -> Result<User, AppError> {
    sqlx::query_as!(
        User,
        r#"INSERT INTO users (username, email, password_hash, role)
           VALUES ($1, $2, $3, 'User')
           RETURNING
               id::text as "id!",
               username as "username!",
               email as "email!",
               role::text as "role!: _""#,
        username,
        email,
        password_hash
    )
    .fetch_one(pool)
    .await
    .map_err(|e| AppError::DatabaseError(format!("Failed to create user: {}", e)))
}

/// Find a user by email (returns full User struct)
pub async fn find_by_email(pool: &PgPool, email: &str) -> Result<Option<User>, AppError> {
    sqlx::query_as!(
        User,
        r#"SELECT
               id::text as "id!",
               username as "username!",
               email as "email!",
               role::text as "role!: _"
           FROM users
           WHERE email = $1"#,
        email
    )
    .fetch_optional(pool)
    .await
    .map_err(|e| AppError::DatabaseError(format!("Failed to find user by email: {}", e)))
}

/// Get only the password hash for a user (for authentication)
pub async fn get_password_hash(pool: &PgPool, email: &str) -> Result<Option<String>, AppError> {
    sqlx::query_scalar!(
        r#"SELECT password_hash
           FROM users
           WHERE email = $1"#,
        email
    )
    .fetch_optional(pool)
    .await
    .map_err(|e| AppError::DatabaseError(format!("Failed to get password hash: {}", e)))
}

/// Check if a user with the given email exists
pub async fn email_exists(pool: &PgPool, email: &str) -> Result<bool, AppError> {
    let result = sqlx::query_scalar!(
        r#"SELECT EXISTS(SELECT 1 FROM users WHERE email = $1) as "exists!""#,
        email
    )
    .fetch_one(pool)
    .await
    .map_err(|e| AppError::DatabaseError(format!("Failed to check email existence: {}", e)))?;

    Ok(result)
}

/// Find a user by username (optional - if you need it)
pub async fn find_by_username(pool: &PgPool, username: &str) -> Result<Option<User>, AppError> {
    sqlx::query_as!(
        User,
        r#"SELECT
               id::text as "id!",
               username as "username!",
               email as "email!",
               role::text as "role!: _"
           FROM users
           WHERE username = $1"#,
        username
    )
    .fetch_optional(pool)
    .await
    .map_err(|e| AppError::DatabaseError(format!("Failed to find user by username: {}", e)))
}

/// Find a user by ID (for token validation, profile fetching, etc.)
pub async fn find_by_id(pool: &PgPool, user_id: &str) -> Result<Option<User>, AppError> {
    sqlx::query_as!(
        User,
        r#"SELECT
               id::text as "id!",
               username as "username!",
               email as "email!",
               role::text as "role!: _"
           FROM users
           WHERE id::text = $1"#,
        user_id
    )
    .fetch_optional(pool)
    .await
    .map_err(|e| AppError::DatabaseError(format!("Failed to find user by ID: {}", e)))
}

/// Update user's password (for password reset functionality)
pub async fn update_password_byid(
    pool: &PgPool,
    user_id: &str,
    new_password_hash: &str,
) -> Result<(), AppError> {
    sqlx::query!(
        r#"UPDATE users
           SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
           WHERE id::text = $2"#,
        new_password_hash,
        user_id
    )
    .execute(pool)
    .await
    .map_err(|e| AppError::DatabaseError(format!("Failed to update password: {}", e)))?;

    Ok(())
}
