import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    
    // We only need a password for the custom UI to keep it simple, or username + password. 
    // Since the previous basic auth had username 'admin', let's just ask for password to make it even easier for him.
    const expectedPwd = process.env.ADMIN_PASSWORD || 'ilikedadmin2026';
    
    if (password === expectedPwd) {
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });
      return response;
    }
    
    return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
