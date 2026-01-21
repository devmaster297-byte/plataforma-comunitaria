import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

// --- PARTE 1: METADADOS (Configuração de SEO) ---
export const metadata = {
  title: 'Comunidade Santa Teresa ES | A Terra dos Colibris',
  description: 'Mural digital da primeira cidade italiana do Brasil. Avisos e vagas em Santa Teresa, ES.',
  openGraph: {
    title: 'Comunidade Santa Teresa ES',
    description: 'Conecte-se com os seus vizinhos em Santa Teresa.',
    url: 'https://plataforma-comunitaria.vercel.app',
    siteName: 'Comunidade Local',
    locale: 'pt_BR',
    type: 'website',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

// --- PARTE 2: COMPONENTE (Estrutura da Página) ---
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {/* Aqui você pode colocar elementos que aparecem em TODAS as páginas */}
        <nav className="bg-green-800 text-white p-4">
          <div className="max-w-7xl mx-auto font-bold">Comunidade Santa Teresa ES</div>
        </nav>

        {children}

        <footer className="bg-gray-100 py-8 text-center text-gray-500 text-sm">
          &copy; 2026 Comunidade Santa Teresa ES - Orgulhosamente Capixaba
        </footer>
      </body>
    </html>
  )
}