import { Metadata } from 'next'
import { MapPin, Users, Bell, TrendingUp, Clock, Phone, Map } from 'lucide-react'
import SantaTeresaClient from '@/components/SantaTeresaClient'
import Navbar from '@/components/Navbar'
import CreatePostModal from '@/components/CreatePostModal'
import StatsCounter from '@/components/StatsCounter'
import EmergencyAlert from '@/components/EmergencyAlert'
import CityHighlights from '@/components/CityHighlights'
import { createServerClient } from '@/lib/supabase-server'
import { supabase } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Santa Teresa ES | Portal Comunitário - Conectando Moradores',
  description: 'Mural digital interativo de Santa Teresa-ES. Vagas, serviços, avisos, farmácias de plantão e conexões entre moradores da Terra dos Colibris.',
  keywords: 'Santa Teresa ES, comunidade, mural digital, avisos, vagas, serviços locais, farmácias de plantão',
}

export default async function HomePage() {
  const supabaseServer = createServerClient()
  const { data: { session } } = await supabaseServer.auth.getSession()
  const user = session?.user

  // Buscar dados do perfil do usuário se existir
  let userNeighborhood = ''
  if (user) {
    const { data: profile } = await supabaseServer
      .from('profiles')
      .select('neighborhood')
      .eq('id', user.id)
      .single()
    
    userNeighborhood = profile?.neighborhood || ''
  }

  // Buscar farmácias de plantão do banco de dados
  const { data: dutyPharmacies } = await supabase
    .from('duty_pharmacies')
    .select('*')
    .order('id')

  // Datas relevantes
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Formatar datas
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-green-50">
      {/* 1. Navbar / Header */}
      <Navbar user={user} />

      {/* 2. Alertas de Emergência/Importantes */}
      <EmergencyAlert />

      {/* 3. Banner Hero com CTA */}
      <div className="relative bg-gradient-to-r from-green-900 via-green-800 to-emerald-900 py-16 px-4 overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-green-700 rounded-full -translate-x-16 -translate-y-16 opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-800 rounded-full translate-x-24 translate-y-24 opacity-20"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-green-700/30 px-4 py-2 rounded-full mb-4">
                <MapPin className="w-4 h-4 text-green-300" />
                <span className="text-green-200 text-sm font-medium">Terra dos Colibris</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                Bem-vindo à nossa <span className="text-yellow-300">Comunidade</span>
              </h1>
              
              <p className="text-green-100 text-lg md:text-xl max-w-2xl mb-8">
                Conecte-se com seus vizinhos, compartilhe informações importantes e fortaleça nossa cidade juntos.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <CreatePostModal 
                  variant="button"
                  className="px-8 py-3 text-lg rounded-full font-semibold bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  userId={user?.id}
                  userNeighborhood={userNeighborhood}
                />
                <button className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold border border-white/30 transition-all duration-300">
                  <Users className="inline-block mr-2 w-5 h-5" />
                  Explorar Grupos
                </button>
              </div>
            </div>
            
            {/* Estatísticas da Comunidade */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 min-w-[300px]">
              <h3 className="text-white font-semibold mb-4 text-lg">Comunidade Ativa</h3>
              <div className="space-y-3">
                <StatsCounter 
                  icon={<Users className="w-5 h-5" />}
                  label="Moradores Conectados"
                  count={1243}
                  color="text-green-300"
                />
                <StatsCounter 
                  icon={<Bell className="w-5 h-5" />}
                  label="Avisos Hoje"
                  count={18}
                  color="text-yellow-300"
                />
                <StatsCounter 
                  icon={<TrendingUp className="w-5 h-5" />}
                  label="Interações Diárias"
                  count={342}
                  color="text-blue-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Farmácias de Plantão - Destaque Especial */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-white/20 rounded-full">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Farmácias de Plantão</h2>
              <p className="text-blue-100">Serviço 24h e fins de semana em Santa Teresa</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hoje */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500 rounded-full">
                  <span className="text-white font-bold">HOJE</span>
                </div>
                <h3 className="text-xl font-bold text-white">{formatDate(today)}</h3>
              </div>
              
              <div className="space-y-4">
                {dutyPharmacies && dutyPharmacies.filter(p => p.is_today).map((pharmacy) => (
                  <div key={pharmacy.id} className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-white text-lg">{pharmacy.name}</h4>
                        <div className="flex items-center gap-2 mt-2 text-blue-100">
                          <MapPin className="w-4 h-4" />
                          <span>{pharmacy.address}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-blue-100">
                          <Phone className="w-4 h-4" />
                          <span>{pharmacy.phone}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-full">
                        {pharmacy.period === 'night' ? '🌙 24h' : '🏖️ Fim de Semana'}
                      </span>
                    </div>
                    <div className="mt-3 text-sm text-blue-200">
                      <span className="font-medium">Horário:</span> {pharmacy.hours}
                    </div>
                  </div>
                ))}
                
                {(!dutyPharmacies || dutyPharmacies.filter(p => p.is_today).length === 0) && (
                  <div className="text-center py-4 text-blue-200">
                    <p>Nenhuma farmácia de plantão hoje.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Amanhã */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500 rounded-full">
                  <span className="text-white font-bold">AMANHÃ</span>
                </div>
                <h3 className="text-xl font-bold text-white">{formatDate(tomorrow)}</h3>
              </div>
              
              <div className="space-y-4">
                {dutyPharmacies && dutyPharmacies.filter(p => p.is_tomorrow).map((pharmacy) => (
                  <div key={pharmacy.id} className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-white text-lg">{pharmacy.name}</h4>
                        <div className="flex items-center gap-2 mt-2 text-blue-100">
                          <MapPin className="w-4 h-4" />
                          <span>{pharmacy.address}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-blue-100">
                          <Phone className="w-4 h-4" />
                          <span>{pharmacy.phone}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">
                        {pharmacy.period === 'night' ? '🌙 24h' : '🏖️ Fim de Semana'}
                      </span>
                    </div>
                    <div className="mt-3 text-sm text-blue-200">
                      <span className="font-medium">Horário:</span> {pharmacy.hours}
                    </div>
                  </div>
                ))}
                
                {(!dutyPharmacies || dutyPharmacies.filter(p => p.is_tomorrow).length === 0) && (
                  <div className="text-center py-4 text-blue-200">
                    <p>Nenhuma farmácia de plantão amanhã.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a 
              href="/farmacias" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-800 font-semibold rounded-full hover:bg-blue-50 transition-colors"
            >
              <Map className="w-5 h-5" />
              Ver todas as farmácias e calendário completo
            </a>
          </div>
        </div>
      </div>

      {/* 5. Destaques da Cidade */}
      <CityHighlights />

      {/* 6. Área de Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Lado Esquerdo: Menu de Navegação */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Categorias */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="font-bold mb-4 text-green-900 text-lg flex items-center gap-2">
              <div className="w-2 h-6 bg-green-600 rounded-full"></div>
              Categorias
            </h3>
            <ul className="space-y-3">
              {[
                { icon: '📢', label: 'Avisos Oficiais', count: 12, color: 'bg-red-100 text-red-800' },
                { icon: '💼', label: 'Vagas de Emprego', count: 8, color: 'bg-blue-100 text-blue-800' },
                { icon: '🛠️', label: 'Serviços Locais', count: 24, color: 'bg-purple-100 text-purple-800' },
                { icon: '🏘️', label: 'Bairros', count: 15, color: 'bg-green-100 text-green-800' },
                { icon: '🎉', label: 'Eventos', count: 5, color: 'bg-yellow-100 text-yellow-800' },
                { icon: '❓', label: 'Dúvidas', count: 21, color: 'bg-gray-100 text-gray-800' },
                { icon: '💊', label: 'Saúde', count: 7, color: 'bg-pink-100 text-pink-800' },
              ].map((cat) => (
                <li key={cat.label} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{cat.icon}</span>
                    <span className="font-medium text-gray-700 group-hover:text-green-700">{cat.label}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cat.color}`}>
                    {cat.count}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Farmácias de Plantão - Versão Resumida */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-600 rounded-full">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-blue-900">Farmácias de Plantão</h4>
                <p className="text-blue-600 text-sm">Serviço 24h disponível</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {dutyPharmacies && dutyPharmacies.filter(p => p.is_today).slice(0, 2).map((pharmacy) => (
                <div key={pharmacy.id} className="p-3 bg-white rounded-lg border border-blue-200">
                  <h5 className="font-semibold text-blue-800">{pharmacy.name}</h5>
                  <p className="text-sm text-gray-600 mt-1">{pharmacy.address}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">{pharmacy.phone}</span>
                  </div>
                </div>
              ))}
              
              <a 
                href="/farmacias" 
                className="block text-center text-blue-700 font-medium text-sm hover:text-blue-800 mt-3"
              >
                Ver calendário completo →
              </a>
            </div>
          </div>

          {/* Regras da Comunidade */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
            <h4 className="font-bold mb-3 text-green-800">📜 Regras da Comunidade</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></div>
                Respeite todos os membros
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></div>
                Sem discriminação
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></div>
                Informações verídicas
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></div>
                Ajudar o próximo
              </li>
            </ul>
          </div>

          {/* CTA para Cadastro */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-2xl text-white text-center">
            <h4 className="font-bold mb-2">Junte-se à comunidade!</h4>
            <p className="text-sm text-green-100 mb-4">
              Cadastre-se para interagir e receber avisos do seu bairro
            </p>
            <a 
              href="/cadastro" 
              className="block w-full bg-white text-green-700 font-semibold py-2.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              Criar Conta Gratuita
            </a>
          </div>
        </aside>

        {/* Centro: Feed Principal */}
        <div className="lg:col-span-3 space-y-6">
          {/* Criar Nova Postagem - Destacado */}
          <div className="bg-gradient-to-r from-white to-green-50 p-6 rounded-2xl shadow-lg border border-green-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                ST
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">Compartilhe algo com a cidade</h3>
                <p className="text-sm text-gray-500">Avisos, eventos, oportunidades...</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CreatePostModal 
                variant="full"
                className="flex-1"
                userId={user?.id}
                userNeighborhood={userNeighborhood}
              />
              <button className="px-6 py-3 border-2 border-green-200 text-green-700 rounded-xl hover:bg-green-50 transition-colors">
                📷 Foto
              </button>
              <button className="px-6 py-3 border-2 border-green-200 text-green-700 rounded-xl hover:bg-green-50 transition-colors">
                📅 Evento
              </button>
            </div>
          </div>

          {/* Filtros Rápidos */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-wrap gap-3">
              <span className="text-gray-600 font-medium mr-3">Filtrar por:</span>
              {['Todas', 'Mais Recentes', 'Mais Populares', 'Meu Bairro', 'Apenas Oficiais'].map((filter) => (
                <button 
                  key={filter}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === 'Todas' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Componente Principal de Posts */}
          <div className="relative">
            <div className="absolute -left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 to-emerald-600 rounded-full hidden lg:block"></div>
            <SantaTeresaClient />
          </div>

          {/* Rodapé do Feed */}
          <div className="text-center py-8 text-gray-500">
            <p className="mb-2">✨ Você chegou ao fim das postagens recentes</p>
            <p className="text-sm">Ajude a manter nossa comunidade ativa compartilhando informações relevantes!</p>
          </div>
        </div>
      </div>

      {/* 7. Rodapé da Página */}
      <footer className="bg-green-900 text-white mt-12 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4 text-green-200">Santa Teresa - ES</h4>
              <p className="text-green-300">
                Portal comunitário criado por moradores, para moradores.
                Conectando nossa cidade desde 2024.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Links Rápidos</h5>
              <ul className="space-y-2 text-green-300">
                <li><a href="/sobre" className="hover:text-white transition-colors">Sobre o Projeto</a></li>
                <li><a href="/farmacias" className="hover:text-white transition-colors">Farmácias de Plantão</a></li>
                <li><a href="/eventos" className="hover:text-white transition-colors">Eventos</a></li>
                <li><a href="/servicos" className="hover:text-white transition-colors">Serviços</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Contatos Úteis</h5>
              <ul className="space-y-2 text-green-300">
                <li>🗺️ Prefeitura: (27) 3259-1200</li>
                <li>🏥 SAMU: 192</li>
                <li>🚒 Bombeiros: 193</li>
                <li>👮‍♂️ Polícia: 190</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Precisa de Ajuda?</h5>
              <p className="text-green-300 mb-3">
                Dúvidas ou sugestões para melhorar nosso portal?
              </p>
              <a 
                href="/contato" 
                className="inline-block bg-green-700 hover:bg-green-600 text-white px-6 py-2 rounded-full font-medium transition-colors"
              >
                Fale Conosco
              </a>
            </div>
          </div>
          <div className="border-t border-green-800 mt-8 pt-6 text-center text-green-400 text-sm">
            <p>© 2024 Portal Comunitário Santa Teresa ES. Orgulhosamente Capixaba.</p>
            <p className="mt-1">Terra dos Colibris - Primeira Cidade Italiana do Brasil</p>
          </div>
        </div>
      </footer>
    </main>
  )
}