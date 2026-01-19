import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    // 1. Troca o código pela sessão do usuário
    await supabase.auth.exchangeCodeForSession(code)

    // 2. Busca a cidade do perfil do usuário
    // Note o uso do tipo para ajudar o TS a entender que cidades não é um array
    const { data: profile } = await supabase
      .from('profiles')
      .select('city_id, cities!inner(slug)') // O !inner ajuda a garantir a relação
      .single()

    // 3. Verificação segura para o TypeScript (Type Guard)
    const cityData = profile?.cities as unknown as { slug: string } | null;

    if (cityData?.slug) {
      return NextResponse.redirect(`${requestUrl.origin}/${cityData.slug}`)
    }
  }

  // Se algo falhar, volta para a home
  return NextResponse.redirect(requestUrl.origin)
}