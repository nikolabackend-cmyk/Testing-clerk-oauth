import { createClient } from './supabase/server';

/**
 * Bridge to the new Supabase client logic.
 * This ensures compatibility with any existing code that imports from @/lib/supabase
 */
export const getSupabaseAdmin = async () => {
  return await createClient();
};

export async function getServerUser() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (e) {
    return null;
  }
}
