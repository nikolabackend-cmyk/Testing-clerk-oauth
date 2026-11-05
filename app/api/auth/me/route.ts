import { getServerUser } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('sb-access-token')?.value;
  
  const user = await getServerUser(token);
  
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  
  return NextResponse.json({ user });
}
