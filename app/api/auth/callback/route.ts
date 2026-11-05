import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const { data, error } = await supabaseAdmin.auth.exchangeCodeForSession(code);
    
    if (!error && data.session) {
      const cookieStore = await cookies();
      
      // Set the session token in an HttpOnly cookie
      cookieStore.set('sb-access-token', data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: data.session.expires_in,
        path: '/',
      });

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return to home if error or no code
  return NextResponse.redirect(`${origin}/home?error=auth_failed`);
}
