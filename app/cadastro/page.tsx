'use client'

import { useState, useEffect } from 'react' // Adicionado useEffect
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, User, MapPin, UserPlus, ArrowRight, Building2 } from 'lucide-react' // Adicionado Building2
import { createSupabaseClient } from '@/lib/supabase'

export default function CadastroPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    bairro: '',
    city_id: '' // Adicionado campo de cidade
  })
  
  const [cities, setCities] = useState<{id: string, name: string}[]>([]) // Estado para armazenar as cidades
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const router = useRouter()
  const supabase = createSupabaseClient()

  // 1. Carregar as cidades ao abrir a página
  useEffect(() => {
    async function fetchCities() {
      const { data, error } = await supabase
        .from('cities')
        .select('id, name')
        .eq('is_active', true)
        .order('name')
      
      if (data) setCities(data)
    }
    fetchCities()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    if (!formData.city_id) {
      setError('Por favor, selecione uma cidade')
      setLoading(false)
      return
    }

    try {
      // 2. Enviar city_id nos metadados (options.data)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            bairro: formData.bairro,
            city_id: formData.city_id // O Trigger no banco vai ler isso aqui
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (authError) throw authError

      if (authData.user) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/')
        }, 2000)
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  // ... (mantenha a função handleGoogleSignup e o bloco de success iguais)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* ... (Cabeçalho igual) */}

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Campo Nome */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="João Silva" required className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 transition" />
                </div>
              </div>

              {/* NOVO CAMPO: SELEÇÃO DE CIDADE */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cidade *</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <select 
                    name="city_id" 
                    value={formData.city_id} 
                    onChange={handleChange} 
                    required 
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 transition appearance-none bg-white"
                  >
                    <option value="">Selecione sua cidade</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Campo Bairro */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bairro *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} placeholder="Centro, Jardim América..." required className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 transition" />
                </div>
              </div>

              {/* ... (restante do formulário: Email, Senha, etc) */}

              <button type="submit" disabled={loading} className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <>Criar Conta Grátis <ArrowRight size={20} /></>}
              </button>
            </form>

            {/* ... (Google Login e Footer) */}
          </div>
        </div>
      </div>
    </div>
  )
}