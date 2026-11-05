import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const origin = process.env.APP_URL || 'http://localhost:3000';
  
  const { data, error } = await supabaseAdmin.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/api/auth/callback`,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (data?.url) {
    return NextResponse.redirect(data.url);
  }

  return NextResponse.json({ error: 'Could not initiate Google login' }, { status: 500 });
}
