'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Search, 
  Filter, 
  X, 
  SlidersHorizontal,
  TrendingUp,
  Clock,
  Heart,
  MapPin,
  ChevronDown
} from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'
import type { Publication } from '@/lib/types'
import PublicationCard from '@/components/PublicationCard'

const CATEGORIES = [
  { id: 'all', name: 'Todas', icon: '📋', color: 'bg-gray-100 text-gray-700' },
  { id: 'ajuda', name: 'Pedidos de Ajuda', icon: '🆘', color: 'bg-red-100 text-red-700' },
  { id: 'servico', name: 'Serviços', icon: '💼', color: 'bg-blue-100 text-blue-700' },
  { id: 'vaga', name: 'Vagas', icon: '📈', color: 'bg-green-100 text-green-700' },
  { id: 'doacao', name: 'Doações', icon: '🎁', color: 'bg-purple-100 text-purple-700' },
  { id: 'aviso', name: 'Avisos', icon: '📢', color: 'bg-yellow-100 text-yellow-700' }
]

const SORT_OPTIONS = [
  { value: 'recent', label: 'Mais Recentes', icon: Clock },
  { value: 'popular', label: 'Mais Populares', icon: TrendingUp },
  { value: 'reactions', label: 'Mais Curtidas', icon: Heart }
]

function ExplorarContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createSupabaseClient()

  const [publications, setPublications] = useState<Publication[]>([])
  const [filteredPublications, setFilteredPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filtros
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedBairro, setSelectedBairro] = useState('')
  
  // Estatísticas
  const [stats, setStats] = useState({
    total: 0,
    ajuda: 0,
    servico: 0,
    vaga: 0,
    doacao: 0,
    aviso: 0
  })

  useEffect(() => {
    loadPublications()
    
    // Aplicar filtros da URL
    const category = searchParams.get('categoria')
    const search = searchParams.get('busca')
    
    if (category) setSelectedCategory(category)
    if (search) setSearchQuery(search)
  }, [searchParams])

  useEffect(() => {
    applyFilters()
  }, [publications, selectedCategory, searchQuery, sortBy, selectedBairro])

  const loadPublications = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('publications')
        .select(`
          *,
          profiles:user_id (
            id,
            name,
            avatar_url,
            bairro,
            nivel
          )
        `)
        .eq('status', 'ativo')
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw error

      setPublications(data || [])
      
      // Calcular estatísticas
      const newStats = {
        total: data?.length || 0,
        ajuda: data?.filter(p => p.category === 'ajuda').length || 0,
        servico: data?.filter(p => p.category === 'servico').length || 0,
        vaga: data?.filter(p => p.category === 'vaga').length || 0,
        doacao: data?.filter(p => p.category === 'doacao').length || 0,
        aviso: data?.filter(p => p.category === 'aviso').length || 0
      }
      setStats(newStats)
      
    } catch (error) {
      console.error('Erro ao carregar publicações:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...publications]

    // Filtro por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    // Filtro por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      )
    }

    // Filtro por bairro
    if (selectedBairro) {
      filtered = filtered.filter(p => 
        p.profiles?.bairro?.toLowerCase() === selectedBairro.toLowerCase()
      )
    }

    // Ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'popular':
          return (b.comments_count + b.reactions_count) - (a.comments_count + a.reactions_count)
        case 'reactions':
          return b.reactions_count - a.reactions_count
        default:
          return 0
      }
    })

    setFilteredPublications(filtered)
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    
    // Atualizar URL
    const params = new URLSearchParams()
    if (categoryId !== 'all') params.set('categoria', categoryId)
    if (searchQuery) params.set('busca', searchQuery)
    
    router.push(`/explorar${params.toString() ? '?' + params.toString() : ''}`)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    
    // Atualizar URL
    const params = new URLSearchParams()
    if (selectedCategory !== 'all') params.set('categoria', selectedCategory)
    if (query) params.set('busca', query)
    
    router.push(`/explorar${params.toString() ? '?' + params.toString() : ''}`)
  }

  const clearFilters = () => {
    setSelectedCategory('all')
    setSearchQuery('')
    setSelectedBairro('')
    setSortBy('recent')
    router.push('/explorar')
  }

  const uniqueBairros = Array.from(
    new Set(publications.map(p => p.profiles?.bairro).filter(Boolean))
  ).sort()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Explorar Publicações
            </h1>
            <p className="text-primary-100 text-lg max-w-2xl mx-auto">
              Descubra o que está acontecendo na sua comunidade
            </p>
          </div>

          {/* Busca */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar publicações..."
                className="w-full pl-12 pr-12 py-4 rounded-xl bg-white text-gray-900 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`p-4 rounded-xl transition-all ${
                selectedCategory === cat.id
                  ? cat.color + ' ring-2 ring-offset-2 ring-current shadow-lg scale-105'
                  : 'bg-white hover:bg-gray-50 text-gray-600'
              }`}
            >
              <div className="text-2xl mb-1">{cat.icon}</div>
              <div className="text-xs font-semibold mb-1">{cat.name}</div>
              <div className="text-lg font-bold">
                {cat.id === 'all' ? stats.total : stats[cat.id as keyof typeof stats]}
              </div>
            </button>
          ))}
        </div>

        {/* Filtros Avançados */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 flex-1">
              {/* Ordenação */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white cursor-pointer"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>

              {/* Botão Filtros */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  showFilters
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <SlidersHorizontal size={18} />
                Filtros
              </button>

              {/* Tags de filtros ativos */}
              {(selectedCategory !== 'all' || selectedBairro || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-primary-600 underline"
                >
                  Limpar filtros
                </button>
              )}
            </div>

            <div className="text-sm text-gray-600">
              <span className="font-semibold">{filteredPublications.length}</span> resultado(s)
            </div>
          </div>

          {/* Painel de Filtros Expandido */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Filtro por Bairro */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={16} className="inline mr-1" />
                    Bairro
                  </label>
                  <select
                    value={selectedBairro}
                    onChange={(e) => setSelectedBairro(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Todos os bairros</option>
                    {uniqueBairros.map((bairro) => (
                      <option key={bairro} value={bairro}>
                        {bairro}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lista de Publicações */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando publicações...</p>
            </div>
          </div>
        ) : filteredPublications.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Nenhuma publicação encontrada
            </h3>
            <p className="text-gray-600 mb-6">
              Tente ajustar os filtros ou realizar outra busca
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPublications.map((publication) => (
              <PublicationCard key={publication.id} publication={publication} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ExplorarPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    }>
      <ExplorarContent />
    </Suspense>
  )
}
