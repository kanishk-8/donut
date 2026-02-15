use crate::common::config::Config;

mod api;
mod common;
mod platform;
mod storage;

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();
    let config = Config::new()
        .await
        .expect("Failed to initialize the config");
    let port = &config.port;
    let app_name = &config.app_name;
    println!("Starting server for {} on port {}", app_name, port);
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port))
        .await
        .unwrap();
    println!("The server is running at port: {port}");
    axum::serve(listener, api::routes(config)).await.unwrap();
}
