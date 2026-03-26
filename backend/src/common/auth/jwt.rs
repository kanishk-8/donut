use std::sync::Arc;

use chrono::{Duration, Utc};
use jsonwebtoken::{DecodingKey, EncodingKey, Header, Validation, decode, encode};

use crate::common::{
    auth::models::{Claims, TokenResponse, User, UserRole},
    {config::Config, errors::AppError},
};

pub fn generate_token(user: &User, config: &Arc<Config>) -> Result<String, AppError> {
    let now = Utc::now();

    let claims = Claims {
        id: user.id.clone(),
        username: user.username.clone(),
        email: user.email.clone(),
        role: UserRole::PlatformUser,
        exp: (now + Duration::minutes(15)).timestamp(),
        iat: now.timestamp(),
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(&config.jwt_secret),
    )
    .map_err(|e| AppError::TokenGenerationFailed(e.to_string()))
}

pub fn verify_token(token: &str, config: &Arc<Config>) -> Result<TokenResponse, AppError> {
    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(&config.jwt_secret),
        &Validation::default(),
    )
    .map_err(|e| match e.kind() {
        jsonwebtoken::errors::ErrorKind::ExpiredSignature => AppError::InvalidToken,
        jsonwebtoken::errors::ErrorKind::InvalidToken => AppError::InvalidToken,
        _ => AppError::InvalidToken,
    })?;

    Ok(TokenResponse {
        id: token_data.claims.id,
        username: token_data.claims.username,
        email: token_data.claims.email,
        role: token_data.claims.role,
    })
}
