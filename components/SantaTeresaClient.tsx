'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// 1. Defina o que é um Post (ajuste os campos conforme seu banco)
interface Post {
  id: string;
  title: string;
  content?: string;
  created_at: string;
  // adicione outros campos que você usa
}

export default function SantaTeresaClient() {
  // 2. Informe ao useState que ele receberá um array de Posts
  const [posts, setPosts] = useState<Post[]>([]) 
  
   useEffect(() => {
    async function getPosts() {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('city_id', 'SEU_UUID_DE_SANTA_TERESA')
        .order('created_at', { ascending: false })
      
      // 3. O TypeScript agora entende que data pode ser mapeado para Post[]
      if (data) setPosts(data as Post[])
      if (error) console.error(error)
    }
    getPosts()
  }, [])

  return (
    <section className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold my-6 text-green-800">Últimos Avisos em Santa Teresa</h2>
      {posts.length === 0 ? (
        <p className="text-gray-500 italic">Buscando atualizações na cidade...</p>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <div key={post.id} className="p-4 border-l-4 border-green-600 bg-white rounded shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg">{post.title}</h3>
              <p className="text-sm text-gray-500">
                {new Date(post.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}