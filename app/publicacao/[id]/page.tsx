// app/publicacao/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Heart, 
  MessageCircle, 
  MapPin, 
  Clock,
  Share2,
  ArrowLeft,
  Flag,
  Edit,
  Trash2,
  CheckCircle,
  Phone,
  Mail
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { supabase } from '@/lib/supabase'
import { toggleReaction, checkUserReaction } from '@/lib/supabase-helpers'
import Comments from '@/components/Comments'
import type { Publication, Profile } from '@/lib/types'

export default function PublicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [publication, setPublication] = useState<Publication | null>(null)
  const [author, setAuthor] = useState<Profile | null>(null)
  const [user, setUser] = useState<any>(null)
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const dataFormatada =
  publication?.created_at && !isNaN(new Date(publication.created_at).getTime())
    ? new Date(publication.created_at).toLocaleString('pt-BR')
    : 'Data inválida';
  useEffect(() => {
    if (params.id) {
      loadPublication()
      checkUser()
    }
  }, [params.id])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user || null)
  }

  const loadPublication = async () => {
    try {
      const { data, error } = await supabase
        .from('publications')
        .select(`
          *,
          profiles:user_id (*)
        `)
        .eq('id', params.id)
        .single()

      if (error) throw error

      if (data) {
        setPublication(data)
        setAuthor(data.profiles as Profile)
        setLikesCount(data.reactions_count || 0)

        // Verificar se usuário curtiu
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const userLiked = await checkUserReaction(
            data.id,
            'publication',
            session.user.id
          )
          setLiked(userLiked)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar publicação:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    if (processing || !publication) return

    setProcessing(true)
    const { reacted } = await toggleReaction(publication.id, 'publication', user.id)

    setLiked(reacted)
    setLikesCount(prev => reacted ? prev + 1 : prev - 1)
    setProcessing(false)
  }

  const handleShare = async () => {
    const url = window.location.href
    const text = `${publication?.title} - Comunidade Local`

    if (navigator.share) {
      try {
        await navigator.share({ title: publication?.title, text, url })
      } catch (err) {
        console.log('Compartilhamento cancelado')
      }
    } else {
      navigator.clipboard.writeText(url)
      alert('Link copiado para a área de transferência!')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta publicação?')) return

    try {
      const { error } = await supabase
        .from('publications')
        .delete()
        .eq('id', params.id)
        .eq('user_id', user.id)

      if (error) throw error

      alert('Publicação excluída com sucesso!')
      router.push('/')
    } catch (error) {
      alert('Erro ao excluir publicação')
    }
  }

  const handleMarkAsResolved = async () => {
    if (!publication) return

    try {
      const { error } = await supabase
        .from('publications')
        .update({ status: publication.status === 'resolvido' ? 'ativo' : 'resolvido' })
        .eq('id', publication.id)
        .eq('user_id', user.id)

      if (error) throw error

      await loadPublication()
      alert(publication.status === 'resolvido' 
        ? 'Publicação reaberta!' 
        : 'Publicação marcada como resolvida!')
    } catch (error) {
      alert('Erro ao atualizar status')
    }
  }

  const getCategoryInfo = (category: string) => {
    const categories = {
      ajuda: { name: 'Pedido de Ajuda', color: 'bg-red-100 text-red-700 border-red-200', icon: '🆘' },
      servico: { name: 'Serviço', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '💼' },
      vaga: { name: 'Vaga', color: 'bg-green-100 text-green-700 border-green-200', icon: '📈' },
      doacao: { name: 'Doação', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: '🎁' },
      aviso: { name: 'Aviso', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: '📢' }
    }
    return categories[category as keyof typeof categories] || categories.aviso
  }

  const getNivelInfo = (nivel?: string) => {
    switch (nivel) {
      case 'expert': return { badge: '👑', color: 'text-purple-600', label: 'Expert' }
      case 'avancado': return { badge: '⭐', color: 'text-blue-600', label: 'Avançado' }
      case 'intermediario': return { badge: '✨', color: 'text-green-600', label: 'Intermediário' }
      default: return { badge: '🌱', color: 'text-gray-600', label: 'Iniciante' }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!publication) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Publicação não encontrada</h1>
          <Link href="/" className="text-primary-600 hover:underline">
            Voltar para o início
          </Link>
        </div>
      </div>
    )
  }

  const categoryInfo = getCategoryInfo(publication.category)
  const nivelInfo = getNivelInfo(author?.nivel)
  const isOwner = user?.id === publication.user_id

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition"
          >
            <ArrowLeft size={20} />
            Voltar
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card da Publicação */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-4 py-2 rounded-lg text-sm font-bold border-2 ${categoryInfo.color}`}>
                    {categoryInfo.icon} {categoryInfo.name}
                  </span>

                  {publication.status === 'resolvido' && (
                    <span className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-lg flex items-center gap-2">
                      <CheckCircle size={16} />
                      Resolvido
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {publication.title}
                </h1>

                <p className="text-gray-700 text-lg whitespace-pre-wrap leading-relaxed">
                  {publication.description}
                </p>

                {/* Imagens (se houver) */}
                {publication.images && publication.images.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    {publication.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Imagem ${idx + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Ações */}
              <div className="p-6 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleLike}
                      disabled={processing}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                        liked
                          ? 'bg-red-100 text-red-600'
                          : 'bg-white text-gray-600 hover:bg-red-50'
                      } disabled:opacity-50`}
                    >
                      <Heart size={20} className={liked ? 'fill-current' : ''} />
                      {likesCount}
                    </button>

                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-gray-600 font-semibold">
                      <MessageCircle size={20} />
                      {publication.comments_count || 0}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShare}
                      className="p-2 hover:bg-white rounded-lg transition"
                      title="Compartilhar"
                    >
                      <Share2 size={20} className="text-gray-600" />
                    </button>

                    {!isOwner && (
                      <button
                        className="p-2 hover:bg-white rounded-lg transition"
                        title="Denunciar"
                      >
                        <Flag size={20} className="text-gray-600" />
                      </button>
                    )}

                    {isOwner && (
                      <>
                        <button
                          onClick={handleMarkAsResolved}
                          className="p-2 hover:bg-white rounded-lg transition"
                          title={publication.status === 'resolvido' ? 'Reabrir' : 'Marcar como resolvido'}
                        >
                          <CheckCircle size={20} className="text-green-600" />
                        </button>

                        <Link
                          href={`/publicacao/${publication.id}/editar`}
                          className="p-2 hover:bg-white rounded-lg transition"
                          title="Editar"
                        >
                          <Edit size={20} className="text-blue-600" />
                        </Link>

                        <button
                          onClick={handleDelete}
                          className="p-2 hover:bg-white rounded-lg transition"
                          title="Excluir"
                        >
                          <Trash2 size={20} className="text-red-600" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Comentários */}
            <Comments 
              publicationId={publication.id}
              userId={user?.id}
              initialCount={publication.comments_count}
            />
          </div>

          {/* Sidebar - Info do Autor */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Publicado por
              </h3>

              <div className="flex items-center gap-3 mb-4">
                {author?.avatar_url ? (
                  <img
                    src={author.avatar_url}
                    alt={author.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {author?.name?.[0]?.toUpperCase()}
                  </div>
                )}

                <div>
                  <Link
                    href={`/usuario/${author?.id}`}
                    className="font-bold text-gray-900 hover:text-primary-600 transition"
                  >
                    {author?.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-sm ${nivelInfo.color}`}>
                      {nivelInfo.badge} {nivelInfo.label}
                    </span>
                  </div>
                </div>
              </div>

              {author?.bio && (
                <p className="text-gray-600 text-sm mb-4 pb-4 border-b border-gray-100">
                  {author.bio}
                </p>
              )}

              <div className="space-y-3 text-sm">
                {author?.bairro && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} className="text-gray-400" />
                    {author.bairro}
                  </div>
                )}

                <div className="flex items-center gap-2 text-gray-600">
                   <Clock size={16} className="text-gray-400" />
                    Membro { 
                    author?.membro_desde && !isNaN(new Date(author.membro_desde).getTime())
                     ? formatDistanceToNow(new Date(author.membro_desde), { 
                      addSuffix: true,
                       locale: ptBR,
                        }) 
                        : 'Data inválida' 
                        } 
                        </div>

                {user && !isOwner && (
                  <>
                    {author?.phone && (
                      <a
                        href={`tel:${author.phone}`}
                        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition"
                      >
                        <Phone size={16} />
                        {author.phone}
                      </a>
                    )}

                    {author?.email && (
                      <a
                        href={`mailto:${author.email}`}
                        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition"
                      >
                        <Mail size={16} />
                        Enviar email
                      </a>
                    )}
                  </>
                )}
              </div>

              {!user && (
                <div className="mt-6 p-4 bg-primary-50 rounded-lg text-center">
                  <p className="text-sm text-gray-700 mb-3">
                    Faça login para entrar em contato
                  </p>
                  <Link
                    href="/login"
                    className="block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
                  >
                    Fazer login
                  </Link>
                </div>
              )}

              {/* Estatísticas do autor */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-3">Estatísticas</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary-600">
                      {author?.pontos || 0}
                    </div>
                    <div className="text-xs text-gray-600">Pontos</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {/* Poderia buscar do banco */}
                      -
                    </div>
                    <div className="text-xs text-gray-600">Publicações</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}