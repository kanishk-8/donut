pub mod handlers;
pub mod middlewares;
pub mod routes;

use std::sync::Arc;

use axum::{
    Router,
    http::{HeaderValue, Method, header::CONTENT_TYPE},
    middleware,
    routing::get,
};
use tower_http::cors::CorsLayer;

use crate::{api::middlewares::auth_middleware::auth_middleware, core::models::AppState};

pub fn routes(state: Arc<AppState>) -> Router {
    let cors = CorsLayer::new()
        .allow_origin("http://localhost:3000".parse::<HeaderValue>().unwrap())
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers([CONTENT_TYPE])
        .allow_credentials(true);
    Router::new()
        .route("/", get(|| async { "server is running..." }))
        .nest("/api/auth", routes::auth::routes())
        .nest(
            "/api/user",
            routes::user::routes().route_layer(middleware::from_fn_with_state(
                state.clone(),
                auth_middleware,
            )),
        )
        .nest(
            "/api/user",
            routes::project::routes().route_layer(middleware::from_fn_with_state(
                state.clone(),
                auth_middleware,
            )),
        )
        .layer(cors)
        .with_state(state)
}
