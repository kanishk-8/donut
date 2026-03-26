use std::sync::Arc;

use axum_extra::extract::cookie::{self, Cookie};
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
    cookie.set_secure(config.secure);
    cookie.set_same_site(cookie::SameSite::Strict);

    let expiration = OffsetDateTime::now_utc() + token_type.expiration();
    cookie.set_expires(Some(expiration.into()));

    cookie
}
