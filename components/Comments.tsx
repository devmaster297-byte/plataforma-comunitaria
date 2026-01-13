// components/Comments.tsx
'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Heart, Reply, Trash2, Send } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  getPublicationComments, 
  createComment, 
  deleteComment,
  toggleReaction 
} from '@/lib/supabase-helpers'
import type { CommentWithReplies } from '@/lib/types'

interface CommentsProps {
  publicationId: string
  userId?: string
  initialCount?: number
}

export default function Comments({ publicationId, userId, initialCount = 0 }: CommentsProps) {
  const [comments, setComments] = useState<CommentWithReplies[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadComments()
  }, [publicationId])

  const loadComments = async () => {
    setLoading(true)
    const data = await getPublicationComments(publicationId, userId)
    setComments(data)
    setLoading(false)
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !userId || submitting) return

    setSubmitting(true)
    const { data, error } = await createComment(publicationId, newComment, userId)
    
    if (data && !error) {
      setNewComment('')
      await loadComments()
    }
    setSubmitting(false)
  }

  const handleSubmitReply = async (commentId: string) => {
    if (!replyContent.trim() || !userId || submitting) return

    setSubmitting(true)
    const { data, error } = await createComment(publicationId, replyContent, userId, commentId)
    
    if (data && !error) {
      setReplyContent('')
      setReplyingTo(null)
      await loadComments()
    }
    setSubmitting(false)
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Tem certeza que deseja excluir este comentário?')) return
    
    const { success } = await deleteComment(commentId, userId!)
    if (success) {
      await loadComments()
    }
  }

  const handleToggleLike = async (commentId: string) => {
    if (!userId) return
    
    await toggleReaction(commentId, 'comment', userId)
    await loadComments()
  }

  const getNivelColor = (nivel?: string) => {
    switch (nivel) {
      case 'expert': return 'text-purple-600 font-bold'
      case 'avancado': return 'text-blue-600 font-semibold'
      case 'intermediario': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getNivelBadge = (nivel?: string) => {
    switch (nivel) {
      case 'expert': return '👑'
      case 'avancado': return '⭐'
      case 'intermediario': return '✨'
      default: return ''
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="text-primary-600" size={24} />
        <h3 className="text-xl font-bold text-gray-900">
          Comentários ({comments.length})
        </h3>
      </div>

      {/* Formulário de novo comentário */}
      {userId ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex gap-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva um comentário..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={3}
              maxLength={1000}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || submitting}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed h-fit flex items-center gap-2"
            >
              <Send size={18} />
              {submitting ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {newComment.length}/1000 caracteres
          </p>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">
            <a href="/login" className="text-primary-600 hover:underline">Faça login</a> para comentar
          </p>
        </div>
      )}

      {/* Lista de comentários */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MessageCircle size={48} className="mx-auto mb-3 opacity-20" />
          <p>Seja o primeiro a comentar!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border-l-4 border-gray-200 pl-4">
              {/* Comentário principal */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                      {comment.profiles?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">
                          {comment.profiles?.name}
                        </p>
                        <span className={getNivelColor(comment.profiles?.nivel)}>
                          {getNivelBadge(comment.profiles?.nivel)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(comment.created_at), {
                          addSuffix: true,
                          locale: ptBR
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {userId === comment.user_id && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                  {comment.content}
                </p>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleToggleLike(comment.id)}
                    disabled={!userId}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full transition ${
                      comment.user_reacted
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-200 text-gray-600 hover:bg-red-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Heart 
                      size={16} 
                      className={comment.user_reacted ? 'fill-current' : ''} 
                    />
                    <span className="text-sm font-medium">
                      {comment.reactions_count || 0}
                    </span>
                  </button>

                  {userId && (
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition text-sm font-medium"
                    >
                      <Reply size={16} />
                      Responder
                    </button>
                  )}
                </div>
              </div>

              {/* Formulário de resposta */}
              {replyingTo === comment.id && (
                <div className="mt-3 ml-8">
                  <div className="flex gap-2">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Escreva sua resposta..."
                      className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
                      rows={2}
                      maxLength={1000}
                    />
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleSubmitReply(comment.id)}
                        disabled={!replyContent.trim() || submitting}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 text-sm"
                      >
                        Enviar
                      </button>
                      <button
                        onClick={() => {
                          setReplyingTo(null)
                          setReplyContent('')
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Respostas */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 ml-8 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {reply.profiles?.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-gray-900 text-sm">
                                {reply.profiles?.name}
                              </p>
                              <span className={`text-xs ${getNivelColor(reply.profiles?.nivel)}`}>
                                {getNivelBadge(reply.profiles?.nivel)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(reply.created_at), {
                                addSuffix: true,
                                locale: ptBR
                              })}
                            </p>
                          </div>
                        </div>
                        
                        {userId === reply.user_id && (
                          <button
                            onClick={() => handleDeleteComment(reply.id)}
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      <p className="text-gray-700 text-sm whitespace-pre-wrap">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}