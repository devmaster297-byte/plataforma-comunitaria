'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient, Publication } from '@/lib/supabase'
import PublicationCard from '@/components/PublicationCard'
import FarmaciasPlantao from '@/components/FarmaciasPlantao'
import Link from 'next/link'
import { Search, Heart, Users, Briefcase, Gift, Bell, MessageCircle, TrendingUp, ArrowRight, PlusCircle } from 'lucide-react'

export default function Home() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const supabase = createSupabaseClient()

  useEffect(() => {
    checkUser()
    loadPublications()
  }, [category])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user || null)

    if (session?.user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      setProfile(data)
    }
  }

  const loadPublications = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('publications')
        .select('*, profiles(id, name, avatar_url, bairro)')
        .eq('status', 'ativo')
        .order('created_at', { ascending: false })
        .limit(6)

      if (category) query = query.eq('category', category)
      const { data } = await query
      setPublications(data || [])
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      let query = supabase
        .from('publications')
        .select('*, profiles(id, name, avatar_url, bairro)')
        .eq('status', 'ativo')
        .order('created_at', { ascending: false })

      if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
      if (category) query = query.eq('category', category)

      const { data } = await query
      setPublications(data || [])
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryClick = (catId: string) => {
    setCategory(catId)
    setTimeout(() => {
      const element = document.getElementById('publicacoes')
      if (element) {
        const offset = 100
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - offset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }, 100)
  }

  const categories = [
    { id: 'ajuda', name: 'Pedidos de Ajuda', icon: Heart, color: 'from-red-500 to-red-600', description: 'Precisa de uma mão?' },
    { id: 'servico', name: 'Serviços', icon: Briefcase, color: 'from-blue-500 to-blue-600', description: 'Encontre profissionais' },
    { id: 'vaga', name: 'Vagas', icon: TrendingUp, color: 'from-green-500 to-green-600', description: 'Oportunidades locais' },
    { id: 'doacao', name: 'Doações', icon: Gift, color: 'from-purple-500 to-purple-600', description: 'Doe ou receba' },
    { id: 'aviso', name: 'Avisos', icon: Bell, color: 'from-yellow-500 to-yellow-600', description: 'Fique por dentro' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Banner Personalizado */}
      {user ? (
        <div className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Olá, {profile?.name?.split(' ')[0] || 'vizinho'}! 👋
                </h1>
                <p className="text-lg text-primary-100">
                  O que você gostaria de fazer hoje?
                </p>
              </div>
              
              <Link
                href="/publicar"
                className="flex items-center gap-2 px-8 py-4 bg-white text-primary-700 rounded-lg hover:bg-primary-50 transition font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <PlusCircle size={24} />
                Criar Publicação
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6bS0yLTJ2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0tMiA0djJoMnYtMmgtMnptMC00djJoMnYtMmgtMnptLTIgNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bS0yIDR2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0tMiA0djJoMnYtMmgtMnptMC00djJoMnYtMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Conectando pessoas da nossa cidade para
                <span className="block text-primary-200">ajudar, trabalhar e crescer juntos</span>
              </h1>
              <p className="text-xl md:text-2xl text-primary-100 mb-10 leading-relaxed">
                Uma praça digital onde vizinhos se encontram, ajudam e fortalecem a comunidade
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/cadastro"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-primary-700 rounded-lg hover:bg-primary-50 transition font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  Criar conta gratuita
                  <ArrowRight size={20} />
                </Link>
                <button
                  onClick={() => handleCategoryClick('')}
                  className="w-full sm:w-auto px-8 py-4 bg-primary-800/50 backdrop-blur-sm border-2 border-white/30 text-white rounded-lg hover:bg-primary-800/70 transition font-bold text-lg"
                >
                  Ver o que está acontecendo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Como Funciona - Só para visitantes */}
      {!user && (
        <div className="bg-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Como funciona
              </h2>
              <p className="text-xl text-gray-600">
                Três passos simples para fortalecer sua comunidade
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <MessageCircle className="text-white" size={40} />
                </div>
                <div className="mb-4">
                  <span className="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-3">
                    Passo 1
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">📝 Publique</h3>
                <p className="text-gray-600 text-lg">
                  Compartilhe um pedido, ofereça um serviço ou faça um aviso importante
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Users className="text-white" size={40} />
                </div>
                <div className="mb-4">
                  <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-3">
                    Passo 2
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">🤝 Converse</h3>
                <p className="text-gray-600 text-lg">
                  Conecte-se com moradores da sua cidade de forma simples e direta
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Heart className="text-white" size={40} />
                </div>
                <div className="mb-4">
                  <span className="inline-block px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-3">
                    Passo 3
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">🌱 Fortaleça</h3>
                <p className="text-gray-600 text-lg">
                  Construa uma comunidade mais unida, solidária e próspera
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categorias com Ícones Grandes */}
      <div className={`${user ? 'bg-white' : 'bg-gray-50'} py-16 md:py-24`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore por categoria
            </h2>
            <p className="text-xl text-gray-600">
              O que você está procurando hoje?
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`group p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-2 ${
                    category === cat.id ? 'ring-4 ring-primary-500 shadow-xl' : ''
                  }`}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="text-white" size={32} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{cat.name}</h3>
                  <p className="text-sm text-gray-600">{cat.description}</p>
                </button>
              )
            })}
          </div>

          {category && (
            <div className="text-center mt-8">
              <button
                onClick={() => setCategory('')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                ← Mostrar todas as categorias
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Farmácias de Plantão */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FarmaciasPlantao />
      </div>

      {/* Barra de Busca */}
      <div id="publicacoes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar publicações..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold text-lg shadow-md hover:shadow-lg"
            >
              Buscar
            </button>
          </form>
        </div>
      </div>

      {/* Últimas Publicações */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {category ? `${categories.find(c => c.id === category)?.name}` : 'Acontecendo agora na cidade'}
          </h2>
          <p className="text-gray-600 text-lg">
            {category ? 'Veja as publicações desta categoria' : 'Últimas publicações da comunidade'}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : publications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <p className="text-gray-500 text-lg mb-6">
              {category ? 'Nenhuma publicação nesta categoria ainda' : 'Seja o primeiro a publicar!'}
            </p>
            <Link
              href="/publicar"
              className="inline-block px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
            >
              Criar primeira publicação
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publications.map((pub) => (
                <PublicationCard key={pub.id} publication={pub} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link
                href="/publicar"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Criar sua publicação
                <ArrowRight size={20} />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
