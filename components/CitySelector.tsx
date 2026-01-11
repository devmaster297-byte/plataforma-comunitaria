// components/CitySelector.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Search, X, Building2, Users, TrendingUp } from 'lucide-react'
import { getAllCities, searchCities } from '@/lib/city-helpers'
import type { City } from '@/lib/types-city'

interface CitySelectorProps {
  onSelect?: (city: City) => void
  showInHeader?: boolean
}

export default function CitySelector({ onSelect, showInHeader = false }: CitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [cities, setCities] = useState<City[]>([])
  const [filteredCities, setFilteredCities] = useState<City[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadCities()
    loadSelectedCity()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      handleSearch()
    } else {
      setFilteredCities(cities)
    }
  }, [searchQuery, cities])

  const loadCities = async () => {
    const data = await getAllCities()
    setCities(data)
    setFilteredCities(data)
  }

  const loadSelectedCity = () => {
    const saved = localStorage.getItem('selected_city')
    if (saved) {
      setSelectedCity(JSON.parse(saved))
    }
  }

  const handleSearch = async () => {
    setLoading(true)
    const results = await searchCities(searchQuery)
    setFilteredCities(results)
    setLoading(false)
  }

  const handleSelectCity = (city: City) => {
    setSelectedCity(city)
    localStorage.setItem('selected_city', JSON.stringify(city))
    setIsOpen(false)
    
    if (onSelect) {
      onSelect(city)
    } else {
      router.push(`/${city.slug}`)
    }
  }

  const groupByState = (cities: City[]) => {
    return cities.reduce((acc, city) => {
      if (!acc[city.state]) {
        acc[city.state] = []
      }
      acc[city.state].push(city)
      return acc
    }, {} as Record<string, City[]>)
  }

  const groupedCities = groupByState(filteredCities)

  if (showInHeader) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-500 transition"
        >
          <MapPin size={18} className="text-primary-600" />
          <span className="text-sm font-semibold text-gray-900">
            {selectedCity?.name || 'Selecione sua cidade'}
          </span>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900">Selecione sua cidade</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Busca */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar cidade..."
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Lista de cidades */}
              <div className="overflow-y-auto flex-1">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : Object.keys(groupedCities).length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin size={48} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500">Nenhuma cidade encontrada</p>
                  </div>
                ) : (
                  Object.entries(groupedCities).map(([state, stateCities]) => (
                    <div key={state} className="border-b border-gray-100">
                      <div className="px-4 py-2 bg-gray-50">
                        <p className="text-xs font-semibold text-gray-500 uppercase">
                          {state}
                        </p>
                      </div>
                      {stateCities.map((city) => (
                        <button
                          key={city.id}
                          onClick={() => handleSelectCity(city)}
                          className="w-full px-4 py-3 hover:bg-gray-50 transition flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition">
                              <Building2 className="text-primary-600" size={20} />
                            </div>
                            <div className="text-left">
                              <div className="font-semibold text-gray-900">
                                {city.name}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                  <Users size={12} />
                                  {city.users_count}
                                </span>
                                <span className="flex items-center gap-1">
                                  <TrendingUp size={12} />
                                  {city.publications_count}
                                </span>
                              </div>
                            </div>
                          </div>
                          {selectedCity?.id === city.id && (
                            <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  // Versão Full Page
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="text-primary-600" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Selecione sua cidade
          </h1>
          <p className="text-xl text-gray-600">
            Escolha sua cidade para acessar a plataforma comunitária
          </p>
        </div>

        {/* Busca */}
        <div className="mb-8">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por cidade ou estado..."
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Grid de cidades */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedCities).map(([state, stateCities]) => (
              <div key={state}>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-primary-600" />
                  {state}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stateCities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleSelectCity(city)}
                      className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 text-left group"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition">
                          <Building2 className="text-primary-600" size={28} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg">
                            {city.name}
                          </h3>
                          <p className="text-sm text-gray-600">{city.state}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users size={16} />
                          <span>{city.users_count} usuários</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp size={16} />
                          <span>{city.publications_count}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredCities.length === 0 && !loading && (
          <div className="text-center py-16">
            <MapPin size={64} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">
              Nenhuma cidade encontrada
            </p>
          </div>
        )}
      </div>
    </div>
  )
}