use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Clone)]
pub struct AppUser {
    pub id: String,
    pub name: String,
    pub project_id: String,
    pub email: String,
    pub role: String,
}
