// app/[citySlug]/admin/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  BarChart3,
  Users,
  MessageCircle,
  TrendingUp,
  Settings,
  Palette,
  Shield,
  Calendar,
  Download,
  Eye,
  Heart,
  AlertCircle
} from 'lucide-react'
import { Line, Bar } from 'recharts'
import { getCityBySlug, getCityStats, getCityAnalytics, checkCityAdmin } from '@/lib/city-helpers'
import { createSupabaseClient } from '@/lib/supabase'
import type { City, CityStats, CityAnalytics } from '@/lib/types-city'

export default function CityAdminDashboard() {
  const params = useParams()
  const router = useRouter()
  const [city, setCity] = useState<City | null>(null)
  const [stats, setStats] = useState<CityStats | null>(null)
  const [analytics, setAnalytics] = useState<CityAnalytics[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<7 | 30 | 90>(30)
  const supabase = createSupabaseClient()

  useEffect(() => {
    checkAccess()
  }, [])

  const checkAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      router.push(`/${params.citySlug}/login`)
      return
    }

    const cityData = await getCityBySlug(params.citySlug as string)
    
    if (!cityData) {
      router.push('/404')
      return
    }

    const admin = await checkCityAdmin(cityData.id, session.user.id)
    
    if (!admin) {
      router.push(`/${params.citySlug}`)
      return
    }

    setIsAdmin(true)
    setCity(cityData)
    loadData(cityData.id)
  }

  const loadData = async (cityId: string) => {
    setLoading(true)
    
    const [statsData, analyticsData] = await Promise.all([
      getCityStats(cityId),
      getCityAnalytics(cityId, period)
    ])

    setStats(statsData)
    setAnalytics(analyticsData)
    setLoading(false)
  }

  const exportData = () => {
    // Implementar exportação
    alert('Exportando dados...')
  }

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard - {city?.name}
              </h1>
              <p className="text-gray-600 mt-1">
                Painel administrativo da plataforma
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={exportData}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
              >
                <Download size={18} />
                Exportar
              </button>
              
              <a
                href={`/${city?.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
              >
                <Eye size={18} />
                Ver Site
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtro de Período */}
        <div className="mb-8 flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700">Período:</span>
          <div className="inline-flex rounded-lg bg-gray-100 p-1">
            {[
              { value: 7, label: '7 dias' },
              { value: 30, label: '30 dias' },
              { value: 90, label: '90 dias' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setPeriod(option.value as 7 | 30 | 90)
                  if (city) loadData(city.id)
                }}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                  period === option.value
                    ? 'bg-white text-primary-600 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                +12%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold mb-1">Total de Usuários</h3>
            <p className="text-3xl font-bold text-gray-900">{stats?.total_users.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">
              {stats?.active_users_today} ativos hoje
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="text-green-600" size={24} />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                +8%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold mb-1">Publicações</h3>
            <p className="text-3xl font-bold text-gray-900">{stats?.total_publications.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">
              {stats?.publications_this_month} este mês
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                +15%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold mb-1">Comentários</h3>
            <p className="text-3xl font-bold text-gray-900">{stats?.total_comments.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">
              Engajamento alto
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Heart className="text-red-600" size={24} />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                +20%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold mb-1">Reações</h3>
            <p className="text-3xl font-bold text-gray-900">{stats?.total_reactions.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">
              Comunidade ativa
            </p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Usuários */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Crescimento de Usuários
            </h3>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <BarChart3 size={48} className="opacity-20" />
              <p className="ml-3">Gráfico de crescimento (integre recharts)</p>
            </div>
          </div>

          {/* Gráfico de Engajamento */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Engajamento Diário
            </h3>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <TrendingUp size={48} className="opacity-20" />
              <p className="ml-3">Gráfico de engajamento (integre recharts)</p>
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Ações Rápidas</h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <a
              href={`/${city?.slug}/admin/configuracoes`}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Settings className="text-blue-600" size={24} />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Configurações</div>
                <div className="text-sm text-gray-600">Gerenciar cidade</div>
              </div>
            </a>

            <a
              href={`/${city?.slug}/admin/aparencia`}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Palette className="text-purple-600" size={24} />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Aparência</div>
                <div className="text-sm text-gray-600">Personalizar visual</div>
              </div>
            </a>

            <a
              href={`/${city?.slug}/admin/moderacao`}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Shield className="text-red-600" size={24} />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Moderação</div>
                <div className="text-sm text-gray-600">Conteúdo e usuários</div>
              </div>
            </a>
          </div>
        </div>

        {/* Status da Assinatura */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={20} />
                <h3 className="text-lg font-bold">Status da Assinatura</h3>
              </div>
              <p className="text-primary-100 mb-4">
                Plano {city?.subscription_status === 'trial' ? 'Trial' : city?.is_premium ? 'Premium' : 'Básico'}
                {city?.subscription_status === 'trial' && ' - 15 dias restantes'}
              </p>
              {city?.subscription_status === 'trial' && (
                <button className="px-6 py-2 bg-white text-primary-700 rounded-lg hover:bg-primary-50 transition font-semibold">
                  Fazer Upgrade
                </button>
              )}
            </div>
            <Calendar className="opacity-20" size={64} />
          </div>
        </div>
      </div>
    </div>
  )
}