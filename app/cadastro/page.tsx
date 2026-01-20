'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
// Ajuste a importação aqui:
import { createSupabaseClient } from '@/lib/supabase' 

export default function Register() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '', city_id: '' })
  const router = useRouter()
  
  // Inicialize o cliente dentro do componente:
  const supabase = createSupabaseClient() 

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: { 
        data: { city_id: formData.city_id },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      alert(error.message)
    } else {
      setSuccess(true)
      // Lógica de redirecionamento...
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Criar minha conta</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        {/* Apenas campos essenciais */}
        <input 
          type="email" 
          placeholder="Seu e-mail" 
          className="w-full p-3 border rounded" 
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <select 
          className="w-full p-3 border rounded"
          onChange={(e) => setFormData({...formData, city_id: e.target.value})}
          required
        >
          <option value="">Selecione sua cidade</option>
          {/* Mapear cidades do banco */}
        </select>
        <button 
          disabled={loading}
          className="w-full bg-primary-600 text-white p-3 rounded font-bold hover:bg-primary-700"
        >
          {loading ? 'Criando...' : 'Começar agora'}
        </button>
      </form>
    </div>
  )
}