'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Menu, 
  X, 
  Home, 
  PlusCircle, 
  User, 
  LogOut,
  Settings,
  Heart,
  MessageCircle
} from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'
import type { Profile } from '@/lib/types'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const router = useRouter()
  const supabase = createSupabaseClient()

  useEffect(() => {
    checkUser()
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.id) {
        setUser(session.user)
        loadProfile(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setProfile(null)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user || null)
    if (session?.user?.id) {
      loadProfile(session.user.id)
    }
  }

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (data) setProfile(data)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    setIsProfileOpen(false)
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
              C
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              Comunidade Local
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition font-medium"
            >
              <Home size={20} />
              Início
            </Link>
            
            <Link 
              href="/explorar" 
              className="text-gray-600 hover:text-primary-600 transition font-medium"
            >
              Explorar
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/publicar"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold shadow-md hover:shadow-lg"
                >
                  <PlusCircle size={18} />
                  Publicar
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 hover:opacity-80 transition"
                  >
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold ring-2 ring-gray-200">
                        {profile?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </button>

                  {isProfileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsProfileOpen(false)}
                      />
                      
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 py-2">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-900">{profile?.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>

                        <div className="py-2">
                          <Link
                            href="/perfil"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                          >
                            <User size={18} />
                            Meu Perfil
                          </Link>

                          <Link
                            href="/configuracoes"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                          >
                            <Settings size={18} />
                            Configurações
                          </Link>
                        </div>

                        <div className="border-t border-gray-100 pt-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition"
                          >
                            <LogOut size={18} />
                            Sair
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-700 hover:text-primary-600 transition font-medium"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold shadow-md hover:shadow-lg"
                >
                  Cadastrar
                </Link>
              </>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Início
            </Link>
            <Link
              href="/explorar"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Explorar
            </Link>
            
            {user && (
              <Link
                href="/publicar"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold text-center"
              >
                Criar Publicação
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}