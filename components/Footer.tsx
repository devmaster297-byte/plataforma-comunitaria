// components/Footer.tsx
import Link from 'next/link'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter,
  Linkedin,
  Youtube,
  Heart,
  ExternalLink
} from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand / About */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
                C
              </div>
              <span className="text-xl font-bold">Plataforma Comunitária</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Conectando vizinhos, fortalecendo comunidades e transformando cidades em 
              lugares melhores para viver.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <a 
                href="mailto:contato@plataformacomunitaria.com.br"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition"
              >
                <Mail size={16} />
                <span>contato@plataformacomunitaria.com.br</span>
              </a>
              
              <a 
                href="tel:+5527999999999"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition"
              >
                <Phone size={16} />
                <span>(27) 99999-9999</span>
              </a>
              
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin size={16} />
                <span>Santa Maria de Jetibá, ES - Brasil</span>
              </div>
            </div>
          </div>

          {/* Plataforma */}
          <div>
            <h3 className="font-bold text-lg mb-4">Plataforma</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/sobre" className="text-gray-400 hover:text-white transition text-sm">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/como-funciona" className="text-gray-400 hover:text-white transition text-sm">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link href="/explorar" className="text-gray-400 hover:text-white transition text-sm">
                  Explorar
                </Link>
              </li>
              <li>
                <Link href="/cadastro" className="text-gray-400 hover:text-white transition text-sm">
                  Cadastre-se Grátis
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/termos" className="text-gray-400 hover:text-white transition text-sm">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-gray-400 hover:text-white transition text-sm">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                  Cookies
                </a>
              </li>
              <li>
                <a 
                  href="https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition text-sm flex items-center gap-1"
                >
                  LGPD
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="font-bold text-lg mb-4">Suporte</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/contato" className="text-gray-400 hover:text-white transition text-sm">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/como-funciona" className="text-gray-400 hover:text-white transition text-sm">
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <a href="mailto:suporte@plataformacomunitaria.com.br" className="text-gray-400 hover:text-white transition text-sm">
                  Suporte Técnico
                </a>
              </li>
              <li>
                <a href="mailto:prefeituras@plataformacomunitaria.com.br" className="text-gray-400 hover:text-white transition text-sm">
                  Para Prefeituras
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">Siga-nos:</span>
              
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-sky-500 rounded-full flex items-center justify-center transition"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-full flex items-center justify-center transition"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>

            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>Feito com</span>
              <Heart size={16} className="text-red-500 fill-red-500 animate-pulse" />
              <span>para sua comunidade</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>
              © {currentYear} Plataforma Comunitária. Todos os direitos reservados.
            </p>
            
            <div className="flex items-center gap-4">
              <Link href="/termos" className="hover:text-gray-300 transition">
                Termos
              </Link>
              <span>•</span>
              <Link href="/privacidade" className="hover:text-gray-300 transition">
                Privacidade
              </Link>
              <span>•</span>
              <Link href="/contato" className="hover:text-gray-300 transition">
                Contato
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}