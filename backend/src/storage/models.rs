use serde::{Deserialize, Serialize};

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
