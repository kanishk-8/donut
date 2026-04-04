use std::{env, sync::Arc};

use sqlx::postgres::PgPoolOptions;

use crate::common::errors::AppError;

#[derive(Clone)]
pub struct Config {
    pub app_name: String,
    pub secure: bool,
    pub jwt_secret: Vec<u8>,
    pub port: u16,
    pub pg_pool: sqlx::PgPool,
    pub runtime_pool: sqlx::PgPool,
    pub allowed_origins: Vec<String>,
}

impl Config {
    pub async fn new() -> Result<Arc<Config>, AppError> {
        let secure = env::var("SECURE")
            .unwrap_or_else(|_| "false".into())
            .parse::<bool>()
            .unwrap_or(false);

        let jwt_secret = env::var("JWT_SECRET")
            .map_err(|_| AppError::MissingConfig("JWT_SECRET must be set".to_string()))?;

        if jwt_secret.len() < 32 {
            return Err(AppError::InvalidConfig(
                "JWT_SECRET must be at least 32 characters long".to_string(),
            ));
        }
        let port_str = env::var("PORT")
            .map_err(|_| AppError::MissingConfig("PORT must be set".to_string()))?;
        let port: u16 = port_str.parse().map_err(|_| {
            AppError::InvalidConfig("PORT must be a valid unsigned integer".to_string())
        })?;
        let db_url = env::var("DATABASE_URL")
            .map_err(|_| AppError::MissingConfig("DATABASE_URL must be set".to_string()))?;

        let runtime_db_url = env::var("DATABASE_URL")
            .map_err(|_| AppError::MissingConfig("DATABASE_URL must be set".to_string()))?;
        let pg_pool = PgPoolOptions::new()
            .connect(&db_url)
            .await
            .map_err(|e| AppError::DatabaseError(e.to_string()))?;
        let runtime_pool = PgPoolOptions::new()
            .connect(&runtime_db_url)
            .await
            .map_err(|e| AppError::DatabaseError(e.to_string()))?;
        let allowed_origins_raw =
            env::var("ALLOWED_ORIGINS").unwrap_or_else(|_| "http://localhost:3000".into());
        let allowed_origins: Vec<String> = allowed_origins_raw
            .split(',')
            .map(|s| s.trim().to_string())
            .filter(|s| !s.is_empty())
            .collect();
        Ok(Arc::new(Self {
            app_name: "Donut".to_string(),
            secure,
            jwt_secret: jwt_secret.into_bytes(),
            port,
            pg_pool,
            runtime_pool,
            allowed_origins,
        }))
    }
}
