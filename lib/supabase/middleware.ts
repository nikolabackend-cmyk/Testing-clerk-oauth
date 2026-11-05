import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Use more aggressive check for truthy values
  if (!url || !key || url === '' || key === '') {
    return response;
  }

  try {
    const supabase = createServerClient(
      url,
      key,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Get user while being aware of potential session cookie naming
    let { data: { user } } = await supabase.auth.getUser();

    // Fallback manual check for session cookie if user is null (common when using Service Role Key)
    if (!user) {
      const allCookies = request.cookies.getAll();
      const authCookie = allCookies.find(c => c.name.includes('auth-token'));
      if (authCookie) {
        try {
          const cookieData = JSON.parse(authCookie.value);
          const token = cookieData.access_token || cookieData[0];
          if (token) {
            const { data } = await supabase.auth.getUser(token);
            user = data.user;
          }
        } catch {
          const { data } = await supabase.auth.getUser(authCookie.value);
          user = data.user;
        }
      }
    }

    // Protect private routes
    const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard') || 
                            request.nextUrl.pathname.startsWith('/settings') ||
                            request.nextUrl.pathname.startsWith('/reports');

    if (!user && isDashboardRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/sign-in';
      return NextResponse.redirect(url);
    }
    
    // Redirect signed-in users away from auth pages
    if (user && (request.nextUrl.pathname === '/sign-in')) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

  } catch (error) {
    console.error('Middleware Supabase error:', error);
  }

  return response;
}
