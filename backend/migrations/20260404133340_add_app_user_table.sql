CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CREATED APP USERS TABLE

CREATE TABLE app_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(50) UNIQUE NOT NULL,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    role VARCHAR(20) ,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (project_id, email) -- Ensure email is unique within a project
);

-- Create index for faster email lookups (used in login/authentication)
CREATE INDEX idx_app_users_email ON app_users(email);
CREATE INDEX idx_project_id ON app_users(project_id);



-- CREATED SESSION TABLE FOR APP USERS

CREATE TABLE app_sessions (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
   token_hash TEXT NOT NULL UNIQUE,
   expires_at TIMESTAMPTZ NOT NULL,
   created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
   revoked BOOLEAN DEFAULT FALSE,
   revoked_at TIMESTAMPTZ,
   last_used_at TIMESTAMPTZ DEFAULT NOW(),
   device_info TEXT,
   ip_address INET
);

CREATE INDEX idx_app_sessions_user ON app_sessions(user_id);
CREATE INDEX idx_app_sessions_token_hash ON app_sessions(token_hash);
CREATE INDEX idx_app_sessions_active ON app_sessions(user_id) WHERE revoked = FALSE;
