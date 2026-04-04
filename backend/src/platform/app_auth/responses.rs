use serde::{Deserialize, Serialize};

use crate::common::auth::models::User;

#[derive(Deserialize, Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub user: User,
}

#[derive(Deserialize, Serialize)]
pub struct RefreshResponse {
    pub token: String,
    pub refresh_token: String,
}
