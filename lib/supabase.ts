import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export interface Profile {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  phone: string | null
  bairro: string | null
  role?: string
  created_at: string
  updated_at: string
}

export type Publication = {
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
  comments_count: number
  reactions_count: number
}

export interface Comment {
  id: string
  publication_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface FarmaciaPlantao {
  id: string
  nome: string
  endereco: string
  telefone: string
  whatsapp: string | null
  horario_inicio: string
  horario_fim: string
  dias_semana: string[]
  ativa: boolean
  ordem: number
  created_at: string
  updated_at: string
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

export const createSupabaseClient = () => {
  return createClientComponentClient()
}

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
