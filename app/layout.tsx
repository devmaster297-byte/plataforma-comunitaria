import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Toaster from '@/components/Toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Santa Teresa ES | Portal Comunitário da Terra dos Colibris',
  description: 'Conecte-se com seus vizinhos em Santa Teresa-ES. Avisos, eventos, vagas, serviços locais e farmácias de plantão.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}