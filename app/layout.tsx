// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Plataforma Comunitária - Conectando Vizinhos',
  description: 'Conecte-se com sua comunidade local. Pedidos de ajuda, serviços, vagas, doações e muito mais.',
  keywords: 'comunidade, vizinhos, ajuda, serviços, doações, vagas, cidade',
  authors: [{ name: 'Plataforma Comunitária' }],
  openGraph: {
    title: 'Plataforma Comunitária',
    description: 'Conectando vizinhos e fortalecendo comunidades',
    type: 'website',
    locale: 'pt_BR',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
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