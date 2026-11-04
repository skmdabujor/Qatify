import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MAINTENANCE_CONFIG } from '@/config/maintenance';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const host = request.headers.get('host') || request.nextUrl.host || '';

  // 1. NEVER block Localhost / Local Development
  // You can always code, test, and develop freely on localhost without maintenance interruption!
  const isLocalhost =
    host.includes('localhost') ||
    host.includes('127.0.0.1') ||
    process.env.NODE_ENV !== 'production';

  if (isLocalhost) {
    return NextResponse.next();
  }

  // 2. Check if Maintenance Mode is enabled for Production
  const isMaintenanceMode =
    MAINTENANCE_CONFIG.enabled ||
    process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

  if (!isMaintenanceMode) {
    if (pathname === '/maintenance') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // 3. Allowed static assets and internal Next.js endpoints
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname === '/site.webmanifest' ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|eot|json)$/)
  ) {
    return NextResponse.next();
  }

  // 4. Allowed routes during maintenance (Admin Dashboard and Order Tracking for existing buyers)
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/track-order') ||
    pathname.startsWith('/track')
  ) {
    return NextResponse.next();
  }

  // 5. Secret Admin Bypass via query param: ?bypass=qatify or ?bypass=ADMIN_KEY
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

  // 6. If Admin has already unlocked with bypass cookie
  if (request.cookies.get('maintenance_bypass')?.value === 'true') {
    return NextResponse.next();
  }

  // 7. If already on the maintenance page, let it render
  if (pathname === '/maintenance') {
    const response = NextResponse.next();
    response.headers.set('Retry-After', '604800'); // 7 days in seconds for search engine crawlers
    return response;
  }

  // 8. Redirect all public store requests to /maintenance
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
