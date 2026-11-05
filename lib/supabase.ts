import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Server-side Supabase client using the Service Role Key.
 * This client bypasses Row Level Security (RLS).
 * Use it ONLY on the server.
 */
export const supabaseAdmin = (supabaseUrl && supabaseServiceKey) 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : {
      auth: {
        getUser: async () => ({ data: { user: null }, error: new Error('Supabase keys missing') }),
        signInWithOAuth: async () => ({ data: { url: null }, error: new Error('Supabase keys missing') }),
      }
    } as any;

/**
 * Helper to get the current user from the session cookie.
 */
export async function getServerUser(token?: string) {
  if (!token || !supabaseAdmin.auth) return null;
  
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      return null;
    }
    
    return user;
  } catch (e) {
    return null;
  }
}
