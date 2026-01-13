// components/Onboarding.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  X, 
  ArrowRight, 
  ArrowLeft,
  Check,
  User,
  MapPin,
  Camera,
  Sparkles
} from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'
import { updateUserProfile, uploadAvatar } from '@/lib/supabase-helpers'

interface OnboardingProps {
  userId: string
  onComplete: () => void
}

export default function Onboarding({ userId, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    bairro: '',
    phone: '',
    avatar_url: ''
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createSupabaseClient()

  const totalSteps = 4

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (data) {
      setProfile({
        name: data.name || '',
        bio: data.bio || '',
        bairro: data.bairro || '',
        phone: data.phone || '',
        avatar_url: data.avatar_url || ''
      })
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 2MB')
      return
    }

    setUploading(true)
    const { url } = await uploadAvatar(userId, file)
    if (url) {
      setProfile({ ...profile, avatar_url: url })
    }
    setUploading(false)
  }

  const handleComplete = async () => {
    setSaving(true)
    
    // Salvar perfil
    await updateUserProfile(userId, profile)

    // Marcar onboarding como completo
    localStorage.setItem(`onboarding_complete_${userId}`, 'true')

    // Dar badge de boas-vindas
    await supabase
      .from('user_badges')
      .insert({
        user_id: userId,
        badge_id: (await supabase.from('badges').select('id').eq('name', 'Bem-vindo').single()).data?.id
      })

    setSaving(false)
    onComplete()
  }

  const handleSkip = () => {
    localStorage.setItem(`onboarding_complete_${userId}`, 'true')
    onComplete()
  }

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={24} />
              <h2 className="text-2xl font-bold">Bem-vindo à Comunidade!</h2>
            </div>
            <button
              onClick={handleSkip}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex gap-2">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                className={`flex-1 h-2 rounded-full transition-all ${
                  idx < step ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Step 1 - Boas-vindas */}
          {step === 1 && (
            <div className="text-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles size={48} className="text-primary-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Olá! 👋
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Vamos configurar seu perfil em poucos passos para você aproveitar ao máximo a plataforma!
              </p>
              <div className="bg-primary-50 rounded-lg p-6 text-left">
                <h4 className="font-semibold text-gray-900 mb-3">O que você pode fazer:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <Check size={20} className="text-green-600" />
                    Publicar pedidos de ajuda, serviços e muito mais
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={20} className="text-green-600" />
                    Conectar-se com vizinhos da sua região
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={20} className="text-green-600" />
                    Ganhar pontos e badges por participação
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={20} className="text-green-600" />
                    Fortalecer sua comunidade local
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 2 - Nome e Bio */}
          {step === 2 && (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={32} className="text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Como devemos te chamar?
                </h3>
                <p className="text-gray-600">
                  Seu nome será visível para outros membros da comunidade
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome completo *
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="João Silva"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bio (opcional)
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Conte um pouco sobre você..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows={3}
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {profile.bio.length}/200 caracteres
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 - Localização e Contato */}
          {step === 3 && (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin size={32} className="text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Onde você está?
                </h3>
                <p className="text-gray-600">
                  Isso ajuda a conectar você com vizinhos próximos
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bairro *
                  </label>
                  <input
                    type="text"
                    value={profile.bairro}
                    onChange={(e) => setProfile({ ...profile, bairro: e.target.value })}
                    placeholder="Centro, Jardim América..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefone (opcional)
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Será exibido apenas para usuários logados
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4 - Foto de perfil */}
          {step === 4 && (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera size={32} className="text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Adicione uma foto
                </h3>
                <p className="text-gray-600">
                  Perfis com foto recebem mais confiança da comunidade
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary-200"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-primary-600 flex items-center justify-center text-white text-5xl font-bold border-4 border-primary-200">
                      {profile.name?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}

                  <label className="absolute bottom-0 right-0 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition border-2 border-gray-200">
                    <Camera size={20} className="text-gray-700" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>

                  {uploading && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-500 text-center">
                  Formatos aceitos: JPG, PNG (máx. 2MB)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition flex items-center gap-2"
              >
                <ArrowLeft size={18} />
                Voltar
              </button>
            )}
            
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-gray-600 hover:text-gray-700 transition"
            >
              Pular
            </button>
          </div>

          <button
            onClick={nextStep}
            disabled={(step === 2 && !profile.name) || (step === 3 && !profile.bairro) || saving}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === totalSteps ? (
              saving ? 'Salvando...' : 'Concluir'
            ) : (
              <>
                Próximo
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}