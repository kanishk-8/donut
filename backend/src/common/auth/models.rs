use serde::{Deserialize, Serialize};
use time::Duration;

use chrono::{DateTime, Utc};

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
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Claims {
    pub id: String,
    pub username: String,
    pub email: String,
    pub role: UserRole,
    pub exp: i64,
    pub iat: i64,
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

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RefreshToken {
    pub id: String,
    pub user_id: String,
    pub token_hash: String,
    pub expires_at: DateTime<Utc>,
    pub revoked: bool,
    pub revoked_at: Option<DateTime<Utc>>,
    // pub ip_address: Option<String>,
    // pub device_info: Option<String>,
    // pub last_used_at: Option<DateTime<Utc>>,
}
