'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import { User, Mail, Phone, Camera, Save, AlertCircle, CheckCircle } from 'lucide-react'

export default function PerfilPage() {
  const [profile, setProfile] = useState<any>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createSupabaseClient()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error) throw error

      setProfile(data)
      setName(data.name || '')
      setPhone(data.phone || '')
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          name,
          phone
        })
        .eq('id', session.user.id)

      if (error) throw error

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header com avatar */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <User className="text-primary-600" size={40} />
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white">{profile?.name || 'Sem nome'}</h1>
                <p className="text-primary-100">{profile?.email}</p>
                {profile?.role === 'admin' && (
                  <span className="inline-block mt-2 px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">
                    Administrador
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Informações do Perfil</h2>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="text-red-500 mr-2 flex-shrink-0" size={20} />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                <CheckCircle className="text-green-500 mr-2 flex-shrink-0" size={20} />
                <p className="text-green-700 text-sm">Perfil atualizado com sucesso!</p>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">O email não pode ser alterado</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Seu nome completo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <Save size={20} />
                  <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
                </button>
              </div>
            </form>

            {/* Informações da conta */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações da Conta</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  <span className="font-medium">ID:</span> {profile?.id}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Membro desde:</span>{' '}
                  {new Date(profile?.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Tipo de conta:</span>{' '}
                  {profile?.role === 'admin' ? 'Administrador' : 'Usuário'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
