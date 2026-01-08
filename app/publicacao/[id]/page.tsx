'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createSupabaseClient, Publication } from '@/lib/supabase'
import { MapPin, User, Clock, Trash2, ChevronLeft, ChevronRight, Phone } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Category = 'ajuda' | 'servico' | 'vaga' | 'doacao' | 'aviso'

const categoryColors: Record<Category, string> = {
  ajuda: 'bg-red-100 text-red-800',
  servico: 'bg-blue-100 text-blue-800',
  vaga: 'bg-green-100 text-green-800',
  doacao: 'bg-purple-100 text-purple-800',
  aviso: 'bg-yellow-100 text-yellow-800'
}

const categoryLabels: Record<Category, string> = {
  ajuda: 'Pedido de Ajuda',
  servico: 'Serviço Local',
  vaga: 'Vaga de Emprego',
  doacao: 'Doação',
  aviso: 'Aviso Importante'
}

export default function PublicacaoDetalhesPage() {
  const [publication, setPublication] = useState<Publication | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isOwner, setIsOwner] = useState(false)
  const router = useRouter()
  const params = useParams()
  const supabase = createSupabaseClient()

  useEffect(() => {
    if (params.id) {
      loadPublication()
    }
  }, [params.id])

  const loadPublication = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      const { data, error } = await supabase
        .from('publications')
        .select('*, profiles(id, name, avatar_url, phone, email)')
        .eq('id', params.id)
        .single()

      if (error) throw error
      
      setPublication(data)
      setIsOwner(session?.user?.id === data.user_id)
    } catch (error) {
      console.error('Erro ao carregar publicação:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta publicação?')) return

    try {
      const { error } = await supabase
        .from('publications')
        .delete()
        .eq('id', params.id)

      if (error) throw error
      
      alert('Publicação excluída com sucesso!')
      router.push('/')
    } catch (error) {
      console.error('Erro ao deletar:', error)
      alert('Erro ao deletar publicação')
    }
  }

  const nextImage = () => {
    if (publication?.images && publication.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === publication.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (publication?.images && publication.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? publication.images.length - 1 : prev - 1
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!publication) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Publicação não encontrada</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Voltar para o início
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Galeria de Imagens */}
          {publication.images && publication.images.length > 0 && (
            <div className="relative h-96 bg-gray-200">
              <img
                src={publication.images[currentImageIndex]}
                alt={publication.title}
                className="w-full h-full object-cover"
              />
              
              {publication.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                  >
                    <ChevronRight size={24} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {publication.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="p-6">
            {/* Cabeçalho */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${categoryColors[publication.category]}`}>
                    {categoryLabels[publication.category]}
                  </span>
                  <span className="flex items-center text-sm text-gray-500">
                    <Clock size={16} className="mr-1" />
                    {formatDistanceToNow(new Date(publication.created_at), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {publication.title}
                </h1>
              </div>

              {isOwner && (
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={handleDelete}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Excluir"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Descrição */}
            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">
                {publication.description}
              </p>
            </div>

            {/* Localização */}
            {publication.location && (
              <div className="flex items-center text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
                <MapPin size={20} className="mr-2 flex-shrink-0 text-primary-600" />
                <span className="font-medium">{publication.location}</span>
              </div>
            )}

            {/* Informações de Contato */}
            {publication.contact_info && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <Phone size={18} className="mr-2" />
                  Informações de Contato
                </h3>
                <p className="text-blue-800">{publication.contact_info}</p>
              </div>
            )}

            {/* Informações do Publicador */}
            <div className="border-t pt-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Publicado por</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  {publication.profiles?.avatar_url ? (
                    <img
                      src={publication.profiles.avatar_url}
                      alt={publication.profiles.name || 'Avatar'}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <User size={24} className="text-primary-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {publication.profiles?.name || 'Usuário'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Membro desde {new Date(publication.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>

            {/* Botão de Voltar */}
            <div className="mt-8 pt-6 border-t">
              <button
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
              >
                ← Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
