// app/page.tsx - Nova versão com seleção de cidades
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Search, 
  MapPin, 
  Users, 
  TrendingUp,
  Building2,
  Heart,
  MessageCircle,
  Award,
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'
import { getAllCities, searchCities } from '@/lib/city-helpers'
import type { City } from '@/lib/types-city'

export default function HomePage() {
  const supabase = createSupabaseClient()
  const [cities, setCities] = useState<City[]>([])
  const [filteredCities, setFilteredCities] = useState<City[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCities()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery)
    } else {
      setFilteredCities(cities)
    }
  }, [searchQuery, cities])

  const loadCities = async () => {
    try {
      const data = await getAllCities()
      setCities(data)
      setFilteredCities(data)
    } catch (error) {
      console.error('Erro ao carregar cidades:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setFilteredCities(cities)
      return
    }

    const results = await searchCities(query)
    setFilteredCities(results)
  }

  const stats = {
    cities: cities.length,
    users: cities.reduce((sum, city) => sum + (city.users_count || 0), 0),
    publications: cities.reduce((sum, city) => sum + (city.publications_count || 0), 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-white/20">
              <Sparkles size={16} />
              Conectando comunidades em todo o Brasil
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Encontre sua Cidade e Conecte-se com Vizinhos
            </h1>
            
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Ajude, seja ajudado e fortaleça os laços da sua comunidade. 
              100% gratuito para cidadãos.
            </p>

            {/* Busca */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Busque sua cidade..."
                  className="w-full pl-14 pr-6 py-5 rounded-xl bg-white text-gray-900 placeholder-gray-400 shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/50 text-lg"
                />
                
              </div>
              
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold mb-1">{stats.cities}+</div>
                <div className="text-sm opacity-90">Cidades</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold mb-1">{stats.users.toLocaleString()}+</div>
                <div className="text-sm opacity-90">Usuários</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold mb-1">{stats.publications.toLocaleString()}+</div>
                <div className="text-sm opacity-90">Publicações</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Lista de Cidades */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {searchQuery ? `Resultados para "${searchQuery}"` : 'Cidades Disponíveis'}
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando cidades...</p>
            </div>
          ) : filteredCities.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCities.map((city) => (
                <Link
                  key={city.id}
                  href={`/${city.slug}`}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border-2 border-transparent hover:border-primary-500"
                >
                  {/* Banner */}
                  {city.banner_url ? (
                    <div 
                      className="h-32 bg-gradient-to-r from-primary-600 to-primary-700"
                      style={{
                        backgroundImage: `url(${city.banner_url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                  ) : (
                    <div 
                      className="h-32"
                      style={{
                        background: `linear-gradient(135deg, ${city.primary_color || '#3b82f6'} 0%, ${city.secondary_color || '#2563eb'} 100%)`
                      }}
                    />
                  )}

                  {/* Conteúdo */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {city.logo_url && (
                          <img 
                            src={city.logo_url} 
                            alt={city.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition">
                            {city.name}
                          </h3>
                          <p className="text-sm text-gray-600">{city.state}</p>
                        </div>
                      </div>

                      {city.is_premium && (
                        <div className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                          <Award size={12} />
                          Premium
                        </div>
                      )}
                    </div>

                    {city.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {city.description}
                      </p>
                    )}

                    {/* Stats da cidade */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users size={16} className="text-primary-600" />
                        <span>{city.users_count || 0} usuários</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MessageCircle size={16} className="text-primary-600" />
                        <span>{city.publications_count || 0} posts</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm font-semibold text-primary-600 group-hover:text-primary-700">
                        Acessar comunidade
                      </span>
                      <ArrowRight className="text-primary-600 group-hover:translate-x-1 transition" size={20} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Nenhuma cidade encontrada
              </h3>
              <p className="text-gray-600 mb-6">
                Tente buscar por outro nome ou estado
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
              >
                Ver todas as cidades
              </button>
            </div>
          )}
        </section>

        {/* Como Funciona */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Como Funciona?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-blue-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  1. Escolha sua Cidade
                </h3>
                <p className="text-gray-600">
                  Busque e acesse a página da sua cidade na plataforma
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-purple-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  2. Cadastre-se Grátis
                </h3>
                <p className="text-gray-600">
                  Crie sua conta em segundos e comece a participar
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="text-green-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  3. Conecte-se
                </h3>
                <p className="text-gray-600">
                  Publique, ajude e fortaleça sua comunidade
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Para Prefeituras */}
     //  <section>
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl shadow-lg p-12 text-white text-center">
            <Building2 className="mx-auto mb-4" size={48} />
            
            <h2 className="text-3xl font-bold mb-4">
              É uma Prefeitura?
            </h2>
            
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Tenha uma página institucional personalizada para sua cidade. 
              Conecte-se diretamente com seus cidadãos!
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-3xl mx-auto">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} />
                <span>60 dias grátis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} />
                <span>Identidade visual personalizada</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} />
                <span>Dashboard com analytics</span>
              </div>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/contato"
                className="px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition font-semibold shadow-lg"
              >
                Solicitar Demonstração
              </Link>
              <Link
                href="/sobre"
                className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition font-semibold border-2 border-white/50"
              >
                Saiba Mais
              </Link>
            </div>
          </div>
     //   </section>
     </div>
   </div>
  )
}