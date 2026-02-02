use axum_extra::extract::cookie::{self, Cookie};
use time::{Duration as timeDuration, OffsetDateTime};

use crate::core::models::AppState;

pub const SESSION_COOKIE_NAME: &str = "session";

pub fn create_session_cookie(token: String, state: &AppState) -> Cookie<'static> {
    let mut cookie = Cookie::new(SESSION_COOKIE_NAME, token);
    cookie.set_http_only(true);
    cookie.set_path("/");
    cookie.set_secure(state.secure);
    cookie.set_same_site(cookie::SameSite::Strict);

    let expiration = OffsetDateTime::now_utc() + timeDuration::hours(1);
    cookie.set_expires(Some(expiration.into()));

    cookie
}
