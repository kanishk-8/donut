use std::io::Read;

use argon2::{
    Argon2,
    password_hash::{
        PasswordHash, PasswordHasher, PasswordVerifier, SaltString,
        rand_core::{OsRng, RngCore},
    },
};

use crate::common::errors::AppError;

const PROJECT_SEGMENT_LENGTH: usize = 8;
const API_KEY_KIND: &str = "pk";
const RANDOM_BYTES_LENGTH: usize = 32;
const TOKEN_SEGMENT_LENGTH: usize = 8;

pub struct ApiKey {
    pub raw_key: String,
    pub prefix: String,
}

impl ApiKey {
    pub fn new(project_id: &str) -> Result<Self, AppError> {
        let normalized = project_id.replace("-", "").to_lowercase();
        if normalized.len() < PROJECT_SEGMENT_LENGTH {
            return Err(AppError::ValidationError(format!(
                "Project ID must be at least {PROJECT_SEGMENT_LENGTH} characters long"
            )));
        }
        let project_segment = normalized
            .chars()
            .take(PROJECT_SEGMENT_LENGTH)
            .collect::<String>();
        let mut random_bytes = vec![0u8; RANDOM_BYTES_LENGTH];
        OsRng.fill_bytes(&mut random_bytes);
        let token = hex::encode(random_bytes);
        let raw_key = format!("{API_KEY_KIND}_{project_segment}_{token}");
        let prefix = format!("{API_KEY_KIND}_{project_segment}");
        Ok(Self { raw_key, prefix })
    }
}
pub fn hash_api_key(raw_key: &str) -> Result<String, AppError> {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();

    argon2
        .hash_password(raw_key.as_bytes(), &salt)
        .map(|hash| hash.to_string())
        .map_err(|_| AppError::ApiKeyHashingFailed)
}

pub fn verify_api_key(raw_key: &str, stored_hash: &str) -> Result<bool, AppError> {
    let parsed_hash =
        PasswordHash::new(stored_hash).map_err(|_| AppError::ApiKeyVerificationFailed)?;

    Ok(Argon2::default()
        .verify_password(raw_key.as_bytes(), &parsed_hash)
        .is_ok())
}
