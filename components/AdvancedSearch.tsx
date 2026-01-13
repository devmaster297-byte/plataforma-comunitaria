// components/AdvancedSearch.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, TrendingUp, Clock, Tag, MapPin, SlidersHorizontal } from 'lucide-react'
import { searchPublications, getPopularSearches } from '@/lib/supabase-helpers'
import type { Publication, SearchSuggestion } from '@/lib/types'

interface AdvancedSearchProps {
  onResults?: (results: Publication[]) => void
  autoFocus?: boolean
}

export default function AdvancedSearch({ onResults, autoFocus = false }: AdvancedSearchProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [popularSearches, setPopularSearches] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    cidade: ''
  })
  const [searching, setSearching] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadRecentSearches()
    loadPopularSearches()

    // Fechar sugestões ao clicar fora
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (query.length > 2) {
      generateSuggestions()
    } else {
      setSuggestions([])
    }
  }, [query])

  const loadRecentSearches = () => {
    const recent = localStorage.getItem('recentSearches')
    if (recent) {
      setRecentSearches(JSON.parse(recent))
    }
  }

  const loadPopularSearches = async () => {
    const popular = await getPopularSearches()
    setPopularSearches(popular)
  }

  const saveRecentSearch = (searchQuery: string) => {
    const recent = [...recentSearches]
    const index = recent.indexOf(searchQuery)
    
    if (index > -1) {
      recent.splice(index, 1)
    }
    
    recent.unshift(searchQuery)
    const limited = recent.slice(0, 5)
    
    setRecentSearches(limited)
    localStorage.setItem('recentSearches', JSON.stringify(limited))
  }

  const generateSuggestions = () => {
    const newSuggestions: SearchSuggestion[] = []

    // Sugestões de categorias
    const categories = [
      { id: 'ajuda', name: 'Pedidos de Ajuda' },
      { id: 'servico', name: 'Serviços' },
      { id: 'vaga', name: 'Vagas' },
      { id: 'doacao', name: 'Doações' },
      { id: 'aviso', name: 'Avisos' }
    ]

    categories.forEach(cat => {
      if (cat.name.toLowerCase().includes(query.toLowerCase())) {
        newSuggestions.push({
          id: cat.id,
          text: cat.name,
          type: 'category'
        })
      }
    })

    setSuggestions(newSuggestions)
  }

  const handleSearch = async (searchQuery?: string) => {
    const searchTerm = searchQuery || query
    if (!searchTerm.trim() && !filters.category) return

    setSearching(true)
    setShowSuggestions(false)

    if (searchTerm.trim()) {
      saveRecentSearch(searchTerm)
    }

    const results = await searchPublications(searchTerm, {
      category: filters.category,
      limit: 50
    })

    if (onResults) {
      onResults(results)
    }

    setSearching(false)
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'category') {
      setFilters({ ...filters, category: suggestion.id })
      setQuery('')
      handleSearch('')
    } else {
      setQuery(suggestion.text)
      handleSearch(suggestion.text)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setFilters({ category: '', cidade: '' })
    if (onResults) {
      onResults([])
    }
  }

  const categories = [
    { id: '', name: 'Todas' },
    { id: 'ajuda', name: 'Ajuda' },
    { id: 'servico', name: 'Serviços' },
    { id: 'vaga', name: 'Vagas' },
    { id: 'doacao', name: 'Doações' },
    { id: 'aviso', name: 'Avisos' }
  ]

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Barra de busca principal */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Buscar publicações, serviços, vagas..."
              autoFocus={autoFocus}
              className="w-full pl-12 pr-24 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
            />
            
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              {query && (
                <button
                  onClick={clearSearch}
                  className="p-1 hover:bg-gray-100 rounded-full transition"
                >
                  <X size={18} className="text-gray-400" />
                </button>
              )}
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition ${
                  showFilters || filters.category
                    ? 'bg-primary-100 text-primary-600'
                    : 'hover:bg-gray-100 text-gray-400'
                }`}
              >
                <SlidersHorizontal size={18} />
              </button>
            </div>
          </div>

          <button
            onClick={() => handleSearch()}
            disabled={searching}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold text-lg shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {searching ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        {/* Filtros expandidos */}
        {showFilters && (
          <div className="mt-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Tag size={16} className="inline mr-1" />
                  Categoria
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin size={16} className="inline mr-1" />
                  Cidade
                </label>
                <input
                  type="text"
                  value={filters.cidade}
                  onChange={(e) => setFilters({ ...filters, cidade: e.target.value })}
                  placeholder="Filtrar por cidade"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="mt-3 flex justify-end gap-2">
              <button
                onClick={() => {
                  setFilters({ category: '', cidade: '' })
                  setShowFilters(false)
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
              >
                Limpar filtros
              </button>
              <button
                onClick={() => {
                  handleSearch()
                  setShowFilters(false)
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sugestões */}
      {showSuggestions && (query || recentSearches.length > 0 || popularSearches.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {/* Sugestões baseadas na busca */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                Sugestões
              </p>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-3 py-2 hover:bg-gray-100 rounded-lg flex items-center gap-3 text-left transition"
                >
                  <Tag size={16} className="text-primary-600" />
                  <span className="text-gray-700">{suggestion.text}</span>
                </button>
              ))}
            </div>
          )}

          {/* Buscas recentes */}
          {!query && recentSearches.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                <Clock size={14} />
                Buscas recentes
              </p>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(search)
                    handleSearch(search)
                  }}
                  className="w-full px-3 py-2 hover:bg-gray-100 rounded-lg flex items-center gap-3 text-left transition"
                >
                  <Clock size={16} className="text-gray-400" />
                  <span className="text-gray-700">{search}</span>
                </button>
              ))}
            </div>
          )}

          {/* Buscas populares */}
          {!query && popularSearches.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                <TrendingUp size={14} />
                Categorias populares
              </p>
              {popularSearches.map((search) => (
                <button
                  key={search.id}
                  onClick={() => handleSuggestionClick(search)}
                  className="w-full px-3 py-2 hover:bg-gray-100 rounded-lg flex items-center justify-between text-left transition"
                >
                  <div className="flex items-center gap-3">
                    <TrendingUp size={16} className="text-green-600" />
                    <span className="text-gray-700 capitalize">{search.text}</span>
                  </div>
                  {search.count && (
                    <span className="text-xs text-gray-500">
                      {search.count} publicações
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}