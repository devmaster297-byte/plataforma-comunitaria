'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'

export default function Register() {
  const router = useRouter()
  const supabase = createSupabaseClient()

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    city_id: ''
  })

  const ID_SANTA_TERESA = 'e7e4747d-5798-4885-85f9-b04a2c34f01b'

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          city_id: ID_SANTA_TERESA
        }
      }
    })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 border rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          Conta criada! 🎉
        </h2>
        <p className="text-gray-600">
          Verifique seu e-mail para confirmar o cadastro.
        </p>
        <button
          onClick={() => router.push('/login')}
          className="mt-6 text-blue-600 font-bold underline"
        >
          Ir para Login
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Criar minha conta</h2>

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="email"
          placeholder="Seu e-mail"
          className="w-full p-3 border rounded"
          required
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Sua senha"
          className="w-full p-3 border rounded"
          required
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Criando...' : 'Começar agora'}
        </button>
      </form>
    </div>
  )
}
