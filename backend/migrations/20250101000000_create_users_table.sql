-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'PlatformUser',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster email lookups (used in login/authentication)
CREATE INDEX idx_users_email ON users(email);

-- Create index for faster username lookups (if needed)
CREATE INDEX idx_users_username ON users(username);

-- Add check constraint to ensure role is valid
ALTER TABLE users
ADD CONSTRAINT check_user_role
CHECK (role IN ('Admin', 'PlatformUser', 'NodeUser'));
