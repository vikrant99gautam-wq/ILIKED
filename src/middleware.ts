import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');
  const url = req.nextUrl;

  if (url.pathname.startsWith('/admin')) {
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      // Use environment variables or fallback to a default secure credential
      const expectedUser = process.env.ADMIN_USER || 'admin';
      const expectedPwd = process.env.ADMIN_PASSWORD || 'ilikedadmin2026';

      if (user === expectedUser && pwd === expectedPwd) {
        return NextResponse.next();
      }
    }

    return new NextResponse('Authentication required to access I LIKED Admin Panel', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Admin Area"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
