use axum::{Json, extract::State};
use axum_extra::extract::cookie::{Cookie, CookieJar};

use crate::{
    core::{
        auth::{
            cookie::{SESSION_COOKIE_NAME, create_session_cookie},
            crypto::{password_hash, password_verify},
            jwt::{generate_token, verify_token},
        },
        errors::AppError,
        models::{AppState, AuthResponse, LoginRequest, SignUpRequest, UpdatePasswordRequest},
    },
    db::users::{
        create_user, email_exists, find_by_email, get_password_hash, update_password_byid,
    },
};

pub async fn auth_check() -> &'static str {
    "auth"
}

pub async fn login(
    jar: CookieJar,
    State(state): State<AppState>,
    Json(request): Json<LoginRequest>,
) -> Result<(CookieJar, Json<AuthResponse>), AppError> {
    let email = &request.email;
    let password = &request.password;
    let pool = &state.pg_pool;

    let user = find_by_email(pool, email)
        .await?
        .ok_or(AppError::InvalidCredentials)?;

    let password_hash = get_password_hash(&state.pg_pool, email)
        .await?
        .ok_or(AppError::InvalidCredentials)?;

    password_verify(password, password_hash.as_str()).map_err(|_| AppError::InvalidCredentials)?;

    let token = generate_token(&user, &state)?;
    let response = AuthResponse {
        token: token.clone(),
        user,
    };
    let cookie = create_session_cookie(token, &state);
    let jar = jar.add(cookie);

    Ok((jar, Json(response)))
}

pub async fn sign_up(
    jar: CookieJar,
    State(state): State<AppState>,
    Json(request): Json<SignUpRequest>,
) -> Result<(CookieJar, Json<AuthResponse>), AppError> {
    let username = &request.username;
    let email = &request.email;
    let password = &request.password;
    let pool = &state.pg_pool;

    if email_exists(pool, email).await? {
        return Err(AppError::EmailAlreadyExists);
    }

    let password_hash = password_hash(password)?;

    let user = create_user(pool, username, email, password_hash.as_str()).await?;
    let token = generate_token(&user, &state)?;

    let response = AuthResponse {
        token: token.clone(),
        user,
    };
    let cookie = create_session_cookie(token, &state);
    let jar = jar.add(cookie);

    Ok((jar, Json(response)))
}

pub async fn logout(jar: CookieJar) -> CookieJar {
    jar.remove(Cookie::from(SESSION_COOKIE_NAME))
}

pub async fn update_password(
    State(state): State<AppState>,
    Json(request): Json<UpdatePasswordRequest>,
) -> Result<(), AppError> {
    let id = &request.id;
    let email = &request.email;
    let new_password = &request.new_password;
    let pool = &state.pg_pool;

    if !email_exists(pool, email).await? {
        return Err(AppError::EmailNotFound);
    }

    let new_password_hash = password_hash(new_password)?;

    update_password_byid(pool, id, new_password_hash.as_str())
        .await
        .map_err(|e| AppError::DatabaseError(e.to_string()))
}

// pub async fn forgot_password(
//     State(state): State<AppState>,
//     Json(request): Json<ForgotPasswordRequest>,
// ) -> Result<(), AppError> {
//     let email = &request.email;
//     let new_password = &request.new_password;
//     let pool = &state.pg_pool;

//     if !email_exists(pool, email).await? {
//         return Err(AppError::EmailNotFound);
//     }

//     let new_password_hash = password_hash(new_password)?;

//     update_password_byid(pool, id, new_password_hash.as_str())
//         .await
//         .map_err(|e| AppError::DatabaseError(e.to_string()))
// }

pub async fn me(
    State(state): State<AppState>,
    jar: CookieJar,
) -> Result<Json<AuthResponse>, AppError> {
    let token = jar
        .get(SESSION_COOKIE_NAME)
        .ok_or(AppError::InvalidToken)?
        .value()
        .to_string();

    let claims = verify_token(&token, &state)?;

    let user = find_by_email(&state.pg_pool, &claims.email)
        .await?
        .ok_or(AppError::InvalidToken)?;

    Ok(Json(AuthResponse { token, user }))
}
