import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const cookieStore = await cookies();
  
  cookieStore.delete('sb-access-token');
  
  return NextResponse.redirect(`${origin}/home`);
}
