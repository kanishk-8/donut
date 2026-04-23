CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workflow_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    graph JSONB NOT NULL, -- node graph
    compiled_artifact JSONB, -- optional compiled output
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workflow_id, version)
);
CREATE TABLE deployments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    workflow_version_id UUID REFERENCES workflow_versions(id),
    environment VARCHAR(20) DEFAULT 'prod',
    status VARCHAR(20) DEFAULT 'active',
    deployed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE UNIQUE INDEX idx_workflow_versions_one_active
ON workflow_versions(workflow_id)
WHERE is_active = TRUE;

-- Add indexes for faster lookups
CREATE INDEX idx_workflows_project ON workflows(project_id);
CREATE INDEX idx_workflow_versions_workflow ON workflow_versions(workflow_id);
CREATE INDEX idx_deployments_project ON deployments(project_id);
CREATE INDEX idx_deployments_workflow_version ON deployments(workflow_version_id);

-- Reuse shared trigger function from users migration
CREATE TRIGGER set_workflow_updated_at
    BEFORE UPDATE ON workflows
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
