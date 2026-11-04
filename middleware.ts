import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
  const { pathname, searchParams } = request.nextUrl;

  // 1. If Maintenance Mode is OFF
  if (!isMaintenanceMode) {
    // If someone explicitly goes to /maintenance when mode is off, redirect to homepage
    if (pathname === '/maintenance') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // 2. Allowed static assets and internal Next.js endpoints
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname === '/site.webmanifest' ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|eot|json)$/)
  ) {
    return NextResponse.next();
  }

  // 3. Allowed routes during maintenance (Admin Dashboard and Order Tracking for existing buyers)
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/track-order') ||
    pathname.startsWith('/track')
  ) {
    return NextResponse.next();
  }

  // 4. Secret Admin Bypass via query param: ?bypass=qatify or ?bypass=ADMIN_KEY
  const bypassParam = searchParams.get('bypass');
  if (
    bypassParam === 'qatify' ||
    bypassParam === process.env.ADMIN_SECRET_KEY
  ) {
    const url = request.nextUrl.clone();
    url.searchParams.delete('bypass');
    url.pathname = '/';
    const response = NextResponse.redirect(url);
    response.cookies.set('maintenance_bypass', 'true', {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
      httpOnly: false,
    });
    return response;
  }

  // 5. If Admin has already unlocked with bypass cookie
  if (request.cookies.get('maintenance_bypass')?.value === 'true') {
    return NextResponse.next();
  }

  // 6. If already on the maintenance page, let it render
  if (pathname === '/maintenance') {
    const response = NextResponse.next();
    response.headers.set('Retry-After', '604800'); // 7 days in seconds for search engine crawlers
    return response;
  }

  // 7. Redirect all public store requests to /maintenance
  const maintenanceUrl = new URL('/maintenance', request.url);
  const response = NextResponse.redirect(maintenanceUrl, 307);
  response.headers.set('Retry-After', '604800');
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

