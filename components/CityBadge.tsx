// components/CityBadge.tsx
'use client'
import { Users } from 'lucide-react';
import { CheckCircle, Info } from 'lucide-react'
import type { City } from '@/lib/types-city'

interface CityBadgeProps {
  city: City
  showTooltip?: boolean
}

export default function CityBadge({ city, showTooltip = true }: CityBadgeProps) {
  const isPremium = city.subscription_status === 'active' || city.subscription_status === 'trial'
  
  if (isPremium) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
        <CheckCircle className="text-blue-600" size={16} />
        <span className="text-sm font-semibold text-blue-700">
          Verificado pela Prefeitura
        </span>
        {showTooltip && (
          <div className="group relative">
            <Info size={14} className="text-blue-400 cursor-help" />
            <div className="absolute left-0 top-6 hidden group-hover:block w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-50">
              Esta cidade possui página oficial mantida pela prefeitura
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full">
      <Users className="text-gray-400" size={16} />
      <span className="text-sm font-medium text-gray-600">
        Comunidade Livre
      </span>
      {showTooltip && (
        <div className="group relative">
          <Info size={14} className="text-gray-400 cursor-help" />
          <div className="absolute left-0 top-6 hidden group-hover:block w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-50">
            Plataforma mantida pelos cidadãos. A prefeitura pode solicitar verificação oficial.
          </div>
        </div>
      )}
    </div>
  )
}

// Componente de Watermark para versão gratuita
export function FreeVersionWatermark() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-gray-200">
        <p className="text-xs text-gray-600">
          💡 <strong>Prefeitura:</strong> Solicite verificação oficial
        </p>
        <a 
          href="/contato-prefeitura" 
          className="text-xs text-primary-600 hover:underline font-medium"
        >
          Saiba mais →
        </a>
      </div>
    </div>
  )
}