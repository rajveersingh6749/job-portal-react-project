import { useSession } from "@clerk/clerk-react";
import { useState } from "react";

const useFetch = (cb, options = {}) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { session } = useSession();

  // Try to get a supabase token, retrying briefly if Clerk session isn't ready yet.
  const getSupabaseTokenWithRetry = async (retries = 5, delay = 200) => {
    for (let i = 0; i < retries; i++) {
      try {
        if (!session || typeof session.getToken !== "function") {
          throw new Error("Session not ready");
        }

        const token = await session.getToken({ template: "supabase" });
        // token may be undefined if not signed in; return it (caller will handle)
        return token;
      } catch (err) {
        if (i === retries - 1) throw err;
        // wait a bit and retry
        // eslint-disable-next-line no-await-in-loop
        await new Promise((res) => setTimeout(res, delay));
      }
    }
    return undefined;
  };

  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      let supabaseAccessToken;

      try {
        supabaseAccessToken = await getSupabaseTokenWithRetry();
      } catch (tokenErr) {
        // If we couldn't retrieve a token after retries, proceed without it.
        // This allows anonymous reads to continue (supabase client will use anon key).
        console.warn("Could not acquire Supabase token, proceeding anonymously.", tokenErr);
        supabaseAccessToken = undefined;
      }

      const response = await cb(supabaseAccessToken, options, ...args);
      setData(response);
      setError(null);
      return response;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn };
};

export default useFetch;
