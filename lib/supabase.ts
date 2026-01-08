import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Types para o banco de dados
export interface Profile {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  phone: string | null
  role?: string
  created_at: string
  updated_at: string
}

export interface Publication {
  id: string
  user_id: string
  title: string
  description: string
  category: 'ajuda' | 'servico' | 'vaga' | 'doacao' | 'aviso'
  status: 'ativo' | 'inativo' | 'oculto'
  location: string | null
  contact_info: string | null
  images: string[]
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Ad {
  id: string
  user_id: string
  title: string
  description: string
  image_url: string | null
  link_url: string | null
  start_date: string
  end_date: string
  status: 'pendente' | 'ativo' | 'expirado'
  payment_status: 'pendente' | 'pago' | 'cancelado'
  created_at: string
}

// Cliente para uso no lado do cliente (Client Components)
export const createSupabaseClient = () => {
  return createClientComponentClient()
}

// Funções auxiliares
export const uploadImage = async (file: File, bucket: string = 'publications') => {
  const supabase = createSupabaseClient()
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = fileName

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return publicUrl
}
