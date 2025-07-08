-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Remove unnecessary columns from documents table to save space
ALTER TABLE documents DROP COLUMN IF EXISTS file_path;
ALTER TABLE documents DROP COLUMN IF EXISTS file_size;
ALTER TABLE documents DROP COLUMN IF EXISTS mime_type;

-- Add chunks_count column to track embeddings
ALTER TABLE documents ADD COLUMN IF NOT EXISTS chunks_count INTEGER DEFAULT 0;

-- Create document_chunks table for vector embeddings
CREATE TABLE IF NOT EXISTS document_chunks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  chunk_size INTEGER NOT NULL,
  embedding vector(768), -- Google Gemini embedding dimension
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_document_chunks_document_id ON document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_document_chunks_project_id ON document_chunks(project_id);
CREATE INDEX IF NOT EXISTS idx_document_chunks_user_id ON document_chunks(user_id);
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding ON document_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Set up Row Level Security (RLS)
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view own document chunks" ON document_chunks;
DROP POLICY IF EXISTS "Users can insert own document chunks" ON document_chunks;
DROP POLICY IF EXISTS "Users can update own document chunks" ON document_chunks;
DROP POLICY IF EXISTS "Users can delete own document chunks" ON document_chunks;

-- Create policies
CREATE POLICY "Users can view own document chunks" ON document_chunks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own document chunks" ON document_chunks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own document chunks" ON document_chunks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own document chunks" ON document_chunks
  FOR DELETE USING (auth.uid() = user_id);

-- Create function for similarity search
CREATE OR REPLACE FUNCTION search_document_chunks(
  query_embedding vector(768),
  match_project_id UUID,
  match_user_id UUID,
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  chunk_text TEXT,
  chunk_index INTEGER,
  similarity float,
  document_name TEXT,
  document_original_name TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.document_id,
    dc.chunk_text,
    dc.chunk_index,
    1 - (dc.embedding <=> query_embedding) as similarity,
    CAST(d.name as TEXT) as document_name,
    CAST(d.original_name as TEXT) as document_original_name
  FROM document_chunks dc
  JOIN documents d ON dc.document_id = d.id
  WHERE 
    dc.project_id = match_project_id 
    AND dc.user_id = match_user_id
    AND d.status = 'processed'
    AND 1 - (dc.embedding <=> query_embedding) > match_threshold
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;