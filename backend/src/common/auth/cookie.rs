use std::sync::Arc;

use axum_extra::extract::cookie::{self, Cookie};
use time::{Duration as timeDuration, OffsetDateTime};

use crate::common::config::Config;

pub const SESSION_COOKIE_NAME: &str = "session";

pub fn create_session_cookie(token: String, config: &Arc<Config>) -> Cookie<'static> {
    let mut cookie = Cookie::new(SESSION_COOKIE_NAME, token);
    cookie.set_http_only(true);
    cookie.set_path("/");
    cookie.set_secure(config.secure);
    cookie.set_same_site(cookie::SameSite::Strict);

    let expiration = OffsetDateTime::now_utc() + timeDuration::minutes(15);
    cookie.set_expires(Some(expiration.into()));

    cookie
}
