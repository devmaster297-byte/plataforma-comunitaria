'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase' 

export default function Register() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '', name: '' })
  const router = useRouter()
  const supabase = createSupabaseClient()

  // SUBSTITUA PELO SEU UUID REAL DE SANTA TERESA
  const SANTA_TERESA_ID = 'e7e4747d-5798-4885-85f9-b04a2c34f01b'

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: { 
        data: { 
          city_id: SANTA_TERESA_ID,
          full_name: formData.name 
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      alert(error.message)
    } else {
      // Redireciona direto para a home de Santa Teresa
      router.push('/') 
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-lg bg-white">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Crie sua conta</h2>
        <p className="text-gray-500">Exclusivo para moradores de Santa Teresa - ES</p>
      </div>
      
      <form onSubmit={handleRegister} className="space-y-4">
        <input 
          type="text" 
          placeholder="Nome completo" 
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        <input 
          type="email" 
          placeholder="Seu melhor e-mail" 
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <input 
          type="password" 
          placeholder="Crie uma senha forte" 
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        
        <button 
          disabled={loading}
          className="w-full bg-green-700 text-white p-4 rounded-lg font-bold hover:bg-green-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Processando...' : 'Entrar na Comunidade'}
        </button>
      </form>
    </div>
  )
}