// @/components/CreatePostModal.tsx - VERSÃO FINAL CORRIGIDA
'use client'

import { useState, useEffect } from 'react'
import { 
  X, Image, MapPin, Tag, AlertCircle, User, 
  Loader2, CheckCircle
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

// Schema de validação CORRETO
const postSchema = z.object({
  title: z.string()
    .min(5, { message: 'O título deve ter pelo menos 5 caracteres' })
    .max(100, { message: 'O título deve ter no máximo 100 caracteres' }),
  content: z.string()
    .min(10, { message: 'A descrição deve ter pelo menos 10 caracteres' })
    .max(2000, { message: 'A descrição deve ter no máximo 2000 caracteres' }),
  category: z.string().min(1, { message: 'Selecione uma categoria' }),
  neighborhood: z.string(),
  is_urgent: z.boolean(),
  contact_phone: z.string(),
  contact_email: z.string(),
  visibility: z.enum(['public', 'neighborhood', 'followers']),
})

// Tipo inferido do schema
type PostFormData = {
  title: string;
  content: string;
  category: string;
  neighborhood: string;
  is_urgent: boolean;
  contact_phone: string;
  contact_email: string;
  visibility: 'public' | 'neighborhood' | 'followers';
}

interface CreatePostModalProps {
  className?: string;
  variant?: 'button' | 'full';
  userId?: string;
  userNeighborhood?: string;
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function CreatePostModal({ 
  className = '', 
  variant = 'button',
  userId,
  userNeighborhood,
  onClose,
  onSuccess
}: CreatePostModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [neighborhoods, setNeighborhoods] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])

  const categories = [
    { value: 'avisos', label: '📢 Avisos Oficiais', color: 'bg-red-100 text-red-800' },
    { value: 'vagas', label: '💼 Vagas de Emprego', color: 'bg-blue-100 text-blue-800' },
    { value: 'servicos', label: '🛠️ Serviços Locais', color: 'bg-purple-100 text-purple-800' },
    { value: 'eventos', label: '🎉 Eventos', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'perdidos', label: '🔍 Perdidos/Achados', color: 'bg-orange-100 text-orange-800' },
    { value: 'duvidas', label: '❓ Dúvidas', color: 'bg-gray-100 text-gray-800' },
    { value: 'recomendacoes', label: '⭐ Recomendações', color: 'bg-green-100 text-green-800' },
    { value: 'reclamacoes', label: '⚠️ Reclamações', color: 'bg-pink-100 text-pink-800' },
    { value: 'vendas', label: '🏷️ Vendas/Trocas', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'saude', label: '💊 Saúde', color: 'bg-teal-100 text-teal-800' },
  ]

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      category: 'avisos',
      neighborhood: userNeighborhood || '',
      is_urgent: false,
      contact_phone: '',
      contact_email: '',
      visibility: 'public',
    }
  })

  useEffect(() => {
    if (isOpen) {
      loadNeighborhoods()
      loadPopularTags()
    }
  }, [isOpen])

  // Atualizar neighborhood quando userNeighborhood mudar
  useEffect(() => {
    if (userNeighborhood) {
      setValue('neighborhood', userNeighborhood)
    }
  }, [userNeighborhood, setValue])

  const loadNeighborhoods = async () => {
    try {
      const { data, error } = await supabase
        .from('neighborhoods')
        .select('name')
        .order('name')

      if (error) throw error

      const neighborhoodNames = data.map(n => n.name)
      setNeighborhoods(neighborhoodNames)
    } catch (error) {
      console.error('Erro ao carregar bairros:', error)
    }
  }

  const loadPopularTags = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('tags')
        .not('tags', 'is', null)
        .limit(50)

      if (error) throw error

      const allTags = data.flatMap(post => post.tags || [])
      const tagCounts = allTags.reduce((acc: Record<string, number>, tag) => {
        acc[tag] = (acc[tag] || 0) + 1
        return acc
      }, {})

      const popularTags = Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 15)
        .map(([tag]) => tag)

      setAvailableTags(popularTags)
    } catch (error) {
      console.error('Erro ao carregar tags:', error)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione uma imagem válida')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter menos de 5MB')
        return
      }

      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag)
      } else {
        if (prev.length >= 5) {
          toast.error('Máximo de 5 tags permitidas')
          return prev
        }
        return [...prev, tag]
      }
    })
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null

    try {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `post-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('posts')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('posts')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error)
      toast.error('Erro ao fazer upload da imagem')
      return null
    }
  }

  const onSubmit = async (data: PostFormData) => {
    if (!userId) {
      toast.error('Por favor, faça login para criar uma postagem')
      return
    }

    setIsSubmitting(true)
    
    try {
      const imageUrl = await uploadImage()

      const postData = {
        title: data.title,
        content: data.content,
        category: data.category,
        neighborhood: data.neighborhood || null,
        tags: selectedTags.length > 0 ? selectedTags : null,
        image_url: imageUrl,
        is_urgent: data.is_urgent,
        contact_phone: data.contact_phone || null,
        contact_email: data.contact_email || null,
        visibility: data.visibility,
        user_id: userId,
        city: 'Santa Teresa',
        likes_count: 0,
        comments_count: 0,
        views_count: 0,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('posts')
        .insert([postData])

      if (error) throw error

      toast.success('Postagem criada com sucesso!')
      
      reset()
      setImageFile(null)
      setImagePreview(null)
      setSelectedTags([])
      setIsOpen(false)
      
      if (onSuccess) onSuccess()

    } catch (error: any) {
      console.error('Erro ao criar postagem:', error)
      toast.error(error.message || 'Erro ao criar postagem. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (isSubmitting) return
    
    if (imageFile || watch('title') || watch('content')) {
      if (window.confirm('Tem certeza que deseja sair? As alterações serão perdidas.')) {
        reset()
        setImageFile(null)
        setImagePreview(null)
        setSelectedTags([])
        setIsOpen(false)
        if (onClose) onClose()
      }
    } else {
      reset()
      setImageFile(null)
      setImagePreview(null)
      setSelectedTags([])
      setIsOpen(false)
      if (onClose) onClose()
    }
  }

  if (!isOpen && variant === 'full') {
    return (
      <button
        onClick={() => setIsOpen(true)}
        disabled={!userId}
        className={`${className} w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <span className="text-lg">✏️</span>
        {userId ? 'Criar Nova Postagem' : 'Faça login para postar'}
      </button>
    )
  }

  if (!isOpen && variant === 'button') {
    return (
      <button
        onClick={() => setIsOpen(true)}
        disabled={!userId}
        className={`${className} flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <span className="text-lg">✏️</span>
        {userId ? 'Criar Postagem' : 'Login para postar'}
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
          onClick={handleClose}
        />

        {/* Modal Container */}
        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Criar Nova Postagem em Santa Teresa
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Compartilhe informações importantes com a comunidade
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Categoria */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4" />
                  Categoria *
                </label>
                <select
                  {...register('category')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>

              {/* Bairro */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4" />
                  Bairro (Opcional)
                </label>
                <div className="flex gap-2">
                  <select
                    {...register('neighborhood')}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  >
                    <option value="">Selecione um bairro</option>
                    {userNeighborhood && (
                      <option value={userNeighborhood}>🏠 {userNeighborhood} (seu bairro)</option>
                    )}
                    {neighborhoods.map((neighborhood) => (
                      <option key={neighborhood} value={neighborhood}>
                        {neighborhood}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setValue('neighborhood', '')}
                    className="px-3 border border-gray-300 rounded-xl hover:bg-gray-50"
                  >
                    Limpar
                  </button>
                </div>
              </div>

              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  {...register('title')}
                  placeholder="Ex: Interrupção de água no centro amanhã"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Conteúdo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  {...register('content')}
                  rows={4}
                  placeholder="Descreva detalhadamente o que deseja compartilhar..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
                />
                <div className="flex justify-between mt-1">
                  {errors.content ? (
                    <p className="text-red-500 text-sm">{errors.content.message}</p>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Mínimo 10 caracteres
                    </p>
                  )}
                  <span className="text-gray-500 text-sm">
                    {watch('content')?.length || 0}/2000
                  </span>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Publicando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Publicar na Comunidade
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}