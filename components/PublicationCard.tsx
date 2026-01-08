'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MapPin, User, Clock } from 'lucide-react'
import { Publication } from '@/lib/supabase'

interface PublicationCardProps {
  publication: Publication
}

const categoryColors = {
  ajuda: 'bg-red-100 text-red-800',
  servico: 'bg-blue-100 text-blue-800',
  vaga: 'bg-green-100 text-green-800',
  doacao: 'bg-purple-100 text-purple-800',
  aviso: 'bg-yellow-100 text-yellow-800'
}

const categoryLabels = {
  ajuda: 'Pedido de Ajuda',
  servico: 'Serviço Local',
  vaga: 'Vaga de Emprego',
  doacao: 'Doação',
  aviso: 'Aviso Importante'
}

export default function PublicationCard({ publication }: PublicationCardProps) {
  return (
    <Link href={`/publicacao/${publication.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer">
        {publication.images && publication.images.length > 0 && (
          <div className="w-full h-48 bg-gray-200">
            <img src={publication.images[0]} alt={publication.title} className="w-full h-full object-cover" />
          </div>
        )}
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${categoryColors[publication.category]}`}>
              {categoryLabels[publication.category]}
            </span>
            <span className="flex items-center text-xs text-gray-500">
              <Clock size={14} className="mr-1" />
              {formatDistanceToNow(new Date(publication.created_at), { addSuffix: true, locale: ptBR })}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{publication.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">{publication.description}</p>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <User size={16} className="mr-1" />
              <span>{publication.profiles?.name || 'Usuário'}</span>
            </div>
            
            {publication.location && (
              <div className="flex items-center">
                <MapPin size={16} className="mr-1" />
                <span className="truncate max-w-[150px]">{publication.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
