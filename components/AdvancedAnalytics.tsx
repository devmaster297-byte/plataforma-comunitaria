// components/AdvancedAnalytics.tsx
'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown,
  Users,
  FileText,
  MessageCircle,
  Heart,
  Calendar,
  Download,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalUsers: number
    totalPublications: number
    totalComments: number
    totalReactions: number
    growthRate: number
    activeUsersToday: number
  }
  
  growth: {
    date: string
    users: number
    publications: number
  }[]
  
  categories: {
    name: string
    count: number
    percentage: number
  }[]
  
  engagement: {
    avgCommentsPerPost: number
    avgReactionsPerPost: number
    mostActiveHour: number
    mostActiveDay: string
  }
  
  topUsers: {
    id: string
    name: string
    avatar?: string
    publicationsCount: number
    commentsCount: number
    reactionsReceived: number
  }[]
}

interface AdvancedAnalyticsProps {
  cityId: string
  cityName: string
}

export default function AdvancedAnalytics({ cityId, cityName }: AdvancedAnalyticsProps) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  useEffect(() => {
    loadAnalytics()
  }, [cityId, period])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      // Simulação de dados - Substituir por chamada real à API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockData: AnalyticsData = {
        overview: {
          totalUsers: 2847,
          totalPublications: 1293,
          totalComments: 4521,
          totalReactions: 8934,
          growthRate: 23.5,
          activeUsersToday: 156
        },
        
        growth: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
          users: Math.floor(2500 + Math.random() * 400),
          publications: Math.floor(1000 + Math.random() * 300)
        })),
        
        categories: [
          { name: 'Serviços', count: 345, percentage: 26.7 },
          { name: 'Ajuda', count: 298, percentage: 23.0 },
          { name: 'Vagas', count: 267, percentage: 20.6 },
          { name: 'Doações', count: 223, percentage: 17.2 },
          { name: 'Avisos', count: 160, percentage: 12.4 }
        ],
        
        engagement: {
          avgCommentsPerPost: 3.5,
          avgReactionsPerPost: 6.9,
          mostActiveHour: 19,
          mostActiveDay: 'Quarta-feira'
        },
        
        topUsers: [
          { id: '1', name: 'Maria Silva', publicationsCount: 45, commentsCount: 123, reactionsReceived: 567 },
          { id: '2', name: 'João Santos', publicationsCount: 38, commentsCount: 98, reactionsReceived: 445 },
          { id: '3', name: 'Ana Costa', publicationsCount: 32, commentsCount: 87, reactionsReceived: 389 },
          { id: '4', name: 'Pedro Lima', publicationsCount: 28, commentsCount: 76, reactionsReceived: 334 },
          { id: '5', name: 'Julia Oliveira', publicationsCount: 25, commentsCount: 65, reactionsReceived: 298 }
        ]
      }
      
      setData(mockData)
    } catch (error) {
      console.error('Erro ao carregar analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = () => {
    if (!data) return
    
    const csvContent = `
Analytics - ${cityName}
Período: ${period}
Data: ${new Date().toLocaleString('pt-BR')}

VISÃO GERAL
Total de Usuários,${data.overview.totalUsers}
Total de Publicações,${data.overview.totalPublications}
Total de Comentários,${data.overview.totalComments}
Total de Reações,${data.overview.totalReactions}
Taxa de Crescimento,${data.overview.growthRate}%
Usuários Ativos Hoje,${data.overview.activeUsersToday}

CATEGORIAS
${data.categories.map(c => `${c.name},${c.count},${c.percentage}%`).join('\n')}

TOP USUÁRIOS
Nome,Publicações,Comentários,Reações Recebidas
${data.topUsers.map(u => `${u.name},${u.publicationsCount},${u.commentsCount},${u.reactionsReceived}`).join('\n')}
    `.trim()
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `analytics-${cityName}-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando analytics...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Erro ao carregar dados</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com Filtros */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Avançados</h2>
          <p className="text-gray-600">Insights detalhados de {cityName}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Seletor de Período */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="1y">Último ano</option>
          </select>

          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
          >
            <Download size={18} />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Cards de Visão Geral */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="text-blue-600" size={24} />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
              <TrendingUp size={16} />
              +{data.overview.growthRate}%
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {data.overview.totalUsers.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total de Usuários</div>
          <div className="text-xs text-gray-500 mt-2">
            {data.overview.activeUsersToday} ativos hoje
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="text-purple-600" size={24} />
            </div>
            <BarChart3 className="text-primary-600" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {data.overview.totalPublications.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total de Publicações</div>
          <div className="text-xs text-gray-500 mt-2">
            ~{Math.round(data.overview.totalPublications / 30)} por dia
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="text-green-600" size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {data.overview.totalComments.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total de Comentários</div>
          <div className="text-xs text-gray-500 mt-2">
            Média: {data.engagement.avgCommentsPerPost} por post
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Heart className="text-red-600" size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {data.overview.totalReactions.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total de Reações</div>
          <div className="text-xs text-gray-500 mt-2">
            Média: {data.engagement.avgReactionsPerPost} por post
          </div>
        </div>
      </div>

      {/* Gráfico de Crescimento */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Activity className="text-primary-600" />
          Crescimento nos Últimos {period === '7d' ? '7 dias' : period === '30d' ? '30 dias' : period === '90d' ? '90 dias' : 'ano'}
        </h3>

        <div className="h-64 flex items-end justify-between gap-2">
          {data.growth.slice(-15).map((day, index) => {
            const maxValue = Math.max(...data.growth.map(d => d.publications))
            const height = (day.publications / maxValue) * 100
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center gap-1">
                  {/* Barra de Publicações */}
                  <div 
                    className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg transition-all hover:from-primary-700 hover:to-primary-500 cursor-pointer relative group"
                    style={{ height: `${height}%`, minHeight: '20px' }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition">
                      {day.publications} posts
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 transform -rotate-45 origin-top-left mt-2">
                  {day.date}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Distribuição por Categorias */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <PieChart className="text-primary-600" />
            Publicações por Categoria
          </h3>

          <div className="space-y-4">
            {data.categories.map((category, index) => {
              const colors = [
                'bg-blue-500',
                'bg-red-500',
                'bg-green-500',
                'bg-purple-500',
                'bg-yellow-500'
              ]
              
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      {category.name}
                    </span>
                    <span className="text-sm text-gray-600">
                      {category.count} ({category.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`${colors[index]} h-full rounded-full transition-all`}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Insights de Engajamento */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Activity className="text-primary-600" />
            Insights de Engajamento
          </h3>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageCircle className="text-blue-600" size={24} />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {data.engagement.avgCommentsPerPost}
                </div>
                <div className="text-sm text-gray-600">
                  Comentários médios por publicação
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="text-red-600" size={24} />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {data.engagement.avgReactionsPerPost}
                </div>
                <div className="text-sm text-gray-600">
                  Reações médias por publicação
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="text-purple-600" size={24} />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {data.engagement.mostActiveHour}h
                </div>
                <div className="text-sm text-gray-600">
                  Horário mais ativo
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {data.engagement.mostActiveDay}
                </div>
                <div className="text-sm text-gray-600">
                  Dia mais ativo da semana
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Usuários */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Users className="text-primary-600" />
          Top 5 Usuários Mais Ativos
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">#</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Usuário</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Publicações</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Comentários</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Reações Recebidas</th>
              </tr>
            </thead>
            <tbody>
              {data.topUsers.map((user, index) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-4 px-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-600' :
                      'bg-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                      ) : (
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                          {user.name[0]}
                        </div>
                      )}
                      <span className="font-semibold text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center font-semibold text-gray-900">
                    {user.publicationsCount}
                  </td>
                  <td className="py-4 px-4 text-center font-semibold text-gray-900">
                    {user.commentsCount}
                  </td>
                  <td className="py-4 px-4 text-center font-semibold text-gray-900">
                    {user.reactionsReceived}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}