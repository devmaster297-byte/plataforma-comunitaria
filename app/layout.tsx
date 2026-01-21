// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Comunidade Santa Teresa ES | O Mural da Terra dos Colibris',
  description: 'Acompanhe avisos, vagas de emprego, serviços e eventos em Santa Teresa, Espírito Santo. Conecte-se com os moradores da primeira cidade italiana do Brasil.',
  keywords: [
    'Santa Teresa ES', 
    'Empregos em Santa Teresa ES', 
    'Eventos Santa Teresa', 
    'Notícias Santa Teresa Espírito Santo', 
    'Mural comunitário Santa Teresa'
  ],
  authors: [{ name: 'Sua Plataforma' }],
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'Comunidade Santa Teresa ES',
    description: 'Tudo o que acontece na nossa cidade num só lugar.',
    url: 'https://suaplataforma.vercel.app', // Substitua pelo seu link da Vercel
    siteName: 'Comunidade Local',
    images: [
      {
        url: '/og-santa-teresa.jpg', // Dica: coloque uma foto bonita da cidade na pasta public
        width: 1200,
        height: 630,
        alt: 'Santa Teresa, ES - Vista da Cidade',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-gray-50 min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  )
  
}
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