// lib/supabase/server.js
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export const createServerSupabase = () => {
  const cookieStore = cookies();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        storage: {
          getItem: (key) => {
            return cookieStore.get(key)?.value;
          },
          setItem: (key, value) => {
            cookieStore.set(key, value);
          },
          removeItem: (key) => {
            cookieStore.delete(key);
          },
        },
      },
    }
  );
};
