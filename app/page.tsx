'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import PublicationCard from '@/components/PublicationCard'
import { Search } from 'lucide-react'

export default function Home() {
  const [publications, setPublications] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const supabase = createSupabaseClient()

  useEffect(() => {
    loadPublications()
  }, [category])

  const loadPublications = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('publications')
        .select('*, profiles(id, name, avatar_url)')
        .eq('status', 'ativo')
        .order('created_at', { ascending: false })
        .limit(20)

      if (category) query = query.eq('category', category)
      const { data } = await query
      setPublications(data || [])
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      let query = supabase
        .from('publications')
        .select('*, profiles(id, name, avatar_url)')
        .eq('status', 'ativo')
        .order('created_at', { ascending: false })

      if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
      if (category) query = query.eq('category', category)

      const { data } = await query
      setPublications(data || [])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Bem-vindo à sua Comunidade</h1>
          <p className="text-xl text-primary-100">Conecte-se com seus vizinhos, ofereça e encontre serviços locais</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar publicações..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
              <option value="">Todas as categorias</option>
              <option value="ajuda">Pedidos de Ajuda</option>
              <option value="servico">Serviços</option>
              <option value="vaga">Vagas</option>
              <option value="doacao">Doações</option>
              <option value="aviso">Avisos</option>
            </select>
            <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
              Buscar
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : publications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhuma publicação encontrada</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publications.map((pub) => (
              <PublicationCard key={pub.id} publication={pub} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
