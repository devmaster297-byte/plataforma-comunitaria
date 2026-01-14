// app/contato/page.tsx
'use client'

import { useState } from 'react'
import { 
  Mail, 
  MessageCircle, 
  Phone, 
  MapPin, 
  Send,
  CheckCircle,
  HelpCircle,
  Building2,
  Users
} from 'lucide-react'

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    type: 'duvida',
    message: ''
  })
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)

    // Simulação de envio (substitua por integração real)
    await new Promise(resolve => setTimeout(resolve, 2000))

    setSuccess(true)
    setSending(false)
    
    // Reset form após 3 segundos
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: '',
        type: 'duvida',
        message: ''
      })
      setSuccess(false)
    }, 3000)
  }

  const contactTypes = [
    { value: 'duvida', label: 'Dúvida / Suporte', icon: HelpCircle },
    { value: 'sugestao', label: 'Sugestão', icon: MessageCircle },
    { value: 'prefeitura', label: 'Interesse Prefeitura', icon: Building2 },
    { value: 'parceria', label: 'Parceria', icon: Users }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Entre em Contato
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Estamos aqui para ajudar! Envie sua mensagem e responderemos em breve.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Envie sua Mensagem
              </h2>

              {success ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-green-600" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Mensagem Enviada!
                  </h3>
                  <p className="text-gray-600">
                    Obrigado pelo contato. Responderemos em breve!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nome */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Seu nome"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="seu@email.com"
                    />
                  </div>

                  {/* Tipo de Contato */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tipo de Contato *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {contactTypes.map((type) => {
                        const Icon = type.icon
                        return (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, type: type.value })}
                            className={`flex items-center gap-3 p-4 rounded-lg border-2 transition ${
                              formData.type === type.value
                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Icon size={20} />
                            <span className="text-sm font-medium">{type.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Assunto */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Assunto *
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Sobre o que você gostaria de falar?"
                    />
                  </div>

                  {/* Mensagem */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mensagem *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                      placeholder="Conte-nos mais detalhes..."
                      maxLength={1000}
                    />
                    <div className="text-xs text-gray-500 text-right mt-1">
                      {formData.message.length}/1000
                    </div>
                  </div>

                  {/* Botão */}
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {sending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Enviar Mensagem
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    Ao enviar esta mensagem, você concorda com nossa{' '}
                    <a href="/privacidade" className="text-primary-600 hover:underline">
                      Política de Privacidade
                    </a>
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Informações de Contato */}
          <div className="lg:col-span-1 space-y-6">
            {/* Canais */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Outros Canais
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">
                      Email
                    </div>
                    <a
                      href="mailto:contato@plataformacomunitaria.com.br"
                      className="text-primary-600 hover:underline text-sm"
                    >
                      contato@plataformacomunitaria.com.br
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="text-green-600" size={24} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">
                      Telefone
                    </div>
                    <a
                      href="tel:+5527999999999"
                      className="text-primary-600 hover:underline text-sm"
                    >
                      (27) 99999-9999
                    </a>
                    <div className="text-xs text-gray-500">
                      Seg-Sex: 9h às 18h
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">
                      Endereço
                    </div>
                    <p className="text-sm text-gray-600">
                      Santa Maria de Jetibá, ES<br />
                      Brasil
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Rápido */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Perguntas Frequentes
              </h3>

              <div className="space-y-4 text-sm">
                <div>
                  <div className="font-semibold text-gray-900 mb-1">
                    Quanto tempo para resposta?
                  </div>
                  <p className="text-gray-600">
                    Respondemos em até 24 horas úteis.
                  </p>
                </div>

                <div>
                  <div className="font-semibold text-gray-900 mb-1">
                    Esqueci minha senha
                  </div>
                  <p className="text-gray-600">
                    Use a opção "Esqueci senha" na tela de login.
                  </p>
                </div>

                <div>
                  <div className="font-semibold text-gray-900 mb-1">
                    Como excluir minha conta?
                  </div>
                  <p className="text-gray-600">
                    Acesse Configurações → Excluir Conta ou entre em contato.
                  </p>
                </div>
              </div>
            </div>

            {/* Para Prefeituras */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Building2 size={32} />
                <h3 className="text-xl font-bold">
                  É uma Prefeitura?
                </h3>
              </div>
              <p className="text-purple-100 mb-4 text-sm">
                Temos planos especiais para municípios. Conecte sua cidade gratuitamente por 60 dias!
              </p>
              <button
                onClick={() => setFormData({ ...formData, type: 'prefeitura' })}
                className="w-full bg-white text-purple-600 px-4 py-3 rounded-lg hover:bg-purple-50 transition font-semibold"
              >
                Solicitar Demonstração
              </button>
            </div>
          </div>
        </div>

        {/* Mapa ou Informações Adicionais */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="text-blue-600" size={32} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">
                Resposta Rápida
              </h3>
              <p className="text-sm text-gray-600">
                Respondemos todas as mensagens em até 24 horas úteis
              </p>
            </div>

            <div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-green-600" size={32} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">
                Suporte Dedicado
              </h3>
              <p className="text-sm text-gray-600">
                Equipe especializada pronta para ajudar você
              </p>
            </div>

            <div>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="text-purple-600" size={32} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">
                Central de Ajuda
              </h3>
              <p className="text-sm text-gray-600">
                Acesse nosso guia completo de perguntas e respostas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}