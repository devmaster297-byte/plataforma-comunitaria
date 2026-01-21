import { Metadata } from 'next'
import { createSupabaseClient } from '@/lib/supabase'
import Image from 'next/image'

// [ALTA PRIORIDADE] SEO Dinâmico
export async function generateMetadata({ params }: { params: { citySlug: string } }): Promise<Metadata> {
  const city = params.citySlug.replace('-', ' ').toUpperCase();
  return {
    title: `Comunidade Local de ${city} | Avisos e Vagas`,
    description: `Fique por dentro de tudo o que acontece em ${city}. Participe da rede social oficial dos moradores.`,
  }
}

export default async function CityPage({ params }: { params: { citySlug: string } }) {
  const supabase = createSupabaseClient();
  
  // Busca dados da cidade e estatísticas
  const { data: city } = await supabase.from('cities').select('*').eq('slug', params.citySlug).single();
  const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('city_id', city?.id);
// Exemplo de como ficaria a busca de posts na Home
const { data: posts } = await supabase
  .from('posts')
  .select('*, profiles(full_name)')
  .eq('city_id', 'UUID_DE_SANTA_TERESA') // Filtra fixo por Santa Teresa
  .order('created_at', { ascending: false });
  return (
    <main className="min-w-full">
      {/* Banner Otimizado */}
      <div className="bg-gradient-to-r from-green-800 to-green-600 py-16 px-4">
  <div className="max-w-7xl mx-auto text-center">
    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
      Santa Teresa - ES
    </h1>
    <p className="text-green-50 text-xl max-w-2xl mx-auto">
      O espaço digital dos moradores da Terra dos Colibris. 
      Compartilhe avisos, encontre trabalhos e ajude os vizinhos.
    </p>
  </div>
</div>

      {/* [CRÍTICO] Contadores Condicionais */}
      <section className="py-10 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {userCount && userCount > 5 ? (
            <div>
              <p className="text-3xl font-bold text-primary-600">{userCount}</p>
              <p className="text-gray-600">Vizinhos conectados</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium text-primary-600 italic">Comunidade em crescimento</p>
              <p className="text-sm text-gray-500">Seja um dos primeiros a participar!</p>
            </div>
          )}
        </div>
      </section>

      {/* [CRÍTICO] Prova Social Mínima */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">O que dizem os vizinhos</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <p className="text-gray-600 italic">"Finalmente um lugar para saber o que acontece no bairro sem o barulho de grupos de WhatsApp."</p>
              <p className="mt-4 font-bold text-sm">— Maria S., Santa Teresa</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <p className="text-gray-600 italic">"Encontrei uma vaga de trabalho aqui na rua de trás em menos de dois dias."</p>
              <p className="mt-4 font-bold text-sm">— João P., Centro</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}