use serde::{Deserialize, Serialize};

use crate::storage::models::{User, UserRole};

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
