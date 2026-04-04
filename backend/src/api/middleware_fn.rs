use std::sync::Arc;

use axum::{
    extract::{Request, State},
    middleware::Next,
    response::Response,
};
use axum_extra::extract::CookieJar;

use crate::common::{
    auth::{jwt::verify_token, models::TokenType},
    config::Config,
    errors::AppError,
};

pub async fn middleware_fn(
    State(config): State<Arc<Config>>,
    mut request: Request,
    next: Next,
) -> Result<Response, AppError> {
    let jar = CookieJar::from_headers(request.headers());

    if let Some(token) = jar.get(TokenType::Access.name()) {
        if let Ok(claims) = verify_token(token.value(), &config) {
            request.extensions_mut().insert(claims);
        }
    }

    Ok(next.run(request).await)
}
