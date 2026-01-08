'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import { Eye, EyeOff, Trash2, Shield, Users, FileText } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function AdminPage() {
  const [publications, setPublications] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'publicacoes' | 'usuarios'>('publicacoes')
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const supabase = createSupabaseClient()

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (profile?.role !== 'admin') {
        router.push('/')
        return
      }

      setIsAdmin(true)
      loadData()
    } catch (error) {
      console.error('Erro ao verificar permissões:', error)
      router.push('/')
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const { data: pubData } = await supabase
        .from('publications')
        .select('*, profiles(name, email)')
        .order('created_at', { ascending: false })

      setPublications(pubData || [])

      const { data: userData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      setUsers(userData || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ativo' ? 'oculto' : 'ativo'
    
    try {
      const { error } = await supabase
        .from('publications')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      
      loadData()
    } catch (error) {
      console.error('Erro ao alterar status:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta publicação?')) return

    try {
      const { error } = await supabase
        .from('publications')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      loadData()
    } catch (error) {
      console.error('Erro ao deletar:', error)
    }
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-primary-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total de Publicações</p>
                  <p className="text-2xl font-bold text-blue-900">{publications.length}</p>
                </div>
                <FileText className="text-blue-600" size={32} />
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Publicações Ativas</p>
                  <p className="text-2xl font-bold text-green-900">
                    {publications.filter(p => p.status === 'ativo').length}
                  </p>
                </div>
                <Eye className="text-green-600" size={32} />
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Total de Usuários</p>
                  <p className="text-2xl font-bold text-purple-900">{users.length}</p>
                </div>
                <Users className="text-purple-600" size={32} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('publicacoes')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition ${
                  activeTab === 'publicacoes'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Publicações
              </button>
              <button
                onClick={() => setActiveTab('usuarios')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition ${
                  activeTab === 'usuarios'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Usuários
              </button>
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : activeTab === 'publicacoes' ? (
              <div className="space-y-4">
                {publications.map((pub) => (
                  <div key={pub.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            pub.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {pub.status === 'ativo' ? 'Ativo' : 'Oculto'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(pub.created_at), {
                              addSuffix: true,
                              locale: ptBR
                            })}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{pub.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{pub.description}</p>
                        <p className="text-xs text-gray-500">
                          Por: {pub.profiles?.name} ({pub.profiles?.email})
                        </p>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleToggleStatus(pub.id, pub.status)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                          title={pub.status === 'ativo' ? 'Ocultar' : 'Mostrar'}
                        >
                          {pub.status === 'ativo' ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                        <button
                          onClick={() => handleDelete(pub.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Excluir"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <Users className="text-primary-600" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{user.name || 'Sem nome'}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Cadastrado {formatDistanceToNow(new Date(user.created_at), {
                            addSuffix: true,
                            locale: ptBR
                          })}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'Usuário'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
