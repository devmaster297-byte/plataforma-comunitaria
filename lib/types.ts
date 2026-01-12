// lib/types.ts

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

export type Publication = {
  id: string
  user_id?: string | null
  title: string
  description: string
  images?: string[] | null
  category: 'ajuda' | 'servico' | 'vaga' | 'doacao' | 'aviso'
  status: 'ativo' | 'oculto' | 'inativo' | 'resolvido'
  created_at: string
  updated_at?: string | null
  location?: string | null
  contact_info?: string | null
  profiles?: {
    id: string
    name?: string | null
    avatar_url?: string | null
    bairro?: string | null
    phone?: string | null
    email?: string | null
  } | null
  comments_count: number
  reactions_count: number
}

export interface Comment {
  id: string
  publication_id: string
  user_id: string
  parent_id?: string
  content: string
  created_at: string
  updated_at: string
  profiles?: Profile
  replies?: Comment[]
  reactions_count?: number
  user_reacted?: boolean
}

export interface Reaction {
  id: string
  publication_id?: string
  comment_id?: string
  user_id: string
  type: 'like' | 'love' | 'care' | 'celebrate'
  created_at: string
  profiles?: Profile
}

export interface Notification {
  id: string
  user_id: string
  sender_id?: string
  type: 'comment' | 'reply' | 'reaction' | 'mention' | 'publication' | 'system'
  title: string
  message: string
  link?: string
  read: boolean
  created_at: string
  profiles?: Profile
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  requirement_type: string
  requirement_value: number
  created_at: string
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  earned_at: string
  badges?: Badge
}

export interface SearchSuggestion {
  id: string
  text: string
  type: 'recent' | 'popular' | 'category'
  count?: number
}

export interface CategoryStats {
  category: string
  count: number
  recent: number
}

export interface UserStats {
  publications_count: number
  comments_count: number
  reactions_received: number
  badges_count: number
  nivel: string
  pontos: number
}

export type CommentWithReplies = Comment & {
  replies: Comment[]
  reactions_count: number
  user_reacted: boolean
}

export type PublicationWithDetails = Publication & {
  comments: CommentWithReplies[]
  user_reacted: boolean
  is_owner: boolean
}

export type NotificationWithSender = Notification & {
  sender?: Profile
}
