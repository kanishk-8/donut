-- Create projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,

    -- Node graph storage (the canvas state)
    graph JSONB NOT NULL DEFAULT '{"nodes": [], "edges": []}'::jsonb,

    -- Deployment status
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    deployed_at TIMESTAMP,
    deployed_version INTEGER DEFAULT 0,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT check_project_status
    CHECK (status IN ('draft', 'deployed', 'archived', 'failed'))
);

-- Indexes for performance
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- Index for searching within node graphs (if needed)
CREATE INDEX idx_projects_graph ON projects USING GIN (graph);

-- Composite index for user's active projects
CREATE INDEX idx_projects_owner_status ON projects(owner_id, status);

-- Add trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
