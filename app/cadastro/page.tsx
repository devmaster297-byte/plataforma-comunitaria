'use client'
import { useState, useEffect } from 'react' // Importe o useEffect
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase' 

export default function Register() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false)
  const [cities, setCities] = useState<{id: string, name: string}[]>([]) // Estado para as cidades
  const [formData, setFormData] = useState({ email: '', password: '', city_id: '' })
  const router = useRouter()
  
  const supabase = createSupabaseClient() 

  // --- BUSCA AS CIDADES DO BANCO AO CARREGAR A PÁGINA ---
  useEffect(() => {
    async function fetchCities() {
      const { data, error } = await supabase
        .from('cities')
        .select('id, name')
        .order('name')
      
      if (data) setCities(data)
      if (error) console.error("Erro ao carregar cidades:", error.message)
    }
    fetchCities()
  }, []) // O array vazio garante que rode apenas uma vez

  const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  // 1. Faz o cadastro
  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: { 
      data: { city_id: formData.city_id } 
    }
  });

  if (error) {
    alert(error.message);
    setLoading(false);
    return;
  }

  // 2. Busca o SLUG da cidade selecionada para saber para onde ir
  const { data: cityData } = await supabase
    .from('cities')
    .select('slug')
    .eq('id', formData.city_id)
    .single();

  if (cityData?.slug) {
    // 3. Redireciona para a página da cidade (ex: /santa-teresa)
    router.push(`/${cityData.slug}`);
  } else {
    // Caso falhe, manda para um dashboard padrão ou home
    router.push('/explorar');
  }
};

  // Se o cadastro deu certo, mostra mensagem de sucesso
  if (success) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 border rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Conta criada! 🎉</h2>
        <p className="text-gray-600">Verifique seu e-mail para confirmar o cadastro e acessar sua cidade.</p>
        <button onClick={() => router.push('/login')} className="mt-6 text-primary-600 font-bold underline">Ir para Login</button>
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
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <input 
          type="password" 
          placeholder="Sua senha" 
          className="w-full p-3 border rounded" 
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        
        {/* --- CAMPO DE SELEÇÃO CORRIGIDO --- */}
        <select 
          className="w-full p-3 border rounded bg-white"
          value={formData.city_id}
          onChange={(e) => setFormData({...formData, city_id: e.target.value})}
          required
        >
          <option value="">Selecione sua cidade</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>

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