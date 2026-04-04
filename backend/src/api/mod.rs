pub mod middleware_fn;
pub mod routes;

use std::sync::Arc;

use axum::{
    Router,
    http::{HeaderValue, Method, header::CONTENT_TYPE},
    middleware,
    routing::get,
};
use tower_http::{
    cors::CorsLayer,
    trace::{DefaultMakeSpan, DefaultOnResponse, TraceLayer},
};
use tracing::Level;

use crate::{
    api::middleware_fn::middleware_fn, common::config::Config,
    platform::auth::handlers::remove_expired_refresh_token,
};

pub fn routes(config: Arc<Config>) -> Router {
    let origins: Vec<HeaderValue> = config
        .allowed_origins
        .iter()
        .map(|origin| origin.parse().unwrap())
        .collect();
    let cors = CorsLayer::new()
        .allow_origin(origins)
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers([CONTENT_TYPE])
        .allow_credentials(true);

    // Merged the routes that comes under same endpoints
    let user_routes = routes::users::routes().merge(routes::projects::routes());

    Router::new()
        .route("/", get(|| async { "server is running..." }))
        .route("/cron/rem_exp_token", get(remove_expired_refresh_token))
        .nest("/api/auth", routes::auth::routes())
        .nest(
            "/api/user",
            user_routes.route_layer(middleware::from_fn_with_state(
                config.clone(),
                middleware_fn,
            )),
        )
        // TODO: Add app auth routes when they are ready
        // .nest("/app/auth", routes::app_auth::routes())
        .layer(cors)
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(DefaultMakeSpan::new().level(Level::INFO))
                .on_response(DefaultOnResponse::new().level(Level::INFO)),
        )
        .with_state(config)
}
