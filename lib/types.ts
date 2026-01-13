export interface Profile {
  id: string
  name: string
  email: string
  avatar_url?: string
  bio?: string
  phone?: string
  bairro?: string
  city_id?: string
  pontos: number
  nivel: 'iniciante' | 'intermediario' | 'avancado' | 'expert'
  membro_desde: string
  ultima_atividade: string
  created_at: string
  updated_at: string
}

export interface Publication {
  id: string
  user_id: string
  city_id?: string
  title: string
  description: string
  category: 'ajuda' | 'servico' | 'vaga' | 'doacao' | 'aviso'
  status: 'ativo' | 'resolvido' | 'inativo'
  images?: string[]
  comments_count: number
  reactions_count: number
  created_at: string
  updated_at: string
  profiles?: Profile
}
