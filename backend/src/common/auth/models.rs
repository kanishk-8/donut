use serde::{Deserialize, Serialize};
use time::Duration;

#[derive(Debug, Clone, Deserialize, Serialize, sqlx::Type)]
#[sqlx(type_name = "text")]
#[sqlx(rename_all = "PascalCase")]
pub enum UserRole {
    Admin,
    PlatformUser,
    NodeUser,
}
#[derive(Deserialize, Serialize, Clone)]
pub struct User {
    pub id: String,
    pub username: String,
    pub email: String,
    pub role: UserRole,
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

#[derive(Debug, Clone, Copy)]
pub enum TokenType {
    Access,
    Refresh,
}

impl TokenType {
    pub fn name(&self) -> &'static str {
        match self {
            TokenType::Access => "access_token",
            TokenType::Refresh => "refresh_token",
        }
    }

    pub fn expiration(&self) -> Duration {
        match self {
            TokenType::Access => Duration::minutes(15),
            TokenType::Refresh => Duration::days(7),
        }
    }
}
