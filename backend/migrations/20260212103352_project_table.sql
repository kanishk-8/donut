-- Create projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_project_status
        CHECK (status IN ('draft', 'deployed', 'archived', 'failed'))
);

-- Create project features table
CREATE TABLE project_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    feature_key VARCHAR(50) NOT NULL,
    config JSONB DEFAULT '{}'::jsonb,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, feature_key),
    CONSTRAINT check_project_feature_key
        CHECK (feature_key IN ('auth', 'database', 'workflows', 'agents'))
);


-- Create project API keys table
CREATE TABLE project_api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(100),
    key_hash TEXT NOT NULL, -- NEVER store raw key
    key_prefix VARCHAR(20), -- for display (e.g. pk_live_xxx)
    role VARCHAR(20) NOT NULL, -- 'public', 'secret', 'service'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    last_used_at TIMESTAMP,
    CONSTRAINT check_project_api_key_role
        CHECK (role IN ('public', 'secret', 'service'))
);


CREATE TABLE project_auth_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- 'google', 'github', 'email'
    client_id TEXT,
    client_secret TEXT,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, provider),
    CONSTRAINT check_project_auth_provider
        CHECK (provider IN ('email_password', 'google', 'github'))
);


-- Update timestamp trigger (assumes set_updated_at() exists)
CREATE TRIGGER set_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- Default feature/provider initialization
-- Inserts auth feature + email/password provider on project creation
CREATE OR REPLACE FUNCTION init_default_project_features()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO project_features (project_id, feature_key, enabled)
    VALUES (NEW.id, 'auth', FALSE)
    ON CONFLICT DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER init_project_defaults
    AFTER INSERT ON projects
    FOR EACH ROW
    EXECUTE FUNCTION init_default_project_features();


CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_project_features_project_id ON project_features(project_id);
CREATE INDEX idx_project_api_keys_project_id ON project_api_keys(project_id);
CREATE INDEX idx_project_auth_providers_project_id ON project_auth_providers(project_id);
