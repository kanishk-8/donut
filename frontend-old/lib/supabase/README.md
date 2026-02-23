# Database Setup for Projects

This guide explains how to set up the database tables for the projects feature.

## Prerequisites

- Supabase project set up
- Supabase CLI installed (optional)

## Setup Instructions

### Option 1: Using Supabase Dashboard

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `lib/supabase/migrations/create-projects-table.sql`
4. Run the SQL script

### Option 2: Using Supabase CLI

1. If you have Supabase CLI set up locally:

```bash
supabase db push
```

## Database Schema

The `projects` table includes:

- `id`: UUID primary key
- `user_id`: Foreign key to auth.users
- `name`: Project name (required)
- `description`: Project description
- `type`: Project type (Chatbot, Voice AI, API Integration)
- `status`: Project status (Development, Active)
- `created_at`: Timestamp when created
- `updated_at`: Timestamp when last updated

## Security

Row Level Security (RLS) is enabled to ensure users can only access their own projects.

## Environment Variables

Make sure these environment variables are set in your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```
