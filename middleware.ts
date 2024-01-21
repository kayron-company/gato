import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get('RT_sessionToken');

  if (sessionToken?.value) {
    const response = await fetch('http:localhost:5000/verify-token', {
      headers: {
        'Authorization': `Bearer ${sessionToken.value}`
      }
    });

    if (response.ok) {
      // Se o usuário já está logado e tenta acessar '/login', redirecione para '/dashboard'
      if (req.nextUrl.pathname === '/login') {
        const url = req.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }

      return NextResponse.next();
    }
  }

  // Se o usuário não está logado e tenta acessar uma rota protegida, redirecione para '/login'
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