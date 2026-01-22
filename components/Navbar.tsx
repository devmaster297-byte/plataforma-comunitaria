// @/components/Navbar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, User, Home, Bell, LogIn } from 'lucide-react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-full flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-green-900 text-lg">Santa Teresa</span>
              <span className="block text-xs text-gray-500">Portal Comunitário</span>
            </div>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-green-700 font-medium">
              Início
            </Link>
            <Link href="/avisos" className="text-gray-700 hover:text-green-700 font-medium">
              Avisos
            </Link>
            <Link href="/eventos" className="text-gray-700 hover:text-green-700 font-medium">
              Eventos
            </Link>
            <Link href="/bairros" className="text-gray-700 hover:text-green-700 font-medium">
              Bairros
            </Link>
            
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-green-700">
                <Bell className="w-5 h-5" />
              </button>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <Link 
                href="/login" 
                className="flex items-center gap-2 text-green-700 hover:text-green-800 font-medium"
              >
                <LogIn className="w-4 h-4" />
                Entrar
              </Link>
              
              <Link 
                href="/cadastro" 
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2 rounded-full font-medium hover:from-green-700 hover:to-emerald-700 transition-all"
              >
                Cadastrar
              </Link>
            </div>
          </div>

          {/* Menu Mobile Button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4">
            <div className="flex flex-col gap-3">
              <Link href="/" className="text-gray-700 hover:text-green-700 font-medium py-2">
                Início
              </Link>
              <Link href="/avisos" className="text-gray-700 hover:text-green-700 font-medium py-2">
                Avisos
              </Link>
              <Link href="/eventos" className="text-gray-700 hover:text-green-700 font-medium py-2">
                Eventos
              </Link>
              <Link href="/bairros" className="text-gray-700 hover:text-green-700 font-medium py-2">
                Bairros
              </Link>
              
              <div className="pt-3 border-t border-gray-100 space-y-3">
                <Link 
                  href="/login" 
                  className="flex items-center gap-2 text-green-700 hover:text-green-800 font-medium py-2"
                >
                  <LogIn className="w-4 h-4" />
                  Entrar
                </Link>
                
                <Link 
                  href="/cadastro" 
                  className="block bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center py-3 rounded-full font-medium hover:from-green-700 hover:to-emerald-700 transition-all"
                >
                  Cadastrar
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}