use axum::{
    Router,
    routing::{get, post},
};

use crate::{
    api::{
        handlers::auth::{auth_check, login, logout, sign_up, update_password},
        // middleware,
    },
    core::models::AppState,
};
pub fn routes() -> Router<AppState> {
    let public_routes = Router::new()
        .route("/auth-check", get(auth_check))
        .route("/login", post(login))
        // .route("/forgot-password", post(forgot_password))
        .route("/sign-up", post(sign_up));

    let protected_routes = Router::new()
        .route("/update-password", post(update_password))
        .route("/logout", post(logout))
        // .route_layer(middleware)
    ;

    Router::new().merge(public_routes).merge(protected_routes)
}
