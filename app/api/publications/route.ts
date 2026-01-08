import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const searchParams = request.nextUrl.searchParams
    
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('publications')
      .select('*, profiles(id, name, avatar_url)', { count: 'exact' })
      .eq('status', 'ativo')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (category) {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({ 
      data, 
      count,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, category, location, contact_info, images } = body

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Título, descrição e categoria são obrigatórios' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('publications')
      .insert({
        user_id: session.user.id,
        title,
        description,
        category,
        location,
        contact_info,
        images: images || []
      })
      .select('*, profiles(id, name, avatar_url)')
      .single()

    if (error) throw error

    return NextResponse.json({ data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
