use std::sync::Arc;

use axum_extra::extract::cookie::{self, Cookie};
use rand::RngExt;
use rand::distr::Alphanumeric;
use rand::rng;
use time::OffsetDateTime;

use crate::common::{auth::models::TokenType, config::Config};

pub fn create_cookie(
    token: String,
    token_type: TokenType,
    config: &Arc<Config>,
) -> Cookie<'static> {
    let mut cookie = Cookie::new(token_type.name(), token);
    cookie.set_http_only(true);
    cookie.set_path("/");

    // Set the Secure flag based on configuration. In production (secure=true)
    // cookies will be marked Secure and we will use SameSite=None so they are
    // accepted in cross-site contexts (required when frontend and backend are on
    // different origins). For local development (secure=false) use SameSite::Lax
    // and do not set Secure so the browser accepts it over plain HTTP.
    cookie.set_secure(config.secure);
    if config.secure {
        cookie.set_same_site(cookie::SameSite::None);
    } else {
        cookie.set_same_site(cookie::SameSite::Lax);
    }

    cookie.set_max_age(token_type.expiration());

    let expiration = OffsetDateTime::now_utc() + token_type.expiration();
    cookie.set_expires(Some(expiration.into()));

    cookie
}

pub fn generate_refresh_token() -> String {
    rng()
        .sample_iter(&Alphanumeric)
        .take(64)
        .map(char::from)
        .collect()
}
