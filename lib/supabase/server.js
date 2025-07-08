// lib/supabase/server.js
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export const createServerSupabase = async () => {
  const cookieStore = await cookies();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        storage: {
          getItem: (key) => {
            const cookie = cookieStore.get(key);
            return cookie?.value || null;
          },
          setItem: (key, value) => {
            try {
              cookieStore.set(key, value, {
                httpOnly: true,
                secure: true,
                sameSite: "lax",
              });
            } catch (error) {
              // Cookie setting might fail in some contexts
              console.warn("Failed to set cookie:", error.message);
            }
          },
          removeItem: (key) => {
            try {
              cookieStore.delete(key);
            } catch (error) {
              // Cookie deletion might fail in some contexts
              console.warn("Failed to delete cookie:", error.message);
            }
          },
        },
      },
    }
  );
};
