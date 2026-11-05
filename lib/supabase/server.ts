import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key || url === '' || key === '') {
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
    const supabase = createServerClient(
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
              // Ignore cookie setting errors in server components
            }
          },
        },
      }
    );

    // Patch getUser to be more robust with Service Role Key
    const originalGetUser = supabase.auth.getUser.bind(supabase.auth);
    supabase.auth.getUser = async (jwt?: string) => {
      // If a JWT is provided, use it
      if (jwt) return originalGetUser(jwt);

      // Otherwise, try to find a session token in the cookies manually if originalGetUser returns null
      const result = await originalGetUser();
      if (result.data.user) return result;

      // Try manual extraction from cookies as a fallback when using Service Role Key
      const allCookies = cookieStore.getAll();
      const authCookie = allCookies.find(c => c.name.includes('auth-token'));
      
      if (authCookie) {
        try {
          // The cookie might be a JSON string containing the access_token
          const cookieData = JSON.parse(authCookie.value);
          const token = cookieData.access_token || cookieData[0];
          if (token) return originalGetUser(token);
        } catch {
          // If not JSON, it might be the token itself
          return originalGetUser(authCookie.value);
        }
      }

      return result;
    };
    
    return supabase;
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
