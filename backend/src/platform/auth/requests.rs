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
