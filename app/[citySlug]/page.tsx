// app/[citySlug]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  MapPin, 
  Users, 
  TrendingUp, 
  Search,
  Heart,
  Briefcase,
  Gift,
  Bell,
  PlusCircle,
  ArrowRight,
  Building2,
  Phone,
  Mail,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Youtube
} from 'lucide-react'
import { getCityBySlug, getCitySettings, getCityPublications, checkCitySubscription } from '@/lib/city-helpers'
import { createSupabaseClient } from '@/lib/supabase'
import PublicationCard from '@/components/PublicationCard'
import type { City, CitySettings } from '@/lib/types-city'
import type { Publication } from '@/lib/types'

export default function CityPage() {
  const params = useParams()
  const router = useRouter()
  const [city, setCity] = useState<City | null>(null)
  const [settings, setSettings] = useState<CitySettings | null>(null)
  const [publications, setPublications] = useState<Publication[]>([])
  const [user, setUser] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [subscriptionValid, setSubscriptionValid] = useState(true)
  const supabase = createSupabaseClient()

  useEffect(() => {
    if (params.citySlug) {
      loadCityData()
      checkUser()
    }
  }, [params.citySlug, selectedCategory])

  const loadCityData = async () => {
    setLoading(true)
    
    const cityData = await getCityBySlug(params.citySlug as string)
    
    if (!cityData) {
      router.push('/404')
      return
    }

    // Verificar assinatura
    const subscription = await checkCitySubscription(cityData.id)
    setSubscriptionValid(subscription.isValid)

    setCity(cityData)
    
    const settingsData = await getCitySettings(cityData.id)
    setSettings(settingsData)

    const pubs = await getCityPublications(cityData.id, {
      category: selectedCategory,
      limit: 9
    })
    setPublications(pubs)
    
    setLoading(false)

    // Aplicar cores personalizadas
    if (cityData.primary_color) {
      document.documentElement.style.setProperty('--city-primary', cityData.primary_color)
    }
  }

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user || null)
  }

  const categories = [
    { id: 'ajuda', name: 'Pedidos de Ajuda', icon: Heart, color: 'from-red-500 to-red-600' },
    { id: 'servico', name: 'Serviços', icon: Briefcase, color: 'from-blue-500 to-blue-600' },
    { id: 'vaga', name: 'Vagas', icon: TrendingUp, color: 'from-green-500 to-green-600' },
    { id: 'doacao', name: 'Doações', icon: Gift, color: 'from-purple-500 to-purple-600' },
    { id: 'aviso', name: 'Avisos', icon: Bell, color: 'from-yellow-500 to-yellow-600' }
  ]

  const socialIcons = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    youtube: Youtube
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!city || !subscriptionValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <Building2 size={64} className="mx-auto mb-4 text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {!subscriptionValid ? 'Assinatura Expirada' : 'Cidade não encontrada'}
          </h1>
          <p className="text-gray-600 mb-6">
            {!subscriptionValid 
              ? 'A assinatura desta cidade expirou. Entre em contato com a prefeitura.'
              : 'A cidade que você procura não está disponível no momento.'}
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Voltar para Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner da Cidade */}
      <div 
        className="relative bg-gradient-to-br text-white overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${city.primary_color} 0%, ${city.secondary_color} 100%)`
        }}
      >
        {city.banner_url && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${city.banner_url})` }}
          />
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Logo da Cidade */}
            {city.logo_url ? (
              <img
                src={city.logo_url}
                alt={`Logo ${city.name}`}
                className="w-32 h-32 object-contain bg-white/10 backdrop-blur-sm rounded-2xl p-4"
              />
            ) : (
              <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Building2 size={64} />
              </div>
            )}

            {/* Informações da Cidade */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-4">
                <MapPin size={16} />
                <span className="text-sm font-semibold">{city.state}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {city.name}
              </h1>

              {settings?.welcome_message && (
                <p className="text-xl text-white/90 mb-6 max-w-2xl">
                  {settings.welcome_message}
                </p>
              )}

              {/* Estatísticas */}
              <div className="grid grid-cols-3 gap-4 max-w-lg">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Users className="w-6 h-6 mb-2 mx-auto md:mx-0" />
                  <div className="text-2xl font-bold">{city.users_count}</div>
                  <div className="text-sm text-white/80">Cidadãos</div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <TrendingUp className="w-6 h-6 mb-2 mx-auto md:mx-0" />
                  <div className="text-2xl font-bold">{city.publications_count}</div>
                  <div className="text-sm text-white/80">Publicações</div>
                </div>

                {city.population && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <MapPin className="w-6 h-6 mb-2 mx-auto md:mx-0" />
                    <div className="text-2xl font-bold">{(city.population / 1000).toFixed(0)}k</div>
                    <div className="text-sm text-white/80">Habitantes</div>
                  </div>
                )}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                {user ? (
                  <Link
                    href={`/${city.slug}/publicar`}
                    className="px-6 py-3 bg-white text-primary-700 rounded-lg hover:bg-gray-100 transition font-bold flex items-center justify-center gap-2"
                    style={{ color: city.primary_color }}
                  >
                    <PlusCircle size={20} />
                    Criar Publicação
                  </Link>
                ) : (
                  <>
                    <Link
                      href={`/${city.slug}/cadastro`}
                      className="px-6 py-3 bg-white text-primary-700 rounded-lg hover:bg-gray-100 transition font-bold flex items-center justify-center gap-2"
                      style={{ color: city.primary_color }}
                    >
                      Cadastrar-se
                      <ArrowRight size={20} />
                    </Link>
                    <Link
                      href={`/${city.slug}/login`}
                      className="px-6 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-lg hover:bg-white/20 transition font-bold"
                    >
                      Já tenho conta
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sobre a Cidade */}
      {settings?.about_text && (
        <div className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Sobre {city.name}
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {settings.about_text}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Informações de Contato da Prefeitura */}
      {(city.city_hall_address || city.city_hall_phone || city.city_hall_email || city.website_url) && (
        <div className="bg-gray-100 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Prefeitura Municipal
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
              {city.city_hall_address && (
                <div className="flex items-start gap-3 bg-white p-4 rounded-lg">
                  <MapPin className="text-gray-400 flex-shrink-0" size={20} />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Endereço</div>
                    <div className="text-sm text-gray-600">{city.city_hall_address}</div>
                  </div>
                </div>
              )}

              {city.city_hall_phone && (
                <div className="flex items-start gap-3 bg-white p-4 rounded-lg">
                  <Phone className="text-gray-400 flex-shrink-0" size={20} />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Telefone</div>
                    <a href={`tel:${city.city_hall_phone}`} className="text-sm text-primary-600 hover:underline">
                      {city.city_hall_phone}
                    </a>
                  </div>
                </div>
              )}

              {city.city_hall_email && (
                <div className="flex items-start gap-3 bg-white p-4 rounded-lg">
                  <Mail className="text-gray-400 flex-shrink-0" size={20} />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Email</div>
                    <a href={`mailto:${city.city_hall_email}`} className="text-sm text-primary-600 hover:underline">
                      {city.city_hall_email}
                    </a>
                  </div>
                </div>
              )}

              {city.website_url && (
                <div className="flex items-start gap-3 bg-white p-4 rounded-lg">
                  <Globe className="text-gray-400 flex-shrink-0" size={20} />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Website</div>
                    <a href={city.website_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline">
                      Acessar site
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Redes Sociais */}
            {settings?.social_media && Object.values(settings.social_media).some(v => v) && (
              <div className="mt-4 flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-700">Redes Sociais:</span>
                <div className="flex gap-2">
                  {Object.entries(settings.social_media).map(([platform, url]) => {
                    if (!url) return null
                    const Icon = socialIcons[platform as keyof typeof socialIcons]
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition"
                      >
                        <Icon size={20} />
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Categorias */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Explore por Categoria
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? '' : cat.id)}
                  className={`p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 ${
                    selectedCategory === cat.id ? 'ring-4 shadow-xl' : ''
                  }`}
                  style={selectedCategory === cat.id ? { ringColor: city.primary_color } : {}}
                >
                  <div 
                    className={`w-14 h-14 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}
                  >
                    <Icon className="text-white" size={28} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-center text-sm">{cat.name}</h3>
                </button>
              )
            })}
          </div>

          {selectedCategory && (
            <div className="text-center mt-6">
              <button
                onClick={() => setSelectedCategory('')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                ← Mostrar todas as categorias
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Publicações */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory 
                ? categories.find(c => c.id === selectedCategory)?.name
                : 'Últimas Publicações'}
            </h2>

            <Link
              href={`/${city.slug}/explorar`}
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
            >
              Ver todas
              <ArrowRight size={18} />
            </Link>
          </div>

          {publications.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-md">
              <p className="text-gray-500 text-lg mb-6">
                Ainda não há publicações nesta categoria
              </p>
              {user && (
                <Link
                  href={`/${city.slug}/publicar`}
                  className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
                  style={{ backgroundColor: city.primary_color }}
                >
                  Seja o primeiro a publicar
                </Link>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publications.map((pub) => (
                <PublicationCard key={pub.id} publication={pub} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Final */}
      {!user && (
        <div 
          className="py-16 text-white"
          style={{
            background: `linear-gradient(135deg, ${city.primary_color} 0%, ${city.secondary_color} 100%)`
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Faça parte da comunidade de {city.name}
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Cadastre-se gratuitamente e comece a interagir com seus vizinhos
            </p>
            <Link
              href={`/${city.slug}/cadastro`}
              className="inline-block px-8 py-4 bg-white rounded-lg hover:bg-gray-100 transition font-bold text-lg"
              style={{ color: city.primary_color }}
            >
              Criar conta grátis
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}