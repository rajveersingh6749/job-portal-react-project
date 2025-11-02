import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Create a Supabase client that automatically uses a Clerk-issued JWT
 * if provided, otherwise falls back to the anon key for public reads.
 */
const supabaseClient = (supabaseAccessToken) => {
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        ...(supabaseAccessToken && { Authorization: `Bearer ${supabaseAccessToken}` }),
      },
    },
  });

  return supabase;
};

export default supabaseClient;
