'use client'

import { useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { X, Send } from 'lucide-react'

interface Props {
  cityId: string
  userId: string
  onClose: () => void
  onSuccess: () => void
}

const CATEGORIES = [
  { id: 'Avisos', label: 'Aviso', icon: '🔔' },
  { id: 'Ajuda', label: 'Ajuda', icon: '❤️' },
  { id: 'Serviços', label: 'Serviço', icon: '💼' },
  { id: 'Vagas', label: 'Vaga', icon: '📈' },
  { id: 'Doações', label: 'Doação', icon: '🎁' },
]

export default function CreatePostModal({ cityId, userId, onClose, onSuccess }: Props) {
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Avisos')
  const [loading, setLoading] = useState(false)
  const supabase = createSupabaseClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    const { error } = await supabase.from('posts').insert({
      content,
      category,
      city_id: cityId,
      user_id: userId
    })

    if (!error) {
      setContent('')
      onSuccess()
      onClose()
    } else {
      alert('Erro ao publicar: ' + error.message)
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-lg text-gray-800">Nova Publicação</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Categoria</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    category === cat.id 
                    ? 'bg-primary-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sua mensagem</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="O que está acontecendo na cidade?"
              className="w-full h-32 p-4 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-700 transition disabled:opacity-50"
          >
            {loading ? 'Publicando...' : <><Send size={18} /> Publicar agora</>}
          </button>
        </form>
      </div>
    </div>
  )
}