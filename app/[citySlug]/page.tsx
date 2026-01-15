// app/[citySlug]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  MapPin, 
  Users, 
  TrendingUp, 
  Plus,
  Heart,
  Briefcase,
  Gift,
  Bell,
  ArrowRight
} from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'
import { getCityBySlug, getCityPublications, createCityIfNotExists } from '@/lib/city-helpers'
import PublicationCard from '@/components/PublicationCard'
import CityBadge, { FreeVersionWatermark } from '@/components/CityBadge'
import type { City } from '@/lib/types-city'
import type { Publication } from '@/lib/types'

export default function CityPage() {
  const params = useParams()
  const router = useRouter()
  const [city, setCity] = useState<City | null>(null)
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')
  const [stats, setStats] = useState({
    users: 0,
    publications: 0,
    growth: 0
  })
  const supabase = createSupabaseClient()

  useEffect(() => {
    if (params.citySlug) {
      loadCityData()
    }
  }, [params.citySlug])

  useEffect(() => {
    if (city) {
      loadPublications()
    }
  }, [city, category])

  const loadCityData = async () => {
    try {
      const citySlug = params.citySlug as string
      
      // Tentar carregar cidade existente
      let cityData = await getCityBySlug(citySlug)
      
      // Se não existir, criar automaticamente
     // Se não existir, criar automaticamente
if (!cityData) {
  // Remova o cityName e o 'ES' da chamada, pois a função não os aceita
  await createCityIfNotExists({ slug: citySlug })
  cityData = await getCityBySlug(citySlug)
}
      if (cityData) {
        setCity(cityData)
        
        // Carregar estatísticas
        if (cityData.stats) {
          setStats({
            users: cityData.stats.total_users || 0,
            publications: cityData.stats.total_publications || 0,
            growth: cityData.stats.monthly_active_users || 0
          })
        }
      }
    } catch (error) {
      console.error('Erro ao carregar cidade:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadPublications = async () => {
    if (!city) return

    try {
      const pubs = await getCityPublications(city.id, { category, limit: 9 })
      setPublications(pubs)
    } catch (error) {
      console.error('Erro ao carregar publicações:', error)
    }
  }

  const formatCityName = (slug: string): string => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const isPremium = city?.subscription_status === 'active' || city?.subscription_status === 'trial'

  const categories = [
    { id: 'ajuda', name: 'Ajuda', icon: Heart, color: 'from-red-500 to-red-600' },
    { id: 'servico', name: 'Serviços', icon: Briefcase, color: 'from-blue-500 to-blue-600' },
    { id: 'vaga', name: 'Vagas', icon: TrendingUp, color: 'from-green-500 to-green-600' },
    { id: 'doacao', name: 'Doações', icon: Gift, color: 'from-purple-500 to-purple-600' },
    { id: 'aviso', name: 'Avisos', icon: Bell, color: 'from-yellow-500 to-yellow-600' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!city) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Cidade não encontrada
          </h1>
          <Link href="/" className="text-primary-600 hover:underline">
            Voltar para o início
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner da Cidade */}
      <div 
        className="relative h-64 bg-gradient-to-br from-primary-600 to-primary-800"
        style={{
          backgroundImage: city.banner_url ? `url(${city.banner_url})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-8">
          <div>
            <div className="flex items-center gap-4 mb-3">
              {city.logo_url && (
                <img 
                  src={city.logo_url} 
                  alt={city.name}
                  className="w-16 h-16 bg-white rounded-lg p-2"
                />
              )}
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {city.name}
                </h1>
                <div className="flex items-center gap-3">
                  <span className="text-primary-100 flex items-center gap-1">
                    <MapPin size={16} />
                    {city.state}
                  </span>
                  {city.population && (
                    <span className="text-primary-100">
                      {city.population.toLocaleString('pt-BR')} habitantes
                    </span>
                  )}
                </div>
              </div>
            </div>
            <CityBadge city={city} />
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.users}
              </div>
              <div className="text-sm text-gray-600">Cidadãos Ativos</div>
            </div>
            <div className="text-center border-l border-r border-gray-200">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.publications}
              </div>
              <div className="text-sm text-gray-600">Publicações</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                +{stats.growth}%
              </div>
              <div className="text-sm text-gray-600">Crescimento Mensal</div>
            </div>
          </div>
        </div>
      </div>

      {/* Categorias */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Explore por categoria
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id === category ? '' : cat.id)}
                className={`p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all ${
                  category === cat.id ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${cat.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                  <Icon className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  {cat.name}
                </h3>
              </button>
            )
          })}
        </div>

        {/* Publicações */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {category ? `${categories.find(c => c.id === category)?.name}` : 'Todas as publicações'}
          </h2>
          <Link
            href={`/${params.citySlug}/publicar`}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
          >
            <Plus size={20} />
            Publicar
          </Link>
        </div>

        {publications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <p className="text-gray-500 text-lg mb-6">
              Seja o primeiro a publicar em {city.name}!
            </p>
            <Link
              href={`/${params.citySlug}/publicar`}
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
            >
              Criar primeira publicação
              <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publications.map((pub) => (
              <PublicationCard key={pub.id} publication={pub} />
            ))}
          </div>
        )}
      </div>

      {/* Watermark apenas para versão gratuita */}
      {!isPremium && <FreeVersionWatermark />}
    </div>
  )
}