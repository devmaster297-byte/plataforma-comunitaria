'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, Home, PlusCircle, User, LogOut, Shield } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'

interface NavbarProps {
  user: any
  profile?: any
}

export default function Navbar({ user, profile }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const supabase = createSupabaseClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="font-bold text-xl text-gray-800">Comunidade Local</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition">
              <Home size={20} />
              <span>Início</span>
            </Link>

            {user ? (
              <>
                <Link href="/publicar" className="flex items-center space-x-1 px-3 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition">
                  <PlusCircle size={20} />
                  <span>Publicar</span>
                </Link>

                {profile?.role === 'admin' && (
                  <Link href="/admin" className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition">
                    <Shield size={20} />
                    <span>Admin</span>
                  </Link>
                )}

                <Link href="/perfil" className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition">
                  <User size={20} />
                  <span>Perfil</span>
                </Link>

                <button onClick={handleLogout} className="flex items-center space-x-1 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition">
                  <LogOut size={20} />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition">Entrar</Link>
                <Link href="/cadastro" className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition">Cadastrar</Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md text-gray-700 hover:bg-gray-100">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100" onClick={() => setIsOpen(false)}>
              <Home size={20} />
              <span>Início</span>
            </Link>

            {user ? (
              <>
                <Link href="/publicar" className="flex items-center space-x-2 px-3 py-2 rounded-md bg-primary-600 text-white" onClick={() => setIsOpen(false)}>
                  <PlusCircle size={20} />
                  <span>Publicar</span>
                </Link>

                {profile?.role === 'admin' && (
                  <Link href="/admin" className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100" onClick={() => setIsOpen(false)}>
                    <Shield size={20} />
                    <span>Admin</span>
                  </Link>
                )}

                <Link href="/perfil" className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100" onClick={() => setIsOpen(false)}>
                  <User size={20} />
                  <span>Perfil</span>
                </Link>

                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="flex items-center space-x-2 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 w-full">
                  <LogOut size={20} />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100" onClick={() => setIsOpen(false)}>Entrar</Link>
                <Link href="/cadastro" className="block px-3 py-2 rounded-md bg-primary-600 text-white" onClick={() => setIsOpen(false)}>Cadastrar</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
