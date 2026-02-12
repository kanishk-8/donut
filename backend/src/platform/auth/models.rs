use crate::storage::models::{User, UserRole};
use serde::{Deserialize, Serialize};

// Request and Response Models
#[derive(Deserialize, Serialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Serialize, Deserialize)]
pub struct SignUpRequest {
    pub username: String,
    pub email: String,
    pub password: String,
}

#[derive(Serialize, Deserialize)]
pub struct UpdatePasswordRequest {
    pub id: String,
    pub email: String,
    pub current_password: String,
    pub new_password: String,
}

#[derive(Serialize, Deserialize)]
pub struct ForgotPasswordRequest {
    pub email: String,
    pub new_password: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Claims {
    pub id: String,
    pub username: String,
    pub email: String,
    pub role: UserRole,
    pub exp: i64,
    pub iat: i64,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct TokenResponse {
    pub id: String,
    pub username: String,
    pub email: String,
    pub role: UserRole,
}

#[derive(Deserialize, Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub user: User,
}
