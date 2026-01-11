// lib/city-helpers.ts
// ============================================
// FUNÇÕES AUXILIARES - MULTI-CIDADE
// ============================================

import { createSupabaseClient } from './supabase'
import type { City, CitySettings, CityStats, CityAnalytics } from './types-city'

const supabase = createSupabaseClient()

// ============================================
// CIDADES
// ============================================

export async function getCityBySlug(slug: string): Promise<City | null> {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao buscar cidade:', error)
    return null
  }
}

export async function getAllCities() {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao buscar cidades:', error)
    return []
  }
}

export async function getCitySettings(cityId: string): Promise<CitySettings | null> {
  try {
    const { data, error } = await supabase
      .from('city_settings')
      .select('*')
      .eq('city_id', cityId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao buscar configurações:', error)
    return null
  }
}

export async function updateCitySettings(
  cityId: string,
  updates: Partial<CitySettings>
) {
  try {
    const { data, error } = await supabase
      .from('city_settings')
      .update(updates)
      .eq('city_id', cityId)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error)
    return { data: null, error }
  }
}

// ============================================
// ESTATÍSTICAS
// ============================================

export async function getCityStats(cityId: string): Promise<CityStats> {
  try {
    const [cityData, todayAnalytics, monthAnalytics] = await Promise.all([
      supabase.from('cities').select('*').eq('id', cityId).single(),
      supabase.from('city_analytics').select('*').eq('city_id', cityId).eq('date', new Date().toISOString().split('T')[0]).single(),
      supabase.from('city_analytics').select('*').eq('city_id', cityId).gte('date', new Date(new Date().setDate(1)).toISOString().split('T')[0])
    ])

    const publicationsThisMonth = monthAnalytics.data?.reduce((acc, day) => acc + (day.new_publications || 0), 0) || 0

    return {
      total_users: cityData.data?.users_count || 0,
      active_users_today: todayAnalytics.data?.active_users || 0,
      total_publications: cityData.data?.publications_count || 0,
      publications_this_month: publicationsThisMonth,
      total_comments: todayAnalytics.data?.comments_count || 0,
      total_reactions: todayAnalytics.data?.reactions_count || 0,
      growth_rate: 0 // Calcular posteriormente
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return {
      total_users: 0,
      active_users_today: 0,
      total_publications: 0,
      publications_this_month: 0,
      total_comments: 0,
      total_reactions: 0,
      growth_rate: 0
    }
  }
}

export async function getCityAnalytics(
  cityId: string,
  days: number = 30
): Promise<CityAnalytics[]> {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
      .from('city_analytics')
      .select('*')
      .eq('city_id', cityId)
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao buscar analytics:', error)
    return []
  }
}

// ============================================
// PUBLICAÇÕES POR CIDADE
// ============================================

export async function getCityPublications(
  cityId: string,
  filters?: {
    category?: string
    limit?: number
    offset?: number
  }
) {
  try {
    let query = supabase
      .from('publications')
      .select(`
        *,
        profiles:user_id (id, name, avatar_url, bairro, nivel)
      `)
      .eq('city_id', cityId)
      .eq('status', 'ativo')
      .order('created_at', { ascending: false })

    if (filters?.category) {
      query = query.eq('category', filters.category)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao buscar publicações:', error)
    return []
  }
}

// ============================================
// ADMINISTRAÇÃO
// ============================================

export async function checkCityAdmin(cityId: string, userId: string) {
  try {
    const { data } = await supabase
      .from('city_admins')
      .select('*')
      .eq('city_id', cityId)
      .eq('user_id', userId)
      .single()

    return !!data
  } catch (error) {
    return false
  }
}

export async function getCityAdminRole(cityId: string, userId: string) {
  try {
    const { data } = await supabase
      .from('city_admins')
      .select('role, permissions')
      .eq('city_id', cityId)
      .eq('user_id', userId)
      .single()

    return data
  } catch (error) {
    return null
  }
}

export async function addCityAdmin(
  cityId: string,
  userId: string,
  role: 'admin' | 'moderator' = 'moderator'
) {
  try {
    const { data, error } = await supabase
      .from('city_admins')
      .insert({
        city_id: cityId,
        user_id: userId,
        role
      })
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao adicionar admin:', error)
    return { data: null, error }
  }
}

// ============================================
// BUSCA
// ============================================

export async function searchCities(query: string) {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,state.ilike.%${query}%`)
      .order('name')
      .limit(10)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro na busca:', error)
    return []
  }
}

// ============================================
// VALIDAÇÃO DE ASSINATURA
// ============================================

export async function checkCitySubscription(cityId: string) {
  try {
    const { data } = await supabase
      .from('cities')
      .select('subscription_status, trial_ends_at, is_premium')
      .eq('id', cityId)
      .single()

    if (!data) return { isValid: false, isTrial: false, daysLeft: 0 }

    const isTrial = data.subscription_status === 'trial'
    const isActive = data.subscription_status === 'active'
    
    let daysLeft = 0
    if (isTrial && data.trial_ends_at) {
      const trialEnd = new Date(data.trial_ends_at)
      const today = new Date()
      daysLeft = Math.ceil((trialEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    }

    return {
      isValid: isActive || (isTrial && daysLeft > 0),
      isTrial,
      daysLeft,
      isPremium: data.is_premium
    }
  } catch (error) {
    return { isValid: false, isTrial: false, daysLeft: 0 }
  }
}