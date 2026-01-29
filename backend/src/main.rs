use crate::core::states::state;

mod api;
mod core;
#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();
    let state = state().expect("Failed to initialize application: invalid configuration");
    let port = state.port;
    println!("Starting server on port {}", port);
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port))
        .await
        .unwrap();
    println!("The server is running at port: {port}");
    axum::serve(listener, api::routes(state)).await.unwrap();
}
