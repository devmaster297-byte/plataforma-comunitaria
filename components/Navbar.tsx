// @/components/Navbar.tsx - VERSÃO CORRIGIDA
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, User, Home, Bell, LogIn, Search, MessageSquare, Shield } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface NavbarProps {
  user?: any; // Ou um tipo mais específico se você tiver
}

export default function Navbar({ user }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState(3) // Exemplo
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/busca?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-green-900 text-lg">Santa Teresa</span>
              <span className="block text-xs text-gray-500">Portal Comunitário</span>
            </div>
          </Link>

          {/* Barra de Busca (Desktop) */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-8"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar na comunidade..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/farmacias"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-green-700 font-medium"
            >
              💊 Farmácias
            </Link>
            
            <Link
              href="/avisos"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-green-700 font-medium"
            >
              <Bell className="w-4 h-4" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </Link>

            <Link
              href="/explorar"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-green-700 font-medium"
            >
              <MessageSquare className="w-4 h-4" />
              Explorar
            </Link>

            <div className="h-6 w-px bg-gray-300"></div>

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário'}
                  </span>
                </div>
                
                <div className="relative group">
                  <button className="p-2 text-gray-600 hover:text-gray-900">
                    <Menu className="w-5 h-5" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      href="/perfil"
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-t-xl"
                    >
                      👤 Meu Perfil
                    </Link>
                    <Link
                      href="/minhas-postagens"
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                    >
                      📝 Minhas Postagens
                    </Link>
                    <Link
                      href="/configuracoes"
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                    >
                      ⚙️ Configurações
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-b-xl border-t border-gray-200"
                    >
                      🚪 Sair
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 text-green-700 hover:text-green-800 font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  Entrar
                </Link>
                
                <Link
                  href="/cadastro"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2 rounded-full font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-sm"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>

          {/* Menu Mobile Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Barra de Busca (Mobile) */}
        <div className="md:hidden py-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar na comunidade..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </form>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              <Link
                href="/farmacias"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl"
                onClick={() => setIsMenuOpen(false)}
              >
                💊 Farmácias de Plantão
              </Link>
              
              <Link
                href="/avisos"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl"
                onClick={() => setIsMenuOpen(false)}
              >
                <Bell className="w-5 h-5" />
                Avisos
                {notifications > 0 && (
                  <span className="ml-auto w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </Link>

              <Link
                href="/explorar"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl"
                onClick={() => setIsMenuOpen(false)}
              >
                <MessageSquare className="w-5 h-5" />
                Explorar
              </Link>

              <div className="border-t border-gray-200 pt-4 mt-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.email?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário'}
                        </p>
                        <p className="text-sm text-gray-500">Ver perfil</p>
                      </div>
                    </div>

                    <Link
                      href="/perfil"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      👤 Meu Perfil
                    </Link>

                    <Link
                      href="/minhas-postagens"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      📝 Minhas Postagens
                    </Link>

                    <Link
                      href="/configuracoes"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ⚙️ Configurações
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl w-full text-left"
                    >
                      🚪 Sair
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center gap-3 px-4 py-3 text-green-700 hover:bg-green-50 rounded-xl"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className="w-5 h-5" />
                      Entrar
                    </Link>

                    <Link
                      href="/cadastro"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Shield className="w-5 h-5" />
                      Cadastrar Gratuitamente
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}