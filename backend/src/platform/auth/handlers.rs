use std::sync::Arc;

use axum::{Extension, Json, extract::State};
use axum_extra::extract::cookie::{Cookie, CookieJar};

use crate::{
    common::{
        auth::{
            cookie::create_cookie,
            crypto::{hash_refresh_token, password_hash, password_verify},
            jwt::generate_token,
            models::{TokenType, User},
        },
        config::Config,
        errors::AppError,
    },
    platform::auth::{
        requests::{ForgotPasswordRequest, LoginRequest, SignUpRequest, UpdatePasswordRequest},
        responses::{AuthResponse, RefreshResponse},
    },
    storage::repositories::users::{
        create_user, email_exists, find_by_email, get_password_hash, update_password_byid,
    },
};

pub async fn login(
    jar: CookieJar,
    State(config): State<Arc<Config>>,
    Json(request): Json<LoginRequest>,
) -> Result<(CookieJar, Json<AuthResponse>), AppError> {
    let email = &request.email;
    let password = &request.password;
    let pool = &config.pg_pool;

    let user = find_by_email(pool, email)
        .await?
        .ok_or(AppError::InvalidCredentials)?;

    let password_hash = get_password_hash(&config.pg_pool, email)
        .await?
        .ok_or(AppError::InvalidCredentials)?;

    password_verify(password, password_hash.as_str()).map_err(|_| AppError::InvalidCredentials)?;

    let token = generate_token(&user, &config)?;
    let response = AuthResponse {
        token: token.clone(),
        user,
    };
    let cookie = create_cookie(token, TokenType::Access, &config);
    let jar = jar.add(cookie);

    Ok((jar, Json(response)))
}

pub async fn sign_up(
    jar: CookieJar,
    State(config): State<Arc<Config>>,
    Json(request): Json<SignUpRequest>,
) -> Result<(CookieJar, Json<AuthResponse>), AppError> {
    let username = &request.username;
    let email = &request.email;
    let password = &request.password;
    let pool = &config.pg_pool;

    if email_exists(pool, email).await? {
        return Err(AppError::EmailAlreadyExists);
    }

    let password_hash = password_hash(password)?;

    let user = create_user(pool, username, email, password_hash.as_str()).await?;
    let token = generate_token(&user, &config)?;

    let response = AuthResponse {
        token: token.clone(),
        user,
    };
    let cookie = create_cookie(token, TokenType::Access, &config);
    let jar = jar.add(cookie);

    Ok((jar, Json(response)))
}

pub async fn logout(jar: CookieJar) -> CookieJar {
    jar.remove(Cookie::from(TokenType::Access.name()))
}

pub async fn update_password(
    State(config): State<Arc<Config>>,
    Extension(user): Extension<User>,
    Json(request): Json<UpdatePasswordRequest>,
) -> Result<(), AppError> {
    let id = &user.id;
    let email = &user.email;
    let current_password = &request.current_password;
    let new_password = &request.new_password;
    let pool = &config.pg_pool;

    let current_hash = get_password_hash(pool, email)
        .await?
        .ok_or(AppError::InvalidCredentials)?;
    password_verify(current_password, &current_hash)?;

    let new_password_hash = password_hash(new_password)?;

    update_password_byid(pool, id, new_password_hash.as_str()).await
}

pub async fn forgot_password(
    State(config): State<Arc<Config>>,
    Json(request): Json<ForgotPasswordRequest>,
) -> Result<(), AppError> {
    let email = &request.email;
    // let new_password = &request.new_password;
    let pool = &config.pg_pool;

    if !email_exists(pool, email).await? {
        return Err(AppError::EmailNotFound);
    }

    // let new_password_hash = password_hash(new_password)?;

    // update_password_byid(pool, id, new_password_hash.as_str())
    //     .await
    //     .map_err(|e| AppError::DatabaseError(e.to_string()))
    Ok(())
}

pub async fn me(
    jar: CookieJar,
    Extension(user): Extension<User>,
) -> Result<Json<AuthResponse>, AppError> {
    let token = jar
        .get(TokenType::Access.name())
        .ok_or(AppError::InvalidToken)?
        .value()
        .to_string();

    Ok(Json(AuthResponse { token, user }))
}

pub async fn refresh(
    jar: CookieJar,
    State(config): State<Arc<Config>>,
    Extension(user): Extension<User>,
) -> Result<Json<RefreshResponse>, AppError> {
    let token = jar
        .get(TokenType::Access.name())
        .ok_or(AppError::InvalidToken)?
        .value()
        .to_string();
    let refresh_token = jar
        .get(TokenType::Refresh.name())
        .ok_or(AppError::InvalidToken)?
        .value()
        .to_string();
    // Verify the refresh token with the stored token
    let hashed_refresh_token = hash_refresh_token(&refresh_token);
    // Check the refresh token from table and then generate and return the new refersh token

    let new_token = generate_token(&user, &config)?;
    let new_refresh_token = generate_token(&user, &config)?;
    Ok(Json(RefreshResponse {
        token: new_token,
        refresh_token: new_refresh_token,
    }))
}
