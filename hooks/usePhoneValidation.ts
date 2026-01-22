// @/hooks/usePhoneValidation.ts
import { useState, useCallback } from 'react'

export function usePhoneValidation() {
  const [phone, setPhone] = useState('')
  const [isValid, setIsValid] = useState(true)

  const formatPhone = useCallback((value: string) => {
    // Remove tudo que não é dígito
    const digits = value.replace(/\D/g, '')
    
    // Formatação brasileira: (27) 99999-9999
    let formatted = digits
    if (digits.length > 2) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}`
      if (digits.length > 7) {
        formatted += `-${digits.slice(7, 11)}`
      }
    }
    
    // Validação simples
    const isValidPhone = digits.length === 11 || digits.length === 0
    setIsValid(isValidPhone)
    
    return formatted
  }, [])

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setPhone(formatted)
  }, [formatPhone])

  return {
    phone,
    setPhone,
    isValid,
    handlePhoneChange,
    formatPhone
  }
}