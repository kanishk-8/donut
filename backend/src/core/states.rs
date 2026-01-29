use std::env;

use crate::core::{errors::AppError, models::AppState};

pub fn state() -> Result<AppState, AppError> {
    let jwt_secret = env::var("JWT_SECRET")
        .map_err(|_| AppError::MissingConfig("JWT_SECRET must be set".to_string()))?;

    if jwt_secret.len() < 32 {
        return Err(AppError::InvalidConfig(
            "JWT_SECRET must be at least 32 characters long".to_string(),
        ));
    }
    let port_str =
        env::var("PORT").map_err(|_| AppError::MissingConfig("PORT must be set".to_string()))?;
    let port: u16 = port_str.parse().map_err(|_| {
        AppError::InvalidConfig("PORT must be a valid unsigned integer".to_string())
    })?;
    Ok(AppState {
        app_name: "Donut".to_string(),
        jwt_secret: jwt_secret.into_bytes(),
        port,
    })
}
