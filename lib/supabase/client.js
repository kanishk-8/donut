// lib/supabase/client.js
import { createClient } from "@supabase/supabase-js";

// Create a singleton instance
let supabaseInstance = null;

export const createClientSupabase = () => {
  // Return existing instance if it exists
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Create new instance only if it doesn't exist
  supabaseInstance = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return supabaseInstance;
};

// Export the singleton instance directly
export const supabase = createClientSupabase();
