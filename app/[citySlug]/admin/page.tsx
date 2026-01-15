// app/[citySlug]/admin/page.tsx
// IMPORTANTE: Execute primeiro o SQL de criação da tabela city_admins!
'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  BarChart3,
  Users,
  FileText,
  MessageCircle,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Settings,
  Download,
  Calendar,
  Shield,
  Ban,
  UserCheck
} from 'lucide-react'
import type { Publication } from '@/lib/types'
import { createSupabaseClient } from '@/lib/supabase'
import { getCityBySlug, checkCityAdmin, getCityStats, getCityAnalytics } from '@/lib/city-helpers'
import type { City, CityStats } from '@/lib/types-city'
import AdvancedAnalytics from '@/components/AdvancedAnalytics'

export default function CityAdminDashboard() {
  const params = useParams()
  const router = useRouter()
  const supabase = createSupabaseClient()

  const [city, setCity] = useState<City | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'publications' | 'users' | 'analytics' | 'settings'>('overview')

  // Estados dos dados
  const [stats, setStats] = useState<CityStats>({
    total_users: 0,
    active_users_today: 0,
    total_publications: 0,
    publications_this_month: 0,
    total_comments: 0,
    total_reactions: 0,
    growth_rate: 0
  })

  const [publications, setPublications] = useState<Publication[]>([])
  const [pendingPublications, setPendingPublications] = useState<Publication[]>([])
  const [reportedPublications, setReportedPublications] = useState<Publication[]>([])

  useEffect(() => {
    checkAccess()
  }, [params.citySlug])

  const checkAccess = async () => {
    try {
      setLoading(true)
      
      // Verificar autenticação
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      setUser(session.user)

      // Carregar cidade
      const citySlug = params.citySlug as string
      const cityData = await getCityBySlug(citySlug)
      
      if (!cityData) {
        router.push('/404')
        return
      }

      setCity(cityData)

      // Verificar se é admin
      const isUserAdmin = await checkCityAdmin(cityData.id, session.user.id)
      
      if (!isUserAdmin) {
        router.push(`/${citySlug}`)
        return
      }

      setIsAdmin(true)

      // Carregar dados
      await loadDashboardData(cityData.id)
      
    } catch (error) {
      console.error('Erro ao verificar acesso:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const loadDashboardData = async (cityId: string) => {
    try {
      // Carregar estatísticas
      const statsData = await getCityStats(cityId)
      setStats(statsData)

      // Carregar publicações
      const { data: pubs } = await supabase
        .from('publications')
        .select(`
          *,
          profiles:user_id (id, name, avatar_url, bairro)
        `)
        .eq('city_id', cityId)
        .order('created_at', { ascending: false })
        .limit(50)

      setPublications(pubs || [])

      // Carregar publicações pendentes (se houver moderação)
      const pending = (pubs || []).filter(p => p.status === 'pending')
      setPendingPublications(pending)

      // Simular publicações reportadas (implementar tabela de reports depois)
      setReportedPublications([])

    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  const handleApprovePublication = async (pubId: string) => {
    try {
      const { error } = await supabase
        .from('publications')
        .update({ status: 'ativo' })
        .eq('id', pubId)

      if (error) throw error

      alert('Publicação aprovada!')
      if (city) loadDashboardData(city.id)
    } catch (error) {
      console.error('Erro ao aprovar:', error)
      alert('Erro ao aprovar publicação')
    }
  }

  const handleRejectPublication = async (pubId: string) => {
    if (!confirm('Tem certeza que deseja rejeitar esta publicação?')) return

    try {
      const { error } = await supabase
        .from('publications')
        .update({ status: 'inativo' })
        .eq('id', pubId)

      if (error) throw error

      alert('Publicação rejeitada!')
      if (city) loadDashboardData(city.id)
    } catch (error) {
      console.error('Erro ao rejeitar:', error)
      alert('Erro ao rejeitar publicação')
    }
  }

  const handleDeletePublication = async (pubId: string) => {
    if (!confirm('Tem certeza que deseja EXCLUIR permanentemente esta publicação?')) return

    try {
      const { error } = await supabase
        .from('publications')
        .delete()
        .eq('id', pubId)

      if (error) throw error

      alert('Publicação excluída!')
      if (city) loadDashboardData(city.id)
    } catch (error) {
      console.error('Erro ao excluir:', error)
      alert('Erro ao excluir publicação')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    )
  }

  if (!city || !isAdmin) {
    return null
  }

  const categoryColors = {
    ajuda: 'bg-red-100 text-red-700',
    servico: 'bg-blue-100 text-blue-700',
    vaga: 'bg-green-100 text-green-700',
    doacao: 'bg-purple-100 text-purple-700',
    aviso: 'bg-yellow-100 text-yellow-700'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="text-primary-600" size={32} />
                <h1 className="text-3xl font-bold text-gray-900">
                  Dashboard Administrativo
                </h1>
              </div>
              <p className="text-gray-600">
                {city.name}, {city.state}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push(`/${city.slug}`)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Ver Página da Cidade
              </button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center gap-2">
                <Download size={18} />
                Exportar Dados
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === 'overview'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 size={18} className="inline mr-2" />
              Visão Geral
            </button>

            <button
              onClick={() => setActiveTab('publications')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === 'publications'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FileText size={18} className="inline mr-2" />
              Publicações
              {pendingPublications.length > 0 && (
                <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                  {pendingPublications.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === 'users'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users size={18} className="inline mr-2" />
              Usuários
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === 'analytics'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 size={18} className="inline mr-2" />
              Analytics
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === 'settings'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Settings size={18} className="inline mr-2" />
              Configurações
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB: Visão Geral */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Cards de Estatísticas */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <TrendingUp className="text-green-500" size={20} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stats.total_users}
                </div>
                <div className="text-sm text-gray-600">Total de Usuários</div>
                <div className="text-xs text-green-600 mt-2">
                  +{stats.growth_rate}% este mês
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="text-purple-600" size={24} />
                  </div>
                  <Calendar className="text-blue-500" size={20} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stats.total_publications}
                </div>
                <div className="text-sm text-gray-600">Total de Publicações</div>
                <div className="text-xs text-blue-600 mt-2">
                  +{stats.publications_this_month} este mês
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="text-green-600" size={24} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stats.total_comments}
                </div>
                <div className="text-sm text-gray-600">Total de Comentários</div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="text-yellow-600" size={24} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {pendingPublications.length}
                </div>
                <div className="text-sm text-gray-600">Pendentes de Moderação</div>
              </div>
            </div>

            {/* Atividade Recente */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Publicações Recentes
              </h3>

              <div className="space-y-4">
                {publications.slice(0, 10).map((pub) => (
                  <div key={pub.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${categoryColors[pub.category as keyof typeof categoryColors]}`}>
                          {pub.category}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          pub.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {pub.status}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {pub.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Por: {pub.profiles?.name} • {new Date(pub.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/publicacao/${pub.id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Ver"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDeletePublication(pub.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: Publicações */}
        {activeTab === 'publications' && (
          <div className="space-y-6">
            {/* Publicações Pendentes */}
            {pendingPublications.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <AlertTriangle className="text-yellow-600" />
                  Publicações Pendentes de Aprovação ({pendingPublications.length})
                </h3>

                <div className="space-y-4">
                  {pendingPublications.map((pub) => (
                    <div key={pub.id} className="border-2 border-yellow-200 rounded-lg p-6 bg-yellow-50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${categoryColors[pub.category as keyof typeof categoryColors]}`}>
                            {pub.category}
                          </span>
                          <h4 className="font-bold text-gray-900 text-lg mt-2 mb-2">
                            {pub.title}
                          </h4>
                          <p className="text-gray-700 mb-3">
                            {pub.description}
                          </p>
                          <p className="text-sm text-gray-600">
                            Por: {pub.profiles?.name} ({pub.profiles?.bairro}) • {new Date(pub.created_at).toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprovePublication(pub.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                        >
                          <CheckCircle size={18} />
                          Aprovar
                        </button>
                        <button
                          onClick={() => handleRejectPublication(pub.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                        >
                          <XCircle size={18} />
                          Rejeitar
                        </button>
                        <button
                          onClick={() => router.push(`/publicacao/${pub.id}`)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
                        >
                          <Eye size={18} />
                          Ver Detalhes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Todas as Publicações */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Todas as Publicações ({publications.length})
              </h3>

              <div className="space-y-3">
                {publications.map((pub) => (
                  <div key={pub.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${categoryColors[pub.category as keyof typeof categoryColors]}`}>
                          {pub.category}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          pub.status === 'ativo' ? 'bg-green-100 text-green-700' : 
                     //   pub.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {pub.status}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900">
                        {pub.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {pub.profiles?.name} • {new Date(pub.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/publicacao/${pub.id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDeletePublication(pub.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: Usuários */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Gestão de Usuários
            </h3>
            <p className="text-gray-600">
              Funcionalidade de gestão de usuários em desenvolvimento...
            </p>
          </div>
        )}

        {/* TAB: Analytics */}
        {activeTab === 'analytics' && (
          <AdvancedAnalytics cityId={city.id} cityName={city.name} />
        )}

        {/* TAB: Configurações */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Configurações da Cidade
            </h3>
            <p className="text-gray-600 mb-6">
              Personalize a aparência e funcionalidades da página da sua cidade.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome da Cidade
                </label>
                <input
                  type="text"
                  value={city.name}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cor Primária
                  </label>
                  <input
                    type="color"
                    value={city.primary_color}
                    className="w-full h-12 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cor Secundária
                  </label>
                  <input
                    type="color"
                    value={city.secondary_color}
                    className="w-full h-12 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold">
                Salvar Configurações
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}