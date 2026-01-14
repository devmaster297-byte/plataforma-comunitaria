// app/como-funciona/page.tsx
import Link from 'next/link'
import { 
  UserPlus, 
  Search, 
  MessageCircle, 
  Heart,
  Shield,
  Bell,
  Users,
  Zap,
  CheckCircle,
  HelpCircle
} from 'lucide-react'

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Como Funciona?
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Descubra como é simples conectar-se com sua comunidade e fazer a diferença na sua cidade.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Passo a Passo */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Em 3 Passos Simples
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Comece a participar da sua comunidade em menos de 5 minutos
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Passo 1 */}
            <div className="relative">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <UserPlus className="text-white" size={36} />
                </div>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  1
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Cadastre-se
                </h3>
                <p className="text-gray-600 mb-4">
                  Crie sua conta gratuita em segundos. Basta informar seu nome, 
                  email e escolher uma senha.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    100% gratuito
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Rápido e seguro
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Sem anúncios
                  </li>
                </ul>
              </div>
            </div>

            {/* Passo 2 */}
            <div className="relative">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <MessageCircle className="text-white" size={36} />
                </div>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  2
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Publique
                </h3>
                <p className="text-gray-600 mb-4">
                  Compartilhe pedidos de ajuda, ofereça serviços, divulgue vagas, 
                  faça doações ou publique avisos.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    5 categorias diferentes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Adicione fotos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Alcance local
                  </li>
                </ul>
              </div>
            </div>

            {/* Passo 3 */}
            <div className="relative">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Users className="text-white" size={36} />
                </div>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  3
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Conecte-se
                </h3>
                <p className="text-gray-600 mb-4">
                  Interaja com vizinhos, comente, curta e fortaleça os laços da 
                  sua comunidade.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Comente e responda
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Reações e curtidas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Notificações em tempo real
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Categorias */}
        <section className="mb-20">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              5 Categorias para Você Explorar
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border-2 border-red-200 rounded-lg p-6 hover:border-red-400 transition">
                <div className="text-4xl mb-3">🆘</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Pedidos de Ajuda
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Precisa de uma mão? Peça ajuda aos seus vizinhos.
                </p>
                <div className="text-xs text-gray-500">
                  Ex: Empréstimo de ferramentas, ajuda com mudança, indicação de profissionais
                </div>
              </div>

              <div className="border-2 border-blue-200 rounded-lg p-6 hover:border-blue-400 transition">
                <div className="text-4xl mb-3">💼</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Serviços
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Ofereça seus serviços profissionais para a comunidade.
                </p>
                <div className="text-xs text-gray-500">
                  Ex: Jardinagem, aulas particulares, consertos, consultoria
                </div>
              </div>

              <div className="border-2 border-green-200 rounded-lg p-6 hover:border-green-400 transition">
                <div className="text-4xl mb-3">📈</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Vagas de Emprego
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Divulgue oportunidades de trabalho na sua região.
                </p>
                <div className="text-xs text-gray-500">
                  Ex: Vagas CLT, estágio, freelance, trabalho temporário
                </div>
              </div>

              <div className="border-2 border-purple-200 rounded-lg p-6 hover:border-purple-400 transition">
                <div className="text-4xl mb-3">🎁</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Doações
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Doe itens que não usa mais ou encontre o que precisa.
                </p>
                <div className="text-xs text-gray-500">
                  Ex: Roupas, móveis, livros, brinquedos, eletrônicos
                </div>
              </div>

              <div className="border-2 border-yellow-200 rounded-lg p-6 hover:border-yellow-400 transition">
                <div className="text-4xl mb-3">📢</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Avisos
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Compartilhe informações importantes com a comunidade.
                </p>
                <div className="text-xs text-gray-500">
                  Ex: Eventos, achados e perdidos, alertas, reuniões
                </div>
              </div>

              <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="text-4xl mb-3">➕</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  E muito mais...
                </h3>
                <p className="text-gray-600 text-sm">
                  Estamos sempre adicionando novas funcionalidades para melhorar sua experiência!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Recursos */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Recursos da Plataforma
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-blue-600" size={28} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">
                Busca Avançada
              </h3>
              <p className="text-sm text-gray-600">
                Encontre exatamente o que procura com filtros por categoria, bairro e palavra-chave
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="text-purple-600" size={28} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">
                Notificações
              </h3>
              <p className="text-sm text-gray-600">
                Receba alertas em tempo real quando alguém interage com suas publicações
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-green-600" size={28} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">
                Segurança
              </h3>
              <p className="text-sm text-gray-600">
                Sistema de verificação de usuários e moderação ativa para sua proteção
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-yellow-600" size={28} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">
                Rapidez
              </h3>
              <p className="text-sm text-gray-600">
                Interface intuitiva e rápida. Publique e conecte-se em segundos
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Rápido */}
        <section className="mb-20">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Perguntas Frequentes
            </h2>

            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="border-l-4 border-primary-600 pl-4">
                <div className="flex items-start gap-3">
                  <HelpCircle className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      É realmente gratuito?
                    </h3>
                    <p className="text-gray-600">
                      Sim! 100% gratuito para cidadãos. Sem taxas ocultas, sem anúncios invasivos. 
                      Apenas cadastre-se e comece a usar.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-primary-600 pl-4">
                <div className="flex items-start gap-3">
                  <HelpCircle className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      Minha cidade está disponível?
                    </h3>
                    <p className="text-gray-600">
                      Estamos presentes em diversas cidades. Ao se cadastrar, você verá as opções disponíveis. 
                      Se sua cidade ainda não está, entre em contato conosco!
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-primary-600 pl-4">
                <div className="flex items-start gap-3">
                  <HelpCircle className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      É seguro compartilhar informações?
                    </h3>
                    <p className="text-gray-600">
                      Sim. Temos sistema de verificação, moderação ativa e você controla quais 
                      informações compartilhar. Nunca divulgue dados sensíveis nas publicações.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-primary-600 pl-4">
                <div className="flex items-start gap-3">
                  <HelpCircle className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      Como faço para publicar?
                    </h3>
                    <p className="text-gray-600">
                      Após o cadastro, clique em "Publicar", escolha a categoria, preencha o título e descrição, 
                      adicione fotos (opcional) e publique. Simples assim!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link
                href="/contato"
                className="text-primary-600 hover:underline font-semibold"
              >
                Mais dúvidas? Entre em contato →
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Pronto para Começar?
            </h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Junte-se à sua comunidade agora mesmo. É grátis, rápido e fácil!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/cadastro"
                className="px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition font-semibold shadow-lg hover:shadow-xl"
              >
                Criar Conta Gratuita
              </Link>
              <Link
                href="/explorar"
                className="px-8 py-4 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition font-semibold border-2 border-white/30"
              >
                Ver Publicações
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}