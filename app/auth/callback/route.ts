import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.session?.user) {
      const user = data.session.user;
      
      try {
        // Check if user exists in the public users table to preserve balance
        const { data: existingUser } = await (supabase as any)
          .from('users')
          .select('balance, created_at')
          .eq('id', user.id)
          .maybeSingle();

        await (supabase as any).from('users').upsert({
          id: user.id,
          email: user.email,
          display_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
          photo_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
          last_sign_in: new Date().toISOString(),
          created_at: existingUser?.created_at || user.created_at || new Date().toISOString(),
          balance: existingUser?.balance ?? 0,
        }, { onConflict: 'id' });
      } catch (dbErr) {
        console.error('Failed to sync user to public.users table:', dbErr);
      }

      revalidatePath('/', 'layout');
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-error`);
}
