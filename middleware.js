import { NextResponse } from 'next/server'

export async function middleware(request) {
  const token = request.cookies.get('auth-token')?.value

  // Si no hay token, redirigir al login
  if (!token) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }

  // Si hay token, permitir el acceso
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
} 