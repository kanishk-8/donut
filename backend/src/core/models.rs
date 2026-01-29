use serde::{Deserialize, Serialize};
#[derive(Clone)]
pub struct AppState {
    pub app_name: String,
    pub jwt_secret: Vec<u8>,
    pub port: u16,
}
#[derive(Debug, Deserialize, Serialize)]
pub struct Claims {
    pub user_id: String,
    pub user_name: String,
    pub email: String,
    pub role: String,
    pub exp: i64,
    pub iat: i64,
}

pub struct UserData {
    pub user_id: String,
    pub user_name: String,
    pub email: String,
}
