use crate::core::models::AppState;

mod api;
mod core;
mod db;

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();
    let state = AppState::new()
        .await
        .expect("Failed to initialize the config");
    let port = state.port;
    println!("Starting server on port {}", port);
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port))
        .await
        .unwrap();
    println!("The server is running at port: {port}");
    axum::serve(listener, api::routes(state)).await.unwrap();
}
