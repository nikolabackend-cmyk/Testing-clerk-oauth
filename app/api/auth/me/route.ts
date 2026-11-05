import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json({ user: null });
    }

    // Fetch user profile from public.users table
    let dbUser = null;
    try {
      const { data } = await (supabase as any)
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      dbUser = data;
    } catch (e) {
      // table might not be queried if RLS or connection issue
    }

    // Merge auth user with db user profile data
    const enrichedUser = {
      ...user,
      user_metadata: {
        ...user.user_metadata,
        full_name: dbUser?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0],
        avatar_url: dbUser?.photo_url || user.user_metadata?.avatar_url,
        balance: dbUser?.balance ?? 0,
      }
    };

    return NextResponse.json({ user: enrichedUser, dbUser });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
