use axum::{
    Json,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde::{Deserialize, Serialize};
use thiserror::Error;
use time::error;

#[derive(Error, Debug)]
pub enum AppError {
    // Authentication & Authorization
    #[error("Invalid credentials")]
    InvalidCredentials,

    #[error("Unauthorized")]
    Unauthorized,

    #[error("Email already exists")]
    EmailAlreadyExists,

    #[error("Email not found")]
    EmailNotFound,

    #[error("Token generation failed: {0}")]
    TokenGenerationFailed(String),

    #[error("Invalid token")]
    InvalidToken,

    // Configuration
    #[error("Missing required configuration: {0}")]
    MissingConfig(String),

    #[error("Invalid configuration: {0}")]
    InvalidConfig(String),

    // Database (for future use)
    #[error("Database error: {0}")]
    DatabaseError(String),

    // Validation
    #[error("Validation failed: {0}")]
    ValidationError(String),

    // Internal
    #[error("Internal server error")]
    InternalError,

    #[error("Password hashing failed")]
    PasswordHashingFailed,

    #[error("App auth is disabled for this project")]
    AuthDisabled,
}

#[derive(Serialize, Deserialize)]
struct ErrorResponse {
    error: String,
    details: String,
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            AppError::InvalidCredentials => (StatusCode::UNAUTHORIZED, "Invalid credentials"),
            AppError::Unauthorized => (StatusCode::UNAUTHORIZED, "Unauthorized"),
            AppError::EmailAlreadyExists => (StatusCode::CONFLICT, "Email already exists"),
            AppError::EmailNotFound => (StatusCode::NOT_FOUND, "Email not found"),
            AppError::InvalidToken => (StatusCode::UNAUTHORIZED, "Invalid token"),
            AppError::TokenGenerationFailed(_) => {
                (StatusCode::INTERNAL_SERVER_ERROR, "Token generation failed")
            }
            AppError::ValidationError(_) => (StatusCode::BAD_REQUEST, "Validation failed"),
            AppError::MissingConfig(_) | AppError::InvalidConfig(_) => {
                (StatusCode::INTERNAL_SERVER_ERROR, "Configuration error")
            }
            AppError::DatabaseError(_) => (StatusCode::INTERNAL_SERVER_ERROR, "Database error"),
            AppError::InternalError => (StatusCode::INTERNAL_SERVER_ERROR, "Internal server error"),
            AppError::PasswordHashingFailed => {
                (StatusCode::INTERNAL_SERVER_ERROR, "Password hashing failed")
            }
            AppError::AuthDisabled => (StatusCode::FORBIDDEN, "App auth is disabled"),
        };

        let error_response = ErrorResponse {
            error: error_message.to_string(),
            details: self.to_string(), // thiserror provides this automatically!
        };

        (status, Json(error_response)).into_response()
    }
}
