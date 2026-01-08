import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Navbar from '@/components/Navbar'
import './globals.css'

export const metadata = {
  title: 'Comunidade Local - Conecte-se com seus vizinhos',
  description: 'Plataforma comunitária para conexão entre moradores',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  let profile = null
  if (session) {
    const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
    profile = data
  }

  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <Navbar user={session?.user} profile={profile} />
        <main>{children}</main>
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-300">© 2026 Comunidade Local. Todos os direitos reservados.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
