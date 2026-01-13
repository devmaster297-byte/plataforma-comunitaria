// app/explorar/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import PublicationCard from '@/components/PublicationCard'
import AdvancedSearch from '@/components/AdvancedSearch'
import Link from 'next/link'
import { 
  Heart, 
  Briefcase, 
  TrendingUp, 
  Gift, 
  Bell,
  Users,
  MapPin,
  TrendingUp as Fire,
  ArrowRight,
  Star
} from 'lucide-react'
import type { Publication } from '@/lib/types'

export default function ExplorePage() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    total_users: 0,
    total_publications: 0,
    total_interactions: 0
  })
  const supabase = createSupabaseClient()

  useEffect(() => {
    checkUser()
    loadPublications()
    loadStats()
  }, [selectedCategory])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user || null)
  }

  const loadPublications = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('publications')
        .select(`
          *,
          profiles:user_id (id, name, avatar_url, bairro, nivel)
        `)
        .eq('status', 'ativo')
        .order('created_at', { ascending: false })
        .limit(12)

      if (selectedCategory) {
        query = query.eq('category', selectedCategory)
      }

      const { data } = await query
      setPublications(data || [])
    } catch (error) {
      console.error('Erro ao carregar publicações:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const [usersRes, pubsRes, reactionsRes] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('publications').select('*', { count: 'exact', head: true }),
        supabase.from('reactions').select('*', { count: 'exact', head: true })
      ])

      setStats({
        total_users: usersRes.count || 0,
        total_publications: pubsRes.count || 0,
        total_interactions: reactionsRes.count || 0
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }

  const handleSearchResults = (results: Publication[]) => {
    setPublications(results)
    setSelectedCategory('')
  }

  const categories = [
    { id: 'ajuda', name: 'Ajuda', icon: Heart, color: 'from-red-500 to-red-600', count: 0 },
    { id: 'servico', name: 'Serviços', icon: Briefcase, color: 'from-blue-500 to-blue-600', count: 0 },
    { id: 'vaga', name: 'Vagas', icon: TrendingUp, color: 'from-green-500 to-green-600', count: 0 },
    { id: 'doacao', name: 'Doações', icon: Gift, color: 'from-purple-500 to-purple-600', count: 0 },
    { id: 'aviso', name: 'Avisos', icon: Bell, color: 'from-yellow-500 to-yellow-600', count: 0 }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore a Comunidade
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Descubra pedidos, serviços, vagas e muito mais na sua cidade
            </p>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2" />
              <div className="text-3xl font-bold">{stats.total_users}</div>
              <div className="text-sm text-primary-100">Usuários</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <Fire className="w-8 h-8 mx-auto mb-2" />
              <div className="text-3xl font-bold">{stats.total_publications}</div>
              <div className="text-sm text-primary-100">Publicações</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <Heart className="w-8 h-8 mx-auto mb-2" />
              <div className="text-3xl font-bold">{stats.total_interactions}</div>
              <div className="text-sm text-primary-100">Interações</div>
            </div>
          </div>

          {/* CTA para não-logados */}
          {!user && (
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto">
              <p className="text-lg mb-4">
                Cadastre-se gratuitamente para publicar e interagir com a comunidade
              </p>
              <div className="flex gap-3 justify-center">
                <Link
                  href="/cadastro"
                  className="px-6 py-3 bg-white text-primary-700 rounded-lg hover:bg-primary-50 transition font-bold flex items-center gap-2"
                >
                  Criar conta grátis
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/login"
                  className="px-6 py-3 bg-primary-800/50 backdrop-blur-sm border-2 border-white/30 text-white rounded-lg hover:bg-primary-800/70 transition font-bold"
                >
                  Já tenho conta
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Busca */}
      <div className="bg-white py-8 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdvancedSearch onResults={handleSearchResults} />
        </div>
      </div>

      {/* Categorias */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Navegue por Categoria
          </h2>
          <p className="text-gray-600">
            Encontre rapidamente o que procura
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? '' : cat.id)}
                className={`group p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 ${
                  selectedCategory === cat.id ? 'ring-4 ring-primary-500 shadow-xl' : ''
                }`}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="text-white" size={28} />
                </div>
                <h3 className="font-bold text-gray-900 text-center">{cat.name}</h3>
              </button>
            )
          })}
        </div>

        {selectedCategory && (
          <div className="text-center mb-6">
            <button
              onClick={() => setSelectedCategory('')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Mostrar todas as categorias
            </button>
          </div>
        )}

        {/* Lista de publicações */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory 
                ? `${categories.find(c => c.id === selectedCategory)?.name}` 
                : 'Todas as Publicações'}
            </h2>
            <span className="text-gray-600">
              {publications.length} resultado{publications.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : publications.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-md">
              <p className="text-gray-500 text-lg mb-6">
                Nenhuma publicação encontrada nesta categoria
              </p>
              {!user && (
                <Link
                  href="/cadastro"
                  className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
                >
                  Seja o primeiro a publicar
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publications.map((pub) => (
                  <PublicationCard key={pub.id} publication={pub} />
                ))}
              </div>

              {publications.length >= 12 && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadPublications}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                  >
                    Carregar mais
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* CTA Final para não-logados */}
      {!user && (
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <Star className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">
              Pronto para participar?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Crie sua conta gratuita e comece a interagir com sua comunidade hoje mesmo
            </p>
            <Link
              href="/cadastro"
              className="inline-block px-8 py-4 bg-white text-primary-700 rounded-lg hover:bg-primary-50 transition font-bold text-lg shadow-lg hover:shadow-xl"
            >
              Criar conta grátis
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}