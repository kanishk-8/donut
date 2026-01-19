mod api;
mod core;
#[tokio::main]
async fn main() {
    const PORT: u16 = 8000;
    println!("Starting server on port {}", PORT);
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", PORT))
        .await
        .unwrap();
    println!("The server is running at port: {PORT}");
    axum::serve(listener, api::routes()).await.unwrap();
}
