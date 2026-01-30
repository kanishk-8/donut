use argon2::{
    Argon2,
    password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, SaltString, rand_core::OsRng},
};
use chrono::{Duration, Utc};
use jsonwebtoken::{DecodingKey, EncodingKey, Header, Validation, decode, encode};

use crate::core::{
    errors::AppError,
    models::{AppState, Claims, TokenData, UserData},
};

pub fn password_hash(pass: &str) -> Result<String, AppError> {
    let salt = SaltString::generate(&mut OsRng);

    let argon2 = Argon2::default();

    argon2
        .hash_password(pass.as_bytes(), &salt)
        .map(|hash| hash.to_string())
        .map_err(|_| AppError::InternalError)
}

pub fn password_verify(pass: &str, stored_pass: &str) -> Result<(), AppError> {
    let parsed_hash = PasswordHash::new(stored_pass).map_err(|_| AppError::InvalidCredentials)?;
    Argon2::default()
        .verify_password(pass.as_bytes(), &parsed_hash)
        .map_err(|_| AppError::InvalidCredentials)
}

pub fn generate_token(user: UserData, state: &AppState) -> Result<String, AppError> {
    let now = Utc::now();

    let claims = Claims {
        user_id: user.user_id,
        user_name: user.user_name,
        email: user.email,
        role: String::from("user"),
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

pub fn verify_token(token: &str, state: &AppState) -> Result<TokenData, AppError> {
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

    Ok(TokenData {
        user_id: token_data.claims.user_id,
        user_name: token_data.claims.user_name,
        email: token_data.claims.email,
        role: token_data.claims.role,
    })
}
