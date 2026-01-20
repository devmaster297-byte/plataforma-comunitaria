'use client'
import { Metadata } from 'next'
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
import CreatePostModal from '@/components/CreatePostModal'
import type { City } from '@/lib/types-city'
import type { Publication } from '@/lib/types'

export default function CityPage() {
  const params = useParams()
  const [city, setCity] = useState<City | null>(null)
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  
  const [stats, setStats] = useState({ users: 0, publications: 0, growth: 0 })
  const supabase = createSupabaseClient()

  // Definição das categorias para uso no mapeamento e no find
  const categories = [
    { id: 'ajuda', name: 'Ajuda', icon: Heart, color: 'from-red-500 to-red-600' },
    { id: 'servico', name: 'Serviços', icon: Briefcase, color: 'from-blue-500 to-blue-600' },
    { id: 'vaga', name: 'Vagas', icon: TrendingUp, color: 'from-green-500 to-green-600' },
    { id: 'doacao', name: 'Doações', icon: Gift, color: 'from-purple-500 to-purple-600' },
    { id: 'aviso', name: 'Avisos', icon: Bell, color: 'from-yellow-500 to-yellow-600' },
  ]

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    checkUser()
    if (params.citySlug) loadCityData()
  }, [params.citySlug])

  useEffect(() => {
    if (city) loadPublications()
  }, [city, category])

  const loadCityData = async () => {
    try {
      const citySlug = params.citySlug as string
      let cityData = await getCityBySlug(citySlug)
      
      if (!cityData) {
        await createCityIfNotExists({ slug: citySlug })
        cityData = await getCityBySlug(citySlug)
      }

      if (cityData) {
        setCity(cityData)
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

  const handlePublishClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!userId) {
      alert("Você precisa estar logado para publicar!")
      return
    }
    setIsModalOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!city) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner da Cidade */}
      <div 
        className="relative h-64 bg-primary-700"
        style={{
          backgroundImage: city.banner_url ? `url(${city.banner_url})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{city.name}</h1>
            <div className="flex items-center gap-3 text-primary-100">
              <MapPin size={16} /> {city.state}
            </div>
            <CityBadge city={city} />
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {stats.users > 5 ? (
    <div className="text-center">
      <div className="text-3xl font-bold text-gray-900">{stats.users}</div>
      <div className="text-sm text-gray-600">Cidadãos Ativos</div>
    </div>
  ) : (
    <div className="text-center">
      <div className="text-lg font-semibold text-primary-600">Comunidade em Crescimento</div>
      <div className="text-xs text-gray-500">Faça parte dos primeiros membros!</div>
    </div>
  )}
      </div>

      {/* Seção Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grade de Categorias */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id === category ? '' : cat.id)}
                className={`p-4 bg-white rounded-xl shadow-md transition-all ${
                  category === cat.id ? 'ring-2 ring-primary-500 scale-105' : ''
                }`}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${cat.color} rounded-lg flex items-center justify-center mx-auto mb-3 text-white`}>
                  <Icon size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm text-center">{cat.name}</h3>
              </button>
            )
          })}
        </div>

        {/* Cabeçalho do Feed */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {category ? categories.find(c => c.id === category)?.name : 'Todas as publicações'}
          </h2>
          <button
            onClick={handlePublishClick}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
          >
            <Plus size={20} /> Publicar
          </button>
        </div>

        {/* Feed de Publicações */}
        {publications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <p className="text-gray-500 text-lg mb-6">Seja o primeiro a publicar em {city.name}!</p>
            <button
              onClick={handlePublishClick}
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
            >
              Criar primeira publicação <ArrowRight size={20} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publications.map((pub) => (
              <PublicationCard key={pub.id} publication={pub} />
            ))}
          </div>
        )}
      </div>

      {/* Modal e Rodapé */}
      {isModalOpen && city && userId && (
        <CreatePostModal 
          cityId={city.id}
          userId={userId}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            loadPublications()
            setIsModalOpen(false)
          }}
        />
      )}
      
      {city.subscription_status !== 'active' && <FreeVersionWatermark />}
    </div>
  )
}

export async function generateMetadata({ params }: { params: { citySlug: string } }): Promise<Metadata> {
  const city = params.citySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `Comunidade Local de ${city} | Avisos, Vagas e Serviços`,
    description: `Participe da rede social de ${city}. Encontre oportunidades de trabalho, peça ajuda aos vizinhos e fique por dentro dos avisos oficiais da prefeitura.`,
    openGraph: {
      title: `Comunidade Local de ${city}`,
      description: `Tudo o que acontece em ${city} em um só lugar.`,
      url: `https://suaplataforma.com.br/${params.citySlug}`,
      siteName: 'Comunidade Local',
      images: [
        {
          url: '/og-image-default.png', // Uma imagem padrão atraente para redes sociais
          width: 1200,
          height: 630,
        },
      ],
      locale: 'pt_BR',
      type: 'website',
    },
  }
}