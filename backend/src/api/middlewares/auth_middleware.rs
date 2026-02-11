use axum::{
    extract::{Request, State},
    middleware::Next,
    response::Response,
};
use axum_extra::extract::CookieJar;

use crate::{
    core::{
        auth::{cookie::SESSION_COOKIE_NAME, jwt::verify_token},
        errors::AppError,
        models::AppState,
    },
    db::users::find_by_id,
};

pub async fn auth_middleware(
    State(state): State<AppState>,
    mut request: Request,
    next: Next,
) -> Result<Response, AppError> {
    let jar = CookieJar::from_headers(request.headers());

    let token = jar
        .get(SESSION_COOKIE_NAME)
        .ok_or(AppError::Unauthorized)?
        .value()
        .to_string();

    let claims = verify_token(&token, &state)?;
    let user = find_by_id(&state.pg_pool, &claims.id)
        .await?
        .ok_or(AppError::Unauthorized)?;

    request.extensions_mut().insert(user);
    Ok(next.run(request).await)
}
