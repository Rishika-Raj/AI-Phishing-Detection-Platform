import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Support running from server/ directory or project root
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing required Supabase environment variables: SUPABASE_URL and SUPABASE_ANON_KEY"
  );
}

/**
 * Anon client — used for verifying user tokens and user-scoped DB operations.
 * All queries through this client are governed by RLS.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Service-role client — bypasses RLS entirely.
 * ONLY use for privileged server operations (admin endpoints).
 * NEVER expose this client or its key to the browser.
 */
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

/**
 * Creates a client scoped to the caller's JWT access token.
 * This ensures auth.uid() in PostgreSQL RLS policies correctly resolves to the user.
 */
export function getUserClient(token) {
  if (!token) return supabase;
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}

export default supabase;