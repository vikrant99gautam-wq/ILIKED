import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const authCookie = req.cookies.get('admin_auth');

  // Protect all /admin routes EXCEPT /admin/login
  if (url.pathname.startsWith('/admin') && !url.pathname.startsWith('/admin/login')) {
    if (authCookie?.value === 'true') {
      return NextResponse.next();
    }
    
    // Redirect to custom login page if not authenticated
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
