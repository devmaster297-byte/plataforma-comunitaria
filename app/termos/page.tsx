// app/termos/page.tsx
import Link from 'next/link'
import { FileText, AlertCircle, Shield, Users } from 'lucide-react'

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <FileText size={40} />
            <h1 className="text-4xl font-bold">
              Termos de Uso
            </h1>
          </div>
          <p className="text-gray-300">
            Última atualização: Janeiro de 2026
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introdução */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8">
          <div className="flex gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-blue-900 mb-2">
                Importante
              </h3>
              <p className="text-blue-800 text-sm">
                Ao utilizar a Plataforma Comunitária, você concorda com estes Termos de Uso. 
                Por favor, leia atentamente antes de prosseguir.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 prose prose-lg max-w-none">
          {/* 1. Aceitação dos Termos */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Aceitação dos Termos
            </h2>
            <p className="text-gray-700 mb-4">
              Ao acessar e utilizar a <strong>Plataforma Comunitária</strong>, você concorda em cumprir 
              e estar vinculado a estes Termos de Uso. Se você não concorda com qualquer parte destes termos, 
              não deve utilizar nossa plataforma.
            </p>
            <p className="text-gray-700">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações serão 
              efetivas imediatamente após sua publicação na plataforma. O uso contínuo após as alterações 
              constitui aceitação dos novos termos.
            </p>
          </section>

          {/* 2. Descrição do Serviço */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Descrição do Serviço
            </h2>
            <p className="text-gray-700 mb-4">
              A Plataforma Comunitária é uma rede social local que conecta vizinhos e moradores de uma 
              mesma cidade, permitindo:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Publicar e visualizar pedidos de ajuda, serviços, vagas, doações e avisos</li>
              <li>Interagir com outros usuários através de comentários e reações</li>
              <li>Fortalecer laços comunitários e promover colaboração local</li>
            </ul>
          </section>

          {/* 3. Cadastro e Conta do Usuário */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Cadastro e Conta do Usuário
            </h2>
            <p className="text-gray-700 mb-4">
              <strong>3.1. Elegibilidade:</strong> Você deve ter pelo menos 18 anos de idade para criar 
              uma conta. Menores de 18 anos podem utilizar a plataforma apenas sob supervisão de pais 
              ou responsáveis legais.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>3.2. Informações Precisas:</strong> Você concorda em fornecer informações verdadeiras, 
              precisas e atualizadas durante o cadastro e mantê-las atualizadas.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>3.3. Segurança da Conta:</strong> Você é responsável por manter a confidencialidade 
              da sua senha e por todas as atividades que ocorrerem em sua conta.
            </p>
            <p className="text-gray-700">
              <strong>3.4. Uma Conta por Pessoa:</strong> Cada usuário pode ter apenas uma conta ativa. 
              Contas duplicadas serão removidas.
            </p>
          </section>

          {/* 4. Conduta do Usuário */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Conduta do Usuário
            </h2>
            <p className="text-gray-700 mb-4">
              Ao utilizar a plataforma, você concorda em <strong>NÃO</strong>:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Publicar conteúdo ilegal, difamatório, ofensivo, discriminatório ou obsceno</li>
              <li>Assediar, ameaçar ou intimidar outros usuários</li>
              <li>Violar direitos de propriedade intelectual de terceiros</li>
              <li>Publicar informações falsas ou enganosas</li>
              <li>Utilizar a plataforma para fins comerciais não autorizados ou spam</li>
              <li>Coletar dados de outros usuários sem consentimento</li>
              <li>Criar contas falsas ou se passar por outra pessoa</li>
              <li>Interferir no funcionamento da plataforma ou servidores</li>
              <li>Utilizar bots, scripts ou ferramentas automatizadas</li>
            </ul>
          </section>

          {/* 5. Conteúdo do Usuário */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Conteúdo do Usuário
            </h2>
            <p className="text-gray-700 mb-4">
              <strong>5.1. Propriedade:</strong> Você mantém todos os direitos sobre o conteúdo que 
              publica na plataforma.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>5.2. Licença de Uso:</strong> Ao publicar conteúdo, você concede à Plataforma 
              Comunitária uma licença mundial, não exclusiva, livre de royalties, transferível e 
              sublicenciável para usar, reproduzir, distribuir e exibir seu conteúdo na plataforma.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>5.3. Responsabilidade:</strong> Você é o único responsável pelo conteúdo que 
              publica e pelas consequências de publicá-lo.
            </p>
            <p className="text-gray-700">
              <strong>5.4. Remoção de Conteúdo:</strong> Reservamo-nos o direito de remover qualquer 
              conteúdo que viole estes termos, sem aviso prévio.
            </p>
          </section>

          {/* 6. Moderação */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Moderação
            </h2>
            <p className="text-gray-700 mb-4">
              A Plataforma Comunitária utiliza moderação ativa para manter um ambiente seguro e respeitoso. 
              Nossa equipe e ferramentas automatizadas monitoram publicações e podem:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Remover conteúdo inadequado</li>
              <li>Suspender ou banir usuários que violem os termos</li>
              <li>Solicitar modificações em publicações</li>
            </ul>
          </section>

          {/* 7. Privacidade */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Privacidade
            </h2>
            <p className="text-gray-700">
              O uso de suas informações pessoais é regido por nossa{' '}
              <Link href="/privacidade" className="text-primary-600 hover:underline font-semibold">
                Política de Privacidade
              </Link>
              . Ao usar a plataforma, você concorda com a coleta e uso de informações conforme 
              descrito nessa política.
            </p>
          </section>

          {/* 8. Limitação de Responsabilidade */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Limitação de Responsabilidade
            </h2>
            <p className="text-gray-700 mb-4">
              <strong>8.1. Uso por Sua Conta e Risco:</strong> A plataforma é fornecida "como está". 
              Não garantimos que o serviço será ininterrupto, seguro ou livre de erros.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>8.2. Interações entre Usuários:</strong> Não somos responsáveis por interações 
              ou transações entre usuários. Você assume todo risco ao interagir com outros usuários.
            </p>
            <p className="text-gray-700">
              <strong>8.3. Conteúdo de Terceiros:</strong> Não somos responsáveis pelo conteúdo 
              publicado por usuários. Não endossamos, verificamos ou garantimos a precisão de 
              publicações de terceiros.
            </p>
          </section>

          {/* 9. Suspensão e Encerramento */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Suspensão e Encerramento
            </h2>
            <p className="text-gray-700 mb-4">
              Reservamo-nos o direito de suspender ou encerrar sua conta, a qualquer momento, 
              por qualquer motivo, incluindo:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Violação destes Termos de Uso</li>
              <li>Comportamento inadequado ou abusivo</li>
              <li>Inatividade prolongada</li>
              <li>Solicitação do próprio usuário</li>
            </ul>
          </section>

          {/* 10. Alterações no Serviço */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Alterações no Serviço
            </h2>
            <p className="text-gray-700">
              Reservamo-nos o direito de modificar, suspender ou descontinuar qualquer aspecto da 
              plataforma a qualquer momento, com ou sem aviso prévio.
            </p>
          </section>

          {/* 11. Lei Aplicável */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Lei Aplicável
            </h2>
            <p className="text-gray-700">
              Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. 
              Qualquer disputa será resolvida nos tribunais brasileiros.
            </p>
          </section>

          {/* 12. Contato */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Contato
            </h2>
            <p className="text-gray-700 mb-4">
              Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>Email:</strong> contato@plataformacomunitaria.com.br<br />
                <strong>Formulário:</strong>{' '}
                <Link href="/contato" className="text-primary-600 hover:underline">
                  Página de Contato
                </Link>
              </p>
            </div>
          </section>
        </div>

        {/* Footer com links relacionados */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4">Documentos Relacionados</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/privacidade"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 transition"
            >
              <Shield className="text-primary-600" size={24} />
              <div>
                <div className="font-semibold text-gray-900">Política de Privacidade</div>
                <div className="text-xs text-gray-600">Como protegemos seus dados</div>
              </div>
            </Link>

            <Link
              href="/como-funciona"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 transition"
            >
              <Users className="text-primary-600" size={24} />
              <div>
                <div className="font-semibold text-gray-900">Como Funciona</div>
                <div className="text-xs text-gray-600">Aprenda a usar a plataforma</div>
              </div>
            </Link>

            <Link
              href="/contato"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 transition"
            >
              <AlertCircle className="text-primary-600" size={24} />
              <div>
                <div className="font-semibold text-gray-900">Contato</div>
                <div className="text-xs text-gray-600">Tire suas dúvidas</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}