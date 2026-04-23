use std::sync::Arc;

use axum::{
    extract::{FromRef, FromRequestParts},
    http::request::Parts,
};

use crate::{
    common::{
        auth::models::{Claims, User},
        config::Config,
        errors::AppError,
    },
    storage::repositories::platform::users::find_by_id,
};

pub struct CurrentUser(pub User);

impl<S> FromRequestParts<S> for CurrentUser
where
    Arc<Config>: FromRef<S>,
    S: Send + Sync,
{
    type Rejection = AppError;

    fn from_request_parts(
        parts: &mut Parts,
        state: &S,
    ) -> impl std::future::Future<Output = Result<Self, Self::Rejection>> + Send {
        let config = Arc::<Config>::from_ref(state);

        let claims = parts
            .extensions
            .get::<Claims>()
            .cloned()
            .ok_or(AppError::Unauthorized);

        async move {
            let claims = claims?;

            let user = find_by_id(&config.pg_pool, &claims.id)
                .await?
                .ok_or(AppError::Unauthorized)?;

            Ok(CurrentUser(user))
        }
    }
}

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
