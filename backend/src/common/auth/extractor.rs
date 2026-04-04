use std::sync::Arc;

use axum::{
    extract::{FromRef, FromRequestParts},
    http::request::Parts,
};

use crate::common::{auth::models::Claims, config::Config, errors::AppError};
pub struct AuthUser(pub Claims);

impl<S> FromRequestParts<S> for AuthUser
where
    Arc<Config>: FromRef<S>,
    S: Send + Sync,
{
    type Rejection = AppError;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        let claims = parts
            .extensions
            .get::<Claims>()
            .cloned()
            .ok_or(AppError::Unauthorized)?;

        Ok(AuthUser(claims))
    }
}
