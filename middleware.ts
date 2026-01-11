// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Verificar autenticação
  const { data: { session } } = await supabase.auth.getSession()

  // Rotas administrativas requerem login
  if (req.nextUrl.pathname.includes('/admin') && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/:citySlug/admin/:path*']
}