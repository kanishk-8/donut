use std::env;

use argon2::{
    Argon2,
    password_hash::{
        Error, PasswordHash, PasswordHasher, PasswordVerifier, SaltString, rand_core::OsRng,
    },
};
use chrono::{Duration, Utc};
use jsonwebtoken::{EncodingKey, Header, encode};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct Claims {
    user_id: String,
    user_name: String,
    email: String,
    role: String,
    exp: i64,
    iat: i64,
}

pub struct UserData {
    user_id: String,
    user_name: String,
    email: String,
}

pub enum VerificationError {
    InvalidHashFormat,
    InvalidPassword,
}
impl From<Error> for VerificationError {
    fn from(_: Error) -> Self {
        VerificationError::InvalidPassword
    }
}

fn get_jwt_secret() -> Vec<u8> {
    env::var("JWT_SECRET")
        .expect("jwt secret must be set")
        .into_bytes()
}

pub fn password_hash(pass: &str) -> Result<String, VerificationError> {
    let salt = SaltString::generate(&mut OsRng);

    let argon2 = Argon2::default();

    Ok(argon2.hash_password(pass.as_bytes(), &salt)?.to_string())
}

pub fn password_verify(pass: &str, stored_pass: &str) -> Result<(), VerificationError> {
    let parsed_hash =
        PasswordHash::new(stored_pass).map_err(|_| VerificationError::InvalidHashFormat)?;
    Argon2::default()
        .verify_password(pass.as_bytes(), &parsed_hash)
        .map_err(|_| VerificationError::InvalidPassword)
}

pub fn generate_token(user: UserData) -> String {
    let jwt_secret = get_jwt_secret();
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
        &EncodingKey::from_secret(&jwt_secret),
    )
    .unwrap()
}

pub fn generate_refresh_token(user: UserData) -> String {
    let jwt_secret = get_jwt_secret();
    let now = Utc::now();

    let claims = Claims {
        user_id: user.user_id,
        user_name: user.user_name,
        email: user.email,
        role: String::from("user"),
        exp: (now + Duration::hours(24)).timestamp(),
        iat: now.timestamp(),
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(&jwt_secret),
    )
    .unwrap()
}
