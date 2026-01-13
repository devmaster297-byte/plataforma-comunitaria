// hooks/useOnboarding.ts
import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase'

export function useOnboarding(userId: string | null) {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseClient()

  useEffect(() => {
    if (userId) {
      checkOnboarding()
    } else {
      setLoading(false)
    }
  }, [userId])

  const checkOnboarding = async () => {
    if (!userId) return

    // Verificar se já completou onboarding
    const completed = localStorage.getItem(`onboarding_complete_${userId}`)
    
    if (completed) {
      setShowOnboarding(false)
      setLoading(false)
      return
    }

    // Verificar se perfil está incompleto
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, bairro')
      .eq('id', userId)
      .single()

    // Se não tem nome ou bairro, mostrar onboarding
    if (!profile?.name || !profile?.bairro) {
      setShowOnboarding(true)
    }

    setLoading(false)
  }

  const completeOnboarding = () => {
    setShowOnboarding(false)
  }

  return {
    showOnboarding,
    loading,
    completeOnboarding
  }
}