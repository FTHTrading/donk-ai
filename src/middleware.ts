import { NextRequest, NextResponse } from 'next/server';

// =============================================
// NEXT.JS MIDDLEWARE
//
// Adds security headers to all responses and
// protects the /admin route with a simple
// secret-based auth check.
// =============================================

const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-DNS-Prefetch-Control': 'on',
} as const;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Admin route protection ──────────────────────────────────────
  // Require ADMIN_SECRET cookie or query param for /admin access
  if (pathname.startsWith('/admin')) {
    const adminSecret = process.env.ADMIN_SECRET;

    // If ADMIN_SECRET is not configured, block admin access entirely
    if (!adminSecret) {
      return new NextResponse('Admin access disabled — ADMIN_SECRET not configured.', {
        status: 403,
        headers: SECURITY_HEADERS,
      });
    }

    const cookieToken = req.cookies.get('admin_token')?.value;
    const queryToken = req.nextUrl.searchParams.get('token');
    const authHeader = req.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    const isAuthorized =
      cookieToken === adminSecret ||
      queryToken === adminSecret ||
      bearerToken === adminSecret;

    if (!isAuthorized) {
      // If token provided via query param, set cookie and redirect (clean URL)
      if (queryToken === adminSecret) {
        const url = req.nextUrl.clone();
        url.searchParams.delete('token');
        const response = NextResponse.redirect(url);
        response.cookies.set('admin_token', adminSecret, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 60 * 60 * 24, // 24 hours
        });
        return response;
      }

      return new NextResponse('Unauthorized — provide admin token to access this page.', {
        status: 401,
        headers: {
          ...SECURITY_HEADERS,
          'WWW-Authenticate': 'Bearer realm="admin"',
        },
      });
    }
  }

  // ── Apply security headers to all responses ─────────────────────
  const response = NextResponse.next();
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  return response;
}

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
