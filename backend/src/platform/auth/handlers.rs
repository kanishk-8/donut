use std::sync::Arc;

use axum::{Json, extract::State};
use axum_extra::extract::cookie::{Cookie, CookieJar};
use chrono::{Duration, Utc};

use crate::{
    common::{
        auth::{
            crypto::{hash_refresh_token, password_hash, password_verify},
            extractor::AuthUser,
            jwt::generate_token,
            models::{TokenType, User},
            session::{create_cookie, generate_refresh_token},
        },
        config::Config,
        errors::AppError,
    },
    platform::auth::{
        requests::{ForgotPasswordRequest, LoginRequest, SignUpRequest, UpdatePasswordRequest},
        responses::{AuthResponse, RefreshResponse},
    },
    storage::repositories::{
        session::{
            create_refresh_token, delete_expired_refresh_tokens, find_refresh_token,
            revoke_all_for_user, revoke_refresh_token,
        },
        users::{
            create_user, email_exists, find_by_email, find_by_id, get_password_hash,
            update_password_byid,
        },
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

    let access_token = generate_token(&user, None, &config)?;
    let refresh_token = generate_refresh_token();
    let refresh_hash = hash_refresh_token(&refresh_token);

    // store in DB

    create_refresh_token(
        &config.pg_pool,
        &user.id,
        &refresh_hash,
        Utc::now() + Duration::days(7),
    )
    .await?;
    // cookies
    let access_cookie = create_cookie(access_token.clone(), TokenType::Access, &config);
    let refresh_cookie = create_cookie(refresh_token.clone(), TokenType::Refresh, &config);

    let jar = jar.add(access_cookie).add(refresh_cookie);
    let response = AuthResponse {
        token: access_token,
        user,
    };
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
    let access_token = generate_token(&user, None, &config)?;
    let refresh_token = generate_refresh_token();
    let refresh_hash = hash_refresh_token(&refresh_token);

    // ✅ store refresh token in DB
    create_refresh_token(
        &config.pg_pool,
        &user.id,
        &refresh_hash,
        Utc::now() + Duration::days(7),
    )
    .await?;

    // ✅ set cookies
    let access_cookie = create_cookie(access_token.clone(), TokenType::Access, &config);
    let refresh_cookie = create_cookie(refresh_token.clone(), TokenType::Refresh, &config);

    let jar = jar.add(access_cookie).add(refresh_cookie);
    let response = AuthResponse {
        token: access_token,
        user,
    };

    Ok((jar, Json(response)))
}

pub async fn logout(
    jar: CookieJar,
    State(config): State<Arc<Config>>,
) -> Result<CookieJar, AppError> {
    let refresh_token = jar
        .get(TokenType::Refresh.name())
        .map(|c| c.value().to_string());

    if let Some(token) = refresh_token {
        let hash = hash_refresh_token(&token);

        if let Some(stored) = find_refresh_token(&config.pg_pool, &hash).await? {
            revoke_refresh_token(&config.pg_pool, &stored.id).await?;
        }
    }

    Ok(jar
        .remove(Cookie::from(TokenType::Access.name()))
        .remove(Cookie::from(TokenType::Refresh.name())))
}

pub async fn update_password(
    State(config): State<Arc<Config>>,
    AuthUser(user): AuthUser,
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

pub async fn me(jar: CookieJar, AuthUser(user): AuthUser) -> Result<Json<AuthResponse>, AppError> {
    let token = jar
        .get(TokenType::Access.name())
        .ok_or(AppError::InvalidToken)?
        .value()
        .to_string();

    let current_user = User {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
    };
    Ok(Json(AuthResponse {
        token,
        user: current_user,
    }))
}

pub async fn refresh(
    jar: CookieJar,
    State(config): State<Arc<Config>>,
) -> Result<(CookieJar, Json<RefreshResponse>), AppError> {
    // ✅ 1. Get refresh token ONLY
    let refresh_token = jar
        .get(TokenType::Refresh.name())
        .ok_or(AppError::InvalidToken)?
        .value()
        .to_string();

    let hashed = hash_refresh_token(&refresh_token);

    // ✅ 3. Find in DB
    let stored = find_refresh_token(&config.pg_pool, &hashed)
        .await?
        .ok_or(AppError::InvalidToken)?;

    if stored.revoked {
        // Allow a 10-second grace period for concurrent requests to fail safely
        if let Some(revoked_time) = stored.revoked_at {
            if Utc::now() - revoked_time < Duration::seconds(10) {
                return Err(AppError::InvalidToken);
            }
        }
        // 🚨 token reuse attack detected
        revoke_all_for_user(&config.pg_pool, &stored.user_id).await?;
        return Err(AppError::InvalidToken);
    }

    let user = find_by_id(&config.pg_pool, &stored.user_id)
        .await?
        .ok_or(AppError::Unauthorized)?;

    let new_access = generate_token(&user, None, &config)?;

    let new_refresh = generate_refresh_token();
    let new_hash = hash_refresh_token(&new_refresh);

    revoke_refresh_token(&config.pg_pool, &stored.id).await?;

    create_refresh_token(
        &config.pg_pool,
        &user.id,
        &new_hash,
        Utc::now() + Duration::days(7),
    )
    .await?;
    let access_cookie = create_cookie(new_access.clone(), TokenType::Access, &config);
    let refresh_cookie = create_cookie(new_refresh.clone(), TokenType::Refresh, &config);

    let jar = jar.add(access_cookie).add(refresh_cookie);

    Ok((
        jar,
        Json(RefreshResponse {
            token: new_access,
            refresh_token: new_refresh,
        }),
    ))
}

pub async fn remove_expired_refresh_token(
    State(config): State<Arc<Config>>,
) -> Result<String, AppError> {
    let res = delete_expired_refresh_tokens(&config.pg_pool).await;
    match res {
        Ok(_) => Ok("Successfully deleted all the expired refresh tokens".to_string()),
        Err(e) => Err(e),
    }
}
