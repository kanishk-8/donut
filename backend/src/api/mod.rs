pub mod routes;

use std::sync::Arc;

use axum::{
    Router,
    http::{HeaderValue, Method, header::CONTENT_TYPE},
    middleware,
    routing::get,
};
use tower_http::cors::CorsLayer;

use crate::{core::models::Config, platform::auth::middleware::middleware};

pub fn routes(config: Arc<Config>) -> Router {
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
            routes::users::routes()
                .route_layer(middleware::from_fn_with_state(config.clone(), middleware)),
        )
        .nest(
            "/api/user",
            routes::projects::routes()
                .route_layer(middleware::from_fn_with_state(config.clone(), middleware)),
        )
        .layer(cors)
        .with_state(config)
}
