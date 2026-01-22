'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { MapPin, User, Phone, CheckCircle, MessageCircle, Briefcase, ArrowRight, Bell, Search } from 'lucide-react'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [bairro, setBairro] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [profileId, setProfileId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkProfile()
  }, [])

  const checkProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      router.push('/login')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (profile) {
      setProfileId(profile.id)
      setName(profile.name || '')
      setBairro(profile.bairro || '')
      setPhone(profile.phone || '')
    }
  }

  const handleSaveProfile = async () => {
    if (!profileId) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: name.trim() || null,
          bairro: bairro.trim() || null,
          phone: phone.trim() || null
        })
        .eq('id', profileId)

      if (error) throw error
      setStep(2)
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
      alert('Erro ao salvar informações')
    } finally {
      setLoading(false)
    }
  }

  const handleChooseAction = (action: string) => {
    switch (action) {
      case 'publicar':
        router.push('/publicar')
        break
      case 'servico':
        router.push('/publicar')
        break
      case 'aviso':
        router.push('/publicar')
        break
      case 'explorar':
        router.push('/')
        break
    }
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white font-bold text-3xl">👋</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Bem-vindo à Comunidade!
              </h1>
              <p className="text-lg text-gray-600">
                Vamos configurar seu perfil rapidamente
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Seu nome completo
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="João Silva"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Seu bairro <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    placeholder="Centro, Vila Nova, etc."
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  💡 Ajuda outros moradores a encontrarem você
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  WhatsApp <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  💡 Facilita o contato direto com você
                </p>
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={loading || !name.trim()}
                className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Salvando...' : 'Continuar →'}
              </button>

              <button
                onClick={() => router.push('/')}
                className="w-full py-3 text-gray-600 hover:text-gray-900 transition font-medium"
              >
                Pular por enquanto
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600" size={40} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Pronto, {name.split(' ')[0]}!
            </h1>
            <p className="text-lg text-gray-600">
              O que você gostaria de fazer agora?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => handleChooseAction('publicar')}
              className="group p-6 bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 rounded-xl transition-all transform hover:-translate-y-1 hover:shadow-lg border-2 border-transparent hover:border-red-300"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fazer um pedido</h3>
              <p className="text-gray-600">Precisa de ajuda com algo?</p>
            </button>

            <button
              onClick={() => handleChooseAction('servico')}
              className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all transform hover:-translate-y-1 hover:shadow-lg border-2 border-transparent hover:border-blue-300"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Briefcase className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Oferecer um serviço</h3>
              <p className="text-gray-600">Trabalhe na sua comunidade</p>
            </button>

            <button
              onClick={() => handleChooseAction('aviso')}
              className="group p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 rounded-xl transition-all transform hover:-translate-y-1 hover:shadow-lg border-2 border-transparent hover:border-yellow-300"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bell className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Publicar um aviso</h3>
              <p className="text-gray-600">Informe a comunidade</p>
            </button>

            <button
              onClick={() => handleChooseAction('explorar')}
              className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition-all transform hover:-translate-y-1 hover:shadow-lg border-2 border-transparent hover:border-purple-300"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Search className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Explorar a cidade</h3>
              <p className="text-gray-600">Veja o que está acontecendo</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
