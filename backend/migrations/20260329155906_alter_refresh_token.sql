-- Add migration script here

ALTER TABLE refresh_tokens
  ADD COLUMN IF NOT EXISTS last_used_at TIMESTAMPTZ DEFAULT NOW();

-- Optional index for active tokens by user
CREATE INDEX IF NOT EXISTS idx_refresh_active_user ON refresh_tokens(user_id) WHERE revoked = FALSE;
