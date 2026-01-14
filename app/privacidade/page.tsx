// app/privacidade/page.tsx
import Link from 'next/link'
import { Shield, Lock, Eye, Database, UserCheck, AlertTriangle } from 'lucide-react'

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Shield size={40} />
            <h1 className="text-4xl font-bold">
              Política de Privacidade
            </h1>
          </div>
          <p className="text-green-100">
            Sua privacidade é nossa prioridade. Última atualização: Janeiro de 2026
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Compromisso */}
        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg mb-8">
          <div className="flex gap-3">
            <Lock className="text-green-600 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-green-900 mb-2">
                Nosso Compromisso
              </h3>
              <p className="text-green-800 text-sm">
                Levamos sua privacidade a sério. Coletamos apenas dados essenciais para fornecer 
                nossos serviços e nunca vendemos suas informações a terceiros.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 prose prose-lg max-w-none">
          {/* 1. Informações que Coletamos */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Informações que Coletamos
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              1.1. Informações Fornecidas por Você
            </h3>
            <p className="text-gray-700 mb-3">
              Ao criar uma conta e usar nossos serviços, coletamos:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li><strong>Dados de Cadastro:</strong> Nome, email, senha (criptografada), bairro</li>
              <li><strong>Informações de Perfil:</strong> Foto, bio, telefone (opcional)</li>
              <li><strong>Conteúdo Publicado:</strong> Textos, fotos e comentários que você compartilha</li>
              <li><strong>Interações:</strong> Curtidas, comentários, mensagens</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              1.2. Informações Coletadas Automaticamente
            </h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Dados de Uso:</strong> Páginas visitadas, tempo de navegação, cliques</li>
              <li><strong>Informações do Dispositivo:</strong> Tipo de dispositivo, sistema operacional, navegador</li>
              <li><strong>Dados de Localização:</strong> Apenas cidade/bairro (não GPS preciso)</li>
              <li><strong>Endereço IP:</strong> Para segurança e prevenção de fraudes</li>
            </ul>
          </section>

          {/* 2. Como Usamos Suas Informações */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Como Usamos Suas Informações
            </h2>
            <p className="text-gray-700 mb-3">
              Utilizamos suas informações para:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Fornecer, manter e melhorar nossos serviços</li>
              <li>Personalizar sua experiência na plataforma</li>
              <li>Conectá-lo com outros usuários da sua comunidade</li>
              <li>Enviar notificações sobre interações (comentários, curtidas)</li>
              <li>Responder suas dúvidas e fornecer suporte</li>
              <li>Detectar e prevenir fraudes, spam e abuso</li>
              <li>Cumprir obrigações legais</li>
              <li>Enviar atualizações importantes sobre a plataforma</li>
            </ul>
          </section>

          {/* 3. Compartilhamento de Informações */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Compartilhamento de Informações
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              3.1. Informações Públicas
            </h3>
            <p className="text-gray-700 mb-4">
              As seguintes informações são <strong>visíveis a outros usuários</strong> da plataforma:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Nome e foto de perfil</li>
              <li>Bio e bairro (se fornecidos)</li>
              <li>Publicações, comentários e reações</li>
              <li>Nível de participação e badges</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              3.2. Informações Privadas
            </h3>
            <p className="text-gray-700 mb-4">
              As seguintes informações são <strong>mantidas privadas</strong>:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Email e senha</li>
              <li>Telefone (a menos que você compartilhe em publicações)</li>
              <li>Endereço IP e dados de navegação</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              3.3. Compartilhamento com Terceiros
            </h3>
            <p className="text-gray-700 mb-4">
              <strong>Não vendemos</strong> suas informações pessoais. Podemos compartilhar dados apenas com:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Provedores de Serviços:</strong> Hospedagem, analytics, email (ex: Supabase, Vercel)</li>
              <li><strong>Autoridades Legais:</strong> Quando exigido por lei ou para proteger direitos</li>
              <li><strong>Prefeituras Parceiras:</strong> Apenas estatísticas agregadas e anônimas</li>
            </ul>
          </section>

          {/* 4. Seus Direitos */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Seus Direitos (LGPD)
            </h2>
            <p className="text-gray-700 mb-4">
              De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Acessar:</strong> Solicitar cópia de todos os seus dados pessoais</li>
              <li><strong>Corrigir:</strong> Atualizar informações incorretas ou desatualizadas</li>
              <li><strong>Excluir:</strong> Solicitar remoção permanente da sua conta e dados</li>
              <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
              <li><strong>Revogar Consentimento:</strong> Retirar permissões concedidas anteriormente</li>
              <li><strong>Opor-se:</strong> Discordar do processamento de seus dados</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Para exercer esses direitos, entre em contato através do email:{' '}
              <a href="mailto:privacidade@plataformacomunitaria.com.br" className="text-primary-600 hover:underline">
                privacidade@plataformacomunitaria.com.br
              </a>
            </p>
          </section>

          {/* 5. Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Cookies e Tecnologias Similares
            </h2>
            <p className="text-gray-700 mb-4">
              Utilizamos cookies e tecnologias similares para:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Manter você conectado à sua conta</li>
              <li>Lembrar suas preferências</li>
              <li>Analisar como você usa a plataforma</li>
              <li>Melhorar nossos serviços</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Você pode desabilitar cookies nas configurações do seu navegador, mas isso pode afetar 
              a funcionalidade da plataforma.
            </p>
          </section>

          {/* 6. Segurança */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Segurança dos Dados
            </h2>
            <p className="text-gray-700 mb-4">
              Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Criptografia:</strong> Senhas criptografadas e conexão HTTPS</li>
              <li><strong>Acesso Restrito:</strong> Apenas equipe autorizada acessa dados pessoais</li>
              <li><strong>Monitoramento:</strong> Sistemas de detecção de atividades suspeitas</li>
              <li><strong>Backups:</strong> Cópias de segurança regulares</li>
              <li><strong>Atualizações:</strong> Software sempre atualizado com patches de segurança</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Porém, nenhum sistema é 100% seguro. Você também deve proteger sua senha e não compartilhá-la.
            </p>
          </section>

          {/* 7. Retenção de Dados */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Retenção de Dados
            </h2>
            <p className="text-gray-700 mb-4">
              Mantemos seus dados pelo tempo necessário para:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Fornecer nossos serviços enquanto você usar a plataforma</li>
              <li>Cumprir obrigações legais (ex: registros fiscais por 5 anos)</li>
              <li>Resolver disputas e fazer cumprir acordos</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Quando você excluir sua conta, removemos seus dados pessoais em até 30 dias, exceto 
              informações que devemos manter por obrigação legal.
            </p>
          </section>

          {/* 8. Menores de Idade */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Menores de Idade
            </h2>
            <p className="text-gray-700">
              Nossa plataforma é destinada a maiores de 18 anos. Não coletamos intencionalmente 
              informações de menores de 18 anos sem consentimento parental. Se descobrirmos que 
              coletamos dados de um menor sem autorização, excluiremos essas informações imediatamente.
            </p>
          </section>

          {/* 9. Alterações */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Alterações nesta Política
            </h2>
            <p className="text-gray-700">
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre 
              mudanças significativas por email ou através de um aviso na plataforma. O uso contínuo 
              após as alterações constitui aceitação da nova política.
            </p>
          </section>

          {/* 10. Contato */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Contato - Encarregado de Dados (DPO)
            </h2>
            <p className="text-gray-700 mb-4">
              Para dúvidas sobre privacidade ou exercer seus direitos:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>Email:</strong> privacidade@plataformacomunitaria.com.br<br />
                <strong>Encarregado (DPO):</strong> João Silva<br />
                <strong>Formulário:</strong>{' '}
                <Link href="/contato" className="text-primary-600 hover:underline">
                  Página de Contato
                </Link>
              </p>
            </div>
          </section>
        </div>

        {/* Resumo Visual */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="text-blue-600" size={32} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">
              Dados Minimizados
            </h3>
            <p className="text-sm text-gray-600">
              Coletamos apenas o essencial para nossos serviços
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-green-600" size={32} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">
              Protegido
            </h3>
            <p className="text-sm text-gray-600">
              Criptografia e medidas de segurança avançadas
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="text-purple-600" size={32} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">
              Você no Controle
            </h3>
            <p className="text-sm text-gray-600">
              Acesse, corrija ou exclua seus dados a qualquer momento
            </p>
          </div>
        </div>

        {/* Links Relacionados */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4">Documentos Relacionados</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/termos"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 transition"
            >
              <Shield className="text-primary-600" size={24} />
              <div>
                <div className="font-semibold text-gray-900">Termos de Uso</div>
                <div className="text-xs text-gray-600">Regras de utilização da plataforma</div>
              </div>
            </Link>

            <Link
              href="/contato"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 transition"
            >
              <Eye className="text-primary-600" size={24} />
              <div>
                <div className="font-semibold text-gray-900">Fale Conosco</div>
                <div className="text-xs text-gray-600">Tire suas dúvidas sobre privacidade</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}