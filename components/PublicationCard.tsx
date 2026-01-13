// components/PublicationCard.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Heart, 
  MessageCircle, 
  MapPin, 
  Clock,
  Eye,
  Share2
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toggleReaction, checkUserReaction } from '@/lib/supabase-helpers'
import { createSupabaseClient } from '@/lib/supabase'
import type { Publication } from '@/lib/types'

interface PublicationCardProps {
  publication: Publication
}

export default function PublicationCard({ publication }: PublicationCardProps) {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(publication.reactions_count || 0)
  const [user, setUser] = useState<any>(null)
  const [processing, setProcessing] = useState(false)
  const supabase = createSupabaseClient()

  useEffect(() => {
    checkUserAndLike()
  }, [])

  const checkUserAndLike = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user || null)

    if (session?.user) {
      const userLiked = await checkUserReaction(
        publication.id,
        'publication',
        session.user.id
      )
      setLiked(userLiked)
    }
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      window.location.href = '/login'
      return
    }

    if (processing) return

    setProcessing(true)
    const { reacted } = await toggleReaction(publication.id, 'publication', user.id)

    setLiked(reacted)
    setLikesCount(prev => reacted ? prev + 1 : prev - 1)
    setProcessing(false)
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const url = `${window.location.origin}/publicacao/${publication.id}`
    const text = `${publication.title} - Comunidade Local`

    if (navigator.share) {
      try {
        await navigator.share({ title: publication.title, text, url })
      } catch (err) {
        console.log('Compartilhamento cancelado')
      }
    } else {
      navigator.clipboard.writeText(url)
      alert('Link copiado para a área de transferência!')
    }
  }

  const getCategoryInfo = (category: string) => {
    const categories = {
      ajuda: { name: 'Ajuda', color: 'bg-red-100 text-red-700', icon: '🆘' },
      servico: { name: 'Serviço', color: 'bg-blue-100 text-blue-700', icon: '💼' },
      vaga: { name: 'Vaga', color: 'bg-green-100 text-green-700', icon: '📈' },
      doacao: { name: 'Doação', color: 'bg-purple-100 text-purple-700', icon: '🎁' },
      aviso: { name: 'Aviso', color: 'bg-yellow-100 text-yellow-700', icon: '📢' }
    }
    return categories[category as keyof typeof categories] || categories.aviso
  }

  const getNivelBadge = (nivel?: string) => {
    switch (nivel) {
      case 'expert': return '👑'
      case 'avancado': return '⭐'
      case 'intermediario': return '✨'
      default: return ''
    }
  }

  const categoryInfo = getCategoryInfo(publication.category)

  return (
    <Link href={`/publicacao/${publication.id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden h-full flex flex-col group">
        {/* Header do Card */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${categoryInfo.color}`}>
              {categoryInfo.icon} {categoryInfo.name}
            </span>
            
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <Share2 size={16} className="text-gray-400" />
            </button>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition line-clamp-2">
            {publication.title}
          </h3>

          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {publication.description}
          </p>

          {/* Autor */}
          <div className="flex items-center gap-3">
            {publication.profiles?.avatar_url ? (
              <img
                src={publication.profiles.avatar_url}
                alt={publication.profiles.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                {publication.profiles?.name?.[0]?.toUpperCase()}
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900 truncate">
                  {publication.profiles?.name}
                </p>
                {publication.profiles?.nivel && (
                  <span className="text-sm">
                    {getNivelBadge(publication.profiles.nivel)}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {publication.profiles?.bairro && (
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {publication.profiles.bairro}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {formatDistanceToNow(new Date(publication.created_at), {
                    addSuffix: true,
                    locale: ptBR
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer do Card - Interações */}
        <div className="p-4 bg-gray-50 mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Curtidas */}
              <button
                onClick={handleLike}
                disabled={processing}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  liked
                    ? 'bg-red-100 text-red-600'
                    : 'bg-white text-gray-600 hover:bg-red-50'
                } disabled:opacity-50`}
              >
                <Heart 
                  size={18} 
                  className={liked ? 'fill-current' : ''} 
                />
                <span className="font-semibold text-sm">{likesCount}</span>
              </button>

              {/* Comentários */}
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg text-gray-600">
                <MessageCircle size={18} />
                <span className="font-semibold text-sm">
                  {publication.comments_count || 0}
                </span>
              </div>
            </div>

            {/* Visualizar */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Eye size={16} />
              <span className="font-medium">Ver detalhes</span>
            </div>
          </div>
        </div>

        {/* Badge de status se resolvido */}
        {publication.status === 'resolvido' && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
              ✓ Resolvido
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}