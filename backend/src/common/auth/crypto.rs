use argon2::{
    Argon2,
    password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, SaltString, rand_core::OsRng},
};

use crate::common::errors::AppError;

pub fn password_hash(pass: &str) -> Result<String, AppError> {
    let salt = SaltString::generate(&mut OsRng);

    let argon2 = Argon2::default();

    argon2
        .hash_password(pass.as_bytes(), &salt)
        .map(|hash| hash.to_string())
        .map_err(|_| AppError::PasswordHashingFailed)
}

pub fn password_verify(pass: &str, stored_pass: &str) -> Result<(), AppError> {
    let parsed_hash = PasswordHash::new(stored_pass).map_err(|_| AppError::InvalidCredentials)?;
    Argon2::default()
        .verify_password(pass.as_bytes(), &parsed_hash)
        .map_err(|_| AppError::InvalidCredentials)
}
