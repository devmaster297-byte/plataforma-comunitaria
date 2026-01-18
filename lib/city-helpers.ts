// lib/city-helpers.ts
import { createSupabaseClient } from '@/lib/supabase'

/* =========================
   CIDADES
========================= */

export async function getAllCities() {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) throw error
  return data
}
export async function createCityIfNotExists({ slug, name, isActive }: { slug: string, name?: string, isActive?: boolean }) {
  // ... lógica usando as propriedades do objeto
  const supabase = createSupabaseClient()

 
  // 1. Tenta buscar a cidade
  const { data: city, error: fetchError } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (city) return city

  // 2. Se não existir, cria uma nova (exemplo básico)
  // Ajuste os campos 'name' conforme sua lógica
  const { data: newCity, error: insertError } = await supabase
    .from('cities')
    .insert([{ 
      slug: slug, 
      name: slug.charAt(0).toUpperCase() + slug.slice(1), // Capitaliza o slug
      is_active: true 
    }])
    .select()
    .single()

  if (insertError) throw insertError
  return newCity
}



export async function searchCities(query: string) {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .or(`name.ilike.%${query}%,slug.ilike.%${query}%`)
    .eq('is_active', true)

  if (error) throw error
  return data
}

export async function getCityBySlug(slug: string) {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}

export async function getCitySettings(cityId: string) {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('city_settings')
    .select('*')
    .eq('city_id', cityId)
    .single()

  if (error) throw error
  return data
}

export async function getCityPublications(cityId: string, options?: { category?: string, limit?: number }) {
  const supabase = createSupabaseClient()

  let query = supabase
    .from('publications')
    .select(`
      *,
      profiles (
        id,
        name,
        avatar_url
      )
    `)
    .eq('city_id', cityId)
    .eq('status', 'ativo')

  // Adiciona filtro de categoria se existir
  if (options?.category) {
    query = query.eq('category', options.category)
  }

  // Adiciona limite se existir
  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/* =========================
   ADMINISTRAÇÃO
========================= */

export async function checkCityAdmin(cityId: string, userId: string): Promise<boolean> {
  try {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
      .from('city_admins')
      .select('id')
      .eq('city_id', cityId)
      .eq('user_id', userId)
      .single()

    return !!data && !error
  } catch {
    return false
  }
}

export async function getCityAdminPermissions(cityId: string, userId: string) {
  try {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
      .from('city_admins')
      .select('role, permissions')
      .eq('city_id', cityId)
      .eq('user_id', userId)
      .single()

    if (error) return null
    return data
  } catch {
    return null
  }
}
/* =========================
   ESTATÍSTICAS
========================= */

export async function getCityStats(cityId: string) {
  const supabase = createSupabaseClient()

  // Busca os dados da tabela cities que contém o campo stats (JSONB ou colunas)
  // Ou você pode fazer contagens manuais aqui
  const { data, error } = await supabase
    .from('cities')
    .select('stats, population, name')
    .eq('id', cityId)
    .single()

  if (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return {
      total_users: 0,
      total_publications: 0,
      monthly_active_users: 0
    }
  }

  // Se você tiver uma coluna JSONB chamada 'stats'
  return data.stats || {
    total_users: 0,
    total_publications: 0,
    monthly_active_users: 0
  }
  
}
/* =========================
   ANALYTICS (ADMIN)
========================= */

export async function getCityAnalytics(cityId: string) {
  const supabase = createSupabaseClient()

  // Exemplo: Busca acessos ou novos usuários nos últimos 7 dias
  // Nota: Isso assume que você tem uma tabela de logs ou métricas.
  // Se não tiver, retornamos um array vazio para não quebrar o dashboard.
  try {
    const { data, error } = await supabase
      .from('city_analytics') // Certifique-se que esta tabela existe ou ajuste o nome
      .select('date, views, new_users')
      .eq('city_id', cityId)
      .order('date', { ascending: true })
      .limit(7)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao buscar analytics:', error)
    return [] // Retorna array vazio para evitar erro de .map() no front-end
  }
  
}