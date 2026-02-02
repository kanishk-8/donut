use chrono::{Duration, Utc};
use jsonwebtoken::{DecodingKey, EncodingKey, Header, Validation, decode, encode};

use crate::core::{
    errors::AppError,
    models::{AppState, Claims, TokenResponse, User, UserRole},
};

pub fn generate_token(user: &User, state: &AppState) -> Result<String, AppError> {
    let now = Utc::now();

    let claims = Claims {
        user_id: user.user_id.clone(),
        user_name: user.user_name.clone(),
        email: user.email.clone(),
        role: UserRole::PlatformUser,
        exp: (now + Duration::minutes(15)).timestamp(),
        iat: now.timestamp(),
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(&state.jwt_secret),
    )
    .map_err(|e| AppError::TokenGenerationFailed(e.to_string()))
}

pub fn verify_token(token: &str, state: &AppState) -> Result<TokenResponse, AppError> {
    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(&state.jwt_secret),
        &Validation::default(),
    )
    .map_err(|e| match e.kind() {
        jsonwebtoken::errors::ErrorKind::ExpiredSignature => AppError::InvalidToken,
        jsonwebtoken::errors::ErrorKind::InvalidToken => AppError::InvalidToken,
        _ => AppError::InvalidToken,
    })?;

    Ok(TokenResponse {
        user_id: token_data.claims.user_id,
        user_name: token_data.claims.user_name,
        email: token_data.claims.email,
        role: token_data.claims.role,
    })
}
