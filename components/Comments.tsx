'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient, Comment } from '@/lib/supabase'
import { MessageCircle, Send, Trash2, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface CommentsProps {
  publicationId: string
}

export default function Comments({ publicationId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createSupabaseClient()

  useEffect(() => {
    checkUser()
    loadComments()

    // Realtime subscription
    const channel = supabase
      .channel(`comments:${publicationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `publication_id=eq.${publicationId}`
        },
        () => {
          loadComments()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [publicationId])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUserId(session?.user?.id || null)
  }

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*, profiles(id, name, avatar_url)')
        .eq('publication_id', publicationId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('Erro ao carregar comentários:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userId) {
      router.push('/login')
      return
    }

    if (!newComment.trim()) return

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          publication_id: publicationId,
          user_id: userId,
          content: newComment.trim()
        })

      if (error) throw error

      setNewComment('')
      loadComments()
    } catch (error) {
      console.error('Erro ao comentar:', error)
      alert('Erro ao enviar comentário')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm('Deseja excluir este comentário?')) return

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

      if (error) throw error
      loadComments()
    } catch (error) {
      console.error('Erro ao deletar:', error)
      alert('Erro ao excluir comentário')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="text-primary-600" size={24} />
        <h3 className="text-xl font-bold text-gray-900">
          Comentários ({comments.length})
        </h3>
      </div>

      {/* Formulário de novo comentário */}
      {userId ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva um comentário..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
            >
              <Send size={18} />
              Enviar
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-gray-600 mb-3">Faça login para comentar</p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
          >
            Fazer login
          </button>
        </div>
      )}

      {/* Lista de comentários */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MessageCircle size={48} className="mx-auto mb-3 opacity-50" />
          <p>Seja o primeiro a comentar!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  {comment.profiles?.avatar_url ? (
                    <img
                      src={comment.profiles.avatar_url}
                      alt={comment.profiles.name || 'Avatar'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <User size={20} className="text-primary-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {comment.profiles?.name || 'Usuário'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.created_at), {
                          addSuffix: true,
                          locale: ptBR
                        })}
                      </span>
                    </div>

                    {userId === comment.user_id && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded transition"
                        title="Excluir comentário"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <p className="text-gray-700 break-words">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
