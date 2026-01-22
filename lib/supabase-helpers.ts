// lib/supabase-helpers.ts
// ============================================
// FUNÇÕES AUXILIARES SUPABASE - FASE 1
// ============================================

import { supabase } from './supabase'
import type { 
  Comment, 
  Reaction, 
  Notification, 
  CommentWithReplies,
  UserStats 
} from './types'



// ============================================
// COMENTÁRIOS
// ============================================

export async function getPublicationComments(publicationId: string, userId?: string) {
  try {
    const { data: comments, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles:user_id (id, name, avatar_url, nivel),
        reactions:reactions(count)
      `)
      .eq('publication_id', publicationId)
      .is('parent_id', null)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Buscar respostas para cada comentário
    const commentsWithReplies = await Promise.all(
      (comments || []).map(async (comment) => {
        const { data: replies } = await supabase
          .from('comments')
          .select(`
            *,
            profiles:user_id (id, name, avatar_url, nivel)
          `)
          .eq('parent_id', comment.id)
          .order('created_at', { ascending: true })

        // Verificar se usuário curtiu
        let userReacted = false
        if (userId) {
          const { data } = await supabase
            .from('reactions')
            .select('id')
            .eq('comment_id', comment.id)
            .eq('user_id', userId)
            .single()
          userReacted = !!data
        }

        return {
          ...comment,
          replies: replies || [],
          reactions_count: comment.reactions?.[0]?.count || 0,
          user_reacted: userReacted
        }
      })
    )

    return commentsWithReplies as CommentWithReplies[]
  } catch (error) {
    console.error('Erro ao buscar comentários:', error)
    return []
  }
}

export async function createComment(
  publicationId: string,
  content: string,
  userId: string,
  parentId?: string
) {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        publication_id: publicationId,
        user_id: userId,
        content,
        parent_id: parentId
      })
      .select(`
        *,
        profiles:user_id (id, name, avatar_url, nivel)
      `)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao criar comentário:', error)
    return { data: null, error }
  }
}

export async function deleteComment(commentId: string, userId: string) {
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', userId)

    if (error) throw error
    return { success: true, error: null }
  } catch (error) {
    console.error('Erro ao deletar comentário:', error)
    return { success: false, error }
  }
}

// ============================================
// REAÇÕES
// ============================================

export async function toggleReaction(
  targetId: string,
  targetType: 'publication' | 'comment',
  userId: string
) {
  try {
    // Verificar se já curtiu
    const queryField = targetType === 'publication' ? 'publication_id' : 'comment_id'
    
    const { data: existing } = await supabase
      .from('reactions')
      .select('id')
      .eq(queryField, targetId)
      .eq('user_id', userId)
      .single()

    if (existing) {
      // Remover curtida
      const { error } = await supabase
        .from('reactions')
        .delete()
        .eq('id', existing.id)
      
      if (error) throw error
      return { reacted: false, error: null }
    } else {
      // Adicionar curtida
      const insertData = {
        user_id: userId,
        type: 'like',
        [queryField]: targetId
      }

      const { error } = await supabase
        .from('reactions')
        .insert(insertData)
      
      if (error) throw error
      return { reacted: true, error: null }
    }
  } catch (error) {
    console.error('Erro ao alternar reação:', error)
    return { reacted: false, error }
  }
}

export async function getReactionsCount(
  targetId: string,
  targetType: 'publication' | 'comment'
) {
  try {
    const queryField = targetType === 'publication' ? 'publication_id' : 'comment_id'
    
    const { count, error } = await supabase
      .from('reactions')
      .select('*', { count: 'exact', head: true })
      .eq(queryField, targetId)

    if (error) throw error
    return count || 0
  } catch (error) {
    console.error('Erro ao contar reações:', error)
    return 0
  }
}

export async function checkUserReaction(
  targetId: string,
  targetType: 'publication' | 'comment',
  userId: string
) {
  try {
    const queryField = targetType === 'publication' ? 'publication_id' : 'comment_id'
    
    const { data } = await supabase
      .from('reactions')
      .select('id')
      .eq(queryField, targetId)
      .eq('user_id', userId)
      .single()

    return !!data
  } catch (error) {
    return false
  }
}

// ============================================
// NOTIFICAÇÕES
// ============================================

export async function getUserNotifications(userId: string, limit = 20) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        profiles:sender_id (id, name, avatar_url)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao buscar notificações:', error)
    return []
  }
}

export async function getUnreadNotificationsCount(userId: string) {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) throw error
    return count || 0
  } catch (error) {
    console.error('Erro ao contar notificações:', error)
    return 0
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Erro ao marcar notificação:', error)
    return { success: false }
  }
}

export async function markAllNotificationsAsRead(userId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Erro ao marcar todas notificações:', error)
    return { success: false }
  }
}

// ============================================
// PERFIL E ESTATÍSTICAS
// ============================================

export async function getUserStats(userId: string): Promise<UserStats> {
  try {
    const [publicationsRes, commentsRes, reactionsRes, badgesRes, profileRes] = await Promise.all([
      supabase.from('publications').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('comments').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('reactions').select('*', { count: 'exact', head: true }).or(`publication_id.in.(${await getPublicationIds(userId)}),comment_id.in.(${await getCommentIds(userId)})`),
      supabase.from('user_badges').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('profiles').select('nivel, pontos').eq('id', userId).single()
    ])

    return {
      publications_count: publicationsRes.count || 0,
      comments_count: commentsRes.count || 0,
      reactions_received: reactionsRes.count || 0,
      badges_count: badgesRes.count || 0,
      nivel: profileRes.data?.nivel || 'iniciante',
      pontos: profileRes.data?.pontos || 0
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return {
      publications_count: 0,
      comments_count: 0,
      reactions_received: 0,
      badges_count: 0,
      nivel: 'iniciante',
      pontos: 0
    }
  }
}

async function getPublicationIds(userId: string) {
  const { data } = await supabase
    .from('publications')
    .select('id')
    .eq('user_id', userId)
  return data?.map(p => p.id).join(',') || ''
}

async function getCommentIds(userId: string) {
  const { data } = await supabase
    .from('comments')
    .select('id')
    .eq('user_id', userId)
  return data?.map(c => c.id).join(',') || ''
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<{
    name: string
    bio: string
    phone: string
    bairro: string
    avatar_url: string
  }>
) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    return { data: null, error }
  }
}

// ============================================
// BUSCA
// ============================================

export async function searchPublications(query: string, filters?: {
  category?: string
  cidade?: string
  limit?: number
}) {
  try {
    let dbQuery = supabase
      .from('publications')
      .select(`
        *,
        profiles:user_id (id, name, avatar_url, bairro, nivel)
      `)
      .eq('status', 'ativo')
      .order('created_at', { ascending: false })

    if (query) {
      dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    }

    if (filters?.category) {
      dbQuery = dbQuery.eq('category', filters.category)
    }

    if (filters?.limit) {
      dbQuery = dbQuery.limit(filters.limit)
    }

    const { data, error } = await dbQuery

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro na busca:', error)
    return []
  }
}

export async function getPopularSearches(limit = 5) {
  // Por enquanto retorna categorias mais usadas
  try {
    const { data } = await supabase
      .from('publications')
      .select('category')
      .eq('status', 'ativo')

    if (!data) return []

    const counts = data.reduce((acc, { category }) => {
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([category, count]) => ({
        id: category,
        text: category,
        type: 'popular' as const,
        count
      }))
  } catch (error) {
    return []
  }
}

// ============================================
// UPLOAD DE AVATAR
// ============================================

export async function uploadAvatar(userId: string, file: File) {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('public')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('public')
      .getPublicUrl(filePath)

    // Atualizar perfil com nova URL
    await updateUserProfile(userId, { avatar_url: publicUrl })

    return { url: publicUrl, error: null }
  } catch (error) {
    console.error('Erro ao fazer upload:', error)
    return { url: null, error }
  }
}