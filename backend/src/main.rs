use tracing_subscriber::EnvFilter;

use crate::common::config::Config;

mod api;
mod common;
mod platform;
mod storage;

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();

    // Initializing tracing subscriber
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .with_ansi(true)
        .init();
    let config = Config::new()
        .await
        .expect("Failed to initialize the config");
    let port = &config.port;
    let app_name = &config.app_name;
    tracing::info!(app = %app_name, port = %port, "starting server");
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port))
        .await
        .unwrap();
    axum::serve(listener, api::routes(config)).await.unwrap();
}
