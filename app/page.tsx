import { getServerUser } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function RootPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('sb-access-token')?.value;
  const user = await getServerUser(token);

  if (user) {
    redirect('/dashboard');
  }
  redirect('/home');
}
