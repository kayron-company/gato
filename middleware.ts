import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function middleware(req: NextRequest) {

  const accessToken = req.cookies.get('RT_accessToken');

  if (accessToken?.value) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/verify-token`, {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    });

    if (response.ok) {
      if (req.nextUrl.pathname === '/login') {
        const url = req.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }

      return NextResponse.next();
    }
  }

  if (req.nextUrl.pathname !== '/login') {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/', '/login'],
};