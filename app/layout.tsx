// app/layout.tsx
'use client'

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { useOnboarding } from '@/hooks/useOnboarding'
import Header from '@/components/Header'
import Onboarding from '@/components/Onboarding'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const { showOnboarding, loading, completeOnboarding } = useOnboarding(user?.id)
  const supabase = createSupabaseClient()

  useEffect(() => {
    setMounted(true)
    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user || null)
  }

  if (!mounted) {
    return null
  }

  return (
    <html lang="pt-BR">
      <head>
        <title>Comunidade Local - Conectando vizinhos</title>
        <meta name="description" content="Plataforma comunitária para conectar vizinhos, compartilhar serviços e fortalecer a comunidade local" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        <Header />
        
        <main className="min-h-screen">
          {children}
        </main>

        {/* Onboarding Modal */}
        {!loading && showOnboarding && user && (
          <Onboarding 
            userId={user.id} 
            onComplete={completeOnboarding}
          />
        )}

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                    C
                  </div>
                  <span className="text-white font-bold">Comunidade Local</span>
                </div>
                <p className="text-sm">
                  Conectando pessoas da sua cidade para ajudar, trabalhar e crescer juntos.
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Plataforma</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/explorar" className="hover:text-white transition">Explorar</a></li>
                  <li><a href="/como-funciona" className="hover:text-white transition">Como funciona</a></li>
                  <li><a href="/sobre" className="hover:text-white transition">Sobre nós</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Suporte</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/ajuda" className="hover:text-white transition">Central de Ajuda</a></li>
                  <li><a href="/contato" className="hover:text-white transition">Contato</a></li>
                  <li><a href="/denuncia" className="hover:text-white transition">Denunciar</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/termos" className="hover:text-white transition">Termos de Uso</a></li>
                  <li><a href="/privacidade" className="hover:text-white transition">Privacidade</a></li>
                  <li><a href="/cookies" className="hover:text-white transition">Cookies</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center text-sm">
              <p>© 2026 Comunidade Local. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}