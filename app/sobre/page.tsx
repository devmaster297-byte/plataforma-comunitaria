// app/sobre/page.tsx
import Link from 'next/link'
import { 
  Users, 
  Target, 
  Heart, 
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Award
} from 'lucide-react'

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Sobre a Plataforma Comunitária
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Conectando vizinhos, fortalecendo comunidades e transformando cidades em lugares melhores para viver.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Nossa História */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Nossa História
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                A <strong>Plataforma Comunitária</strong> nasceu da necessidade de reconectar pessoas em suas próprias comunidades. 
                Em um mundo cada vez mais digital, percebemos que as relações de vizinhança estavam se perdendo.
              </p>
              <p>
                Criamos uma solução que permite que moradores de uma mesma cidade se ajudem mutuamente, 
                compartilhem recursos, ofereçam serviços e fortaleçam os laços comunitários de forma simples e eficaz.
              </p>
              <p>
                Hoje, estamos presentes em diversas cidades brasileiras, ajudando milhares de pessoas a se conectarem 
                com seus vizinhos e tornando as comunidades mais unidas, solidárias e prósperas.
              </p>
            </div>
          </div>
        </section>

        {/* Missão, Visão e Valores */}
        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Nossa Missão
              </h3>
              <p className="text-gray-600">
                Fortalecer comunidades locais através da tecnologia, promovendo colaboração, 
                solidariedade e desenvolvimento sustentável.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Nossa Visão
              </h3>
              <p className="text-gray-600">
                Ser a principal plataforma de engajamento comunitário do Brasil, 
                presente em todas as cidades e transformando vidas.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Nossos Valores
              </h3>
              <p className="text-gray-600">
                Solidariedade, transparência, inovação, inclusão e compromisso 
                com o desenvolvimento local.
              </p>
            </div>
          </div>
        </section>

        {/* Por que escolher */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Por que Escolher Nossa Plataforma?
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="text-blue-600" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    100% Gratuito para Cidadãos
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Acesso ilimitado a todas as funcionalidades sem nenhum custo. 
                    Cadastre-se e participe!
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="text-green-600" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    Seguro e Confiável
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Sistema de verificação de usuários e moderação ativa para 
                    garantir um ambiente seguro.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Zap className="text-purple-600" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    Fácil de Usar
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Interface intuitiva e simples. Publique, comente e conecte-se 
                    em poucos cliques.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-yellow-600" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    Impacto Real
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Milhares de conexões realizadas, problemas resolvidos e 
                    comunidades fortalecidas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Estatísticas */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Nosso Impacto em Números
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-primary-100">Cidades Ativas</div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold mb-2">10k+</div>
                <div className="text-primary-100">Usuários Cadastrados</div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold mb-2">25k+</div>
                <div className="text-primary-100">Publicações Criadas</div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold mb-2">100k+</div>
                <div className="text-primary-100">Conexões Realizadas</div>
              </div>
            </div>
          </div>
        </section>

        {/* Para Prefeituras */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="text-purple-600" size={24} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Para Prefeituras
              </h2>
            </div>

            <p className="text-gray-700 mb-6">
              Oferecemos soluções personalizadas para prefeituras que desejam ter um canal 
              direto e eficiente de comunicação com seus cidadãos.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">
                Benefícios para sua cidade:
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  Página institucional personalizada com identidade visual da cidade
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  Dashboard com analytics e insights sobre a comunidade
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  Canal direto de comunicação com os cidadãos
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  Suporte prioritário e treinamento da equipe
                </li>
              </ul>
            </div>

            <Link
              href="/contato"
              className="inline-block px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
            >
              Fale com Nossa Equipe
            </Link>
          </div>
        </section>

        {/* CTA Final */}
        <section className="text-center">
          <div className="bg-white rounded-xl shadow-lg p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Faça Parte da Transformação
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de pessoas que já estão fortalecendo suas comunidades 
              e construindo um futuro melhor juntos.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/cadastro"
                className="px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold shadow-lg hover:shadow-xl"
              >
                Cadastre-se Gratuitamente
              </Link>
              <Link
                href="/explorar"
                className="px-8 py-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
              >
                Explorar Publicações
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}