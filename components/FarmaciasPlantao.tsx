'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient, FarmaciaPlantao } from '@/lib/supabase'
import { Phone, MapPin, Clock, MessageCircle } from 'lucide-react'

export default function FarmaciasPlantao() {
  const [farmacias, setFarmacias] = useState<FarmaciaPlantao[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseClient()

  useEffect(() => {
    loadFarmacias()
  }, [])

  const loadFarmacias = async () => {
    try {
      const { data, error } = await supabase
        .from('farmacias_plantao')
        .select('*')
        .eq('ativa', true)
        .order('ordem', { ascending: true })

      if (error) throw error
      setFarmacias(data || [])
    } catch (error) {
      console.error('Erro ao carregar farmácias:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDiaAtual = () => {
    const dias = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado']
    return dias[new Date().getDay()]
  }

  const formatarDiasSemana = (dias: string[]) => {
    const diasMap: Record<string, string> = {
      'domingo': 'Dom',
      'segunda': 'Seg',
      'terca': 'Ter',
      'quarta': 'Qua',
      'quinta': 'Qui',
      'sexta': 'Sex',
      'sabado': 'Sáb'
    }
    return dias.map(d => diasMap[d] || d).join(', ')
  }

  const estaDePlantaoHoje = (farmacia: FarmaciaPlantao) => {
    const hoje = getDiaAtual()
    return farmacia.dias_semana.includes(hoje)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  if (farmacias.length === 0) {
    return null
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg border-2 border-green-200 overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-3xl">💊</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Farmácias de Plantão</h3>
            <p className="text-green-100 text-sm">Atendimento essa semana</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {farmacias.map((farmacia) => {
          const plantaoHoje = estaDePlantaoHoje(farmacia)
          
          return (
            <div
              key={farmacia.id}
              className={`bg-white rounded-lg p-5 border-2 transition-all ${
                plantaoHoje
                  ? 'border-green-500 shadow-lg ring-2 ring-green-200'
                  : 'border-gray-200 shadow-md'
              }`}
            >
              {plantaoHoje && (
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    DE PLANTÃO HOJE
                  </span>
                </div>
              )}

              <h4 className="text-xl font-bold text-gray-900 mb-3">
                {farmacia.nome}
              </h4>

              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2 text-gray-700">
                  <MapPin size={18} className="flex-shrink-0 mt-0.5 text-green-600" />
                  <span className="text-sm">{farmacia.endereco}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <Clock size={18} className="flex-shrink-0 text-green-600" />
                  <span className="text-sm font-medium">
                    {farmacia.horario_inicio} às {farmacia.horario_fim}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">
                    📅 {formatarDiasSemana(farmacia.dias_semana)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                
                  href={`tel:${farmacia.telefone}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-sm shadow-md hover:shadow-lg"
                >
                  <Phone size={18} />
                  Ligar
                </a>

                {farmacia.whatsapp && (
                  
                    href={`https://wa.me/55${farmacia.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition font-semibold text-sm shadow-md hover:shadow-lg"
                  >
                    <MessageCircle size={18} />
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-green-50 px-6 py-3 border-t border-green-200">
        <p className="text-xs text-green-700 text-center">
          💡 Em caso de emergência, ligue para o SAMU: <strong>192</strong>
        </p>
      </div>
    </div>
  )
}
