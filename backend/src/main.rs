use crate::core::models::Config;

mod api;
mod core;
mod platform;
mod storage;

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();
    let config = Config::new()
        .await
        .expect("Failed to initialize the config");
    let port = config.port;
    println!("Starting server on port {}", port);
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port))
        .await
        .unwrap();
    println!("The server is running at port: {port}");
    axum::serve(listener, api::routes(config)).await.unwrap();
}
