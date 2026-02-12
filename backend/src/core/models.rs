#[derive(Clone)]
pub struct Config {
    pub app_name: String,
    pub secure: bool,
    pub jwt_secret: Vec<u8>,
    pub port: u16,
    pub pg_pool: sqlx::PgPool,
}
