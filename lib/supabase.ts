// @/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

// Verifique as variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Variáveis de ambiente do Supabase não configuradas')
}

// Cliente para uso geral (client-side)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Para compatibilidade - exporta createSupabaseClient como alias
export const createSupabaseClient = () => createClient(supabaseUrl, supabaseAnonKey)

// Para componentes client com SSR (usando cookies)
export const createClientComponentClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Tipo para farmácias de plantão
export interface FarmaciaPlantao {
  id: string
  name: string
  address: string
  phone: string
  neighborhood?: string
  hours: string
  period: 'night' | 'weekend'
  is_today: boolean
  is_tomorrow: boolean
  schedule_date?: string
  created_at: string
  updated_at: string
}

// Função helper para obter o usuário atual (client side)
export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user
}

// Função helper para obter perfil do usuário
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Erro ao buscar perfil:', error)
    return null
  }
  
  return data
}