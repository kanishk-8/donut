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
    let platform_routes =
        routes::platform::users::routes().merge(routes::platform::projects::routes());
    let project_routes = routes::project::users::routes();

    Router::new()
        .route("/", get(|| async { "server is running..." }))
        .route("/cron/rem_exp_token", get(remove_expired_refresh_token))
        .nest("/api/auth", routes::platform::auth::routes())
        .nest(
            "/api/user",
            platform_routes.route_layer(middleware::from_fn_with_state(
                config.clone(),
                middleware_fn,
            )),
        )
        // TODO: Add app auth routes when they are ready
        .nest("/app/auth", routes::project::auth::routes())
        .nest(
            "/app/users",
            project_routes.route_layer(middleware::from_fn_with_state(
                config.clone(),
                middleware_fn,
            )),
        )
        .layer(cors)
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(DefaultMakeSpan::new().level(Level::INFO))
                .on_response(DefaultOnResponse::new().level(Level::INFO)),
        )
        .with_state(config)
}
