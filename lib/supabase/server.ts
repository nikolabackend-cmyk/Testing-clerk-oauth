import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key || url === '' || key === '') {
    // Return a dummy object during build or if keys are missing
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithOAuth: async () => ({ data: { url: null }, error: new Error('Supabase keys missing') }),
        signOut: async () => ({ error: null }),
        exchangeCodeForSession: async () => ({ error: new Error('Supabase keys missing') }),
      }
    } as any;
  }

  try {
    return createServerClient(
      url,
      key,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
            }
          },
        },
      }
    );
  } catch (error) {
    console.error('Failed to create Supabase server client:', error);
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithOAuth: async () => ({ data: { url: null }, error: error }),
        signOut: async () => ({ error: null }),
        exchangeCodeForSession: async () => ({ error: error }),
      }
    } as any;
  }
}
