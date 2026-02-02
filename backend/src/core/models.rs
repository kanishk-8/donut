use serde::{Deserialize, Serialize};

#[derive(Clone)]
pub struct AppState {
    pub app_name: String,
    pub secure: bool,
    pub jwt_secret: Vec<u8>,
    pub port: u16,
}

#[derive(Debug, Deserialize, Serialize)]
pub enum UserRole {
    Admin,
    PlatformUser,
    NodeUser,
}

// Request and Response Models
#[derive(Deserialize, Serialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Serialize, Deserialize)]
pub struct SignUpRequest {
    pub user_name: String,
    pub email: String,
    pub password: String,
}

#[derive(Deserialize, Serialize)]
pub struct User {
    pub user_id: String,
    pub user_name: String,
    pub email: String,
    pub role: UserRole,
}
pub struct TokenResponse {
    pub user_id: String,
    pub user_name: String,
    pub email: String,
    pub role: UserRole,
}
#[derive(Debug, Deserialize, Serialize)]
pub struct Claims {
    pub user_id: String,
    pub user_name: String,
    pub email: String,
    pub role: UserRole,
    pub exp: i64,
    pub iat: i64,
}
