// @/app/explorar/page.tsx - CORRIGIDO
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase' // CORRIGIDO
import CreatePostModal from '@/components/CreatePostModal'

export default function ExplorarPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userId, setUserId] = useState<string | undefined>(undefined)
  const [userNeighborhood, setUserNeighborhood] = useState<string>('')

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUserId(session.user.id)
        
        // Buscar bairro do perfil se existir
        const { data: profile } = await supabase
          .from('profiles')
          .select('neighborhood')
          .eq('id', session.user.id)
          .single()
        
        if (profile?.neighborhood) {
          setUserNeighborhood(profile.neighborhood)
        }
      }
    }
    init()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-green-900 mb-6">Explorar Santa Teresa</h1>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="mb-8 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-medium"
        >
          ✏️ Criar Nova Postagem
        </button>
        
        {isModalOpen && (
          <CreatePostModal
            userId={userId}
            userNeighborhood={userNeighborhood}
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              // Recarregar posts se necessário
              setIsModalOpen(false)
            }}
          />
        )}
        
        {/* Conteúdo da página explorar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-bold text-lg mb-3">Avisos Recentes</h3>
            <p className="text-gray-600">Nenhum aviso no momento.</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-bold text-lg mb-3">Eventos</h3>
            <p className="text-gray-600">Confira os próximos eventos da cidade.</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-bold text-lg mb-3">Serviços</h3>
            <p className="text-gray-600">Encontre serviços locais.</p>
          </div>
        </div>
      </div>
    </div>
  )
}