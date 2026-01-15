// app/[citySlug]/explorar/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Search, 
  Filter,
  ArrowLeft,
  X,
  SlidersHorizontal,
  MapPin,
  TrendingUp,
  Clock,
  Heart
} from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'
import { getCityBySlug, getCityPublications } from '@/lib/city-helpers'
import type { City } from '@/lib/types-city'
import type { Publication } from '@/lib/types'
import PublicationCard from '@/components/PublicationCard'

const CATEGORIES = [
  { id: 'all', name: 'Todas', icon: '📋' },
  { id: 'ajuda', name: 'Ajuda', icon: '🆘' },
  { id: 'servico', name: 'Serviços', icon: '💼' },
  { id: 'vaga', name: 'Vagas', icon: '📈' },
  { id: 'doacao', name: 'Doações', icon: '🎁' },
  { id: 'aviso', name: 'Avisos', icon: '📢' }
]

const SORT_OPTIONS = [
  { value: 'recent', label: 'Mais Recentes', icon: Clock },
  { value: 'popular', label: 'Mais Populares', icon: TrendingUp },
  { value: 'reactions', label: 'Mais Curtidas', icon: Heart }
]

export default function CityExplorePage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createSupabaseClient()

  const [city, setCity] = useState<City | null>(null)
  const [publications, setPublications] = useState<Publication[]>([])
  const [filteredPublications, setFilteredPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedBairro, setSelectedBairro] = useState('')

  useEffect(() => {
    if (params.citySlug) {
      loadCityData()
    }
  }, [params.citySlug])

  useEffect(() => {
    applyFilters()
  }, [publications, selectedCategory, searchQuery, sortBy, selectedBairro])

  const loadCityData = async () => {
    try {
      setLoading(true)
      const citySlug = params.citySlug as string

      const cityData = await getCityBySlug(citySlug)
      if (!cityData) {
        router.push('/404')
        return
      }

      setCity(cityData)

      const pubs = await getCityPublications(cityData.id)
      setPublications(pubs)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
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

  const clearFilters = () => {
    setSelectedCategory('all')
    setSearchQuery('')
    setSelectedBairro('')
    setSortBy('recent')
  }

  const uniqueBairros = Array.from(
    new Set(publications.map(p => p.profiles?.bairro).filter(Boolean))
  ).sort()

  const categoryStats = CATEGORIES.map(cat => ({
    ...cat,
    count: cat.id === 'all' 
      ? publications.length 
      : publications.filter(p => p.category === cat.id).length
  }))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando publicações...</p>
        </div>
      </div>
    )
  }

  if (!city) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Cidade não encontrada
          </h2>
          <Link href="/" className="text-primary-600 hover:underline">
            Voltar para o início
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com cores da cidade */}
      <div 
        className="text-white py-12"
        style={{
          background: `linear-gradient(135deg, ${city.primary_color || '#3b82f6'} 0%, ${city.secondary_color || '#2563eb'} 100%)`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/${city.slug}`}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition"
          >
            <ArrowLeft size={20} />
            Voltar para {city.name}
          </Link>

          <h1 className="text-4xl font-bold mb-4">
            Explorar em {city.name}
          </h1>

          {/* Busca */}
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar publicações..."
                className="w-full pl-12 pr-12 py-4 rounded-xl bg-white text-gray-900 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
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
        {/* Categorias */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          {categoryStats.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-4 rounded-xl transition-all ${
                selectedCategory === cat.id
                  ? 'bg-white ring-2 ring-primary-500 shadow-lg scale-105'
                  : 'bg-white hover:shadow-md'
              }`}
            >
              <div className="text-2xl mb-1">{cat.icon}</div>
              <div className="text-xs font-semibold mb-1">{cat.name}</div>
              <div className="text-lg font-bold text-primary-600">{cat.count}</div>
            </button>
          ))}
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 flex-1">
              {/* Ordenação */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white cursor-pointer"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Botão Filtros Avançados */}
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

              {/* Limpar filtros */}
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

        {/* Publicações */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando publicações...</p>
            </div>
          </div>
        ) : filteredPublications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-lg">
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