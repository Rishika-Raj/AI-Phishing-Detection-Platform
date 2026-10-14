import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client for use in:
 *  - Next.js Server Components
 *  - Route Handlers (app/api/*)
 *  - Server Actions
 *
 * Reads/writes session cookies automatically via Next.js cookie store.
 * Uses the anon key — RLS applies.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll may be called from a Server Component where setting
            // cookies is not allowed. The middleware handles session refresh.
          }
        },
      },
    }
  );
}
