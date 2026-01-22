// app/publicar/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Heart, 
  Briefcase, 
  TrendingUp, 
  Gift, 
  Bell,
  Image as ImageIcon,
  X,
  Upload,
  Send,
  AlertCircle
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function PublicarPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'ajuda' as 'ajuda' | 'servico' | 'vaga' | 'doacao' | 'aviso'
  })
  
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      router.push('/login')
      return
    }
    
    setUser(session.user)
    setLoading(false)
  }

  const categories = [
    { 
      id: 'ajuda', 
      name: 'Pedido de Ajuda', 
      icon: Heart, 
      color: 'from-red-500 to-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      description: 'Precisa de uma mão dos vizinhos?'
    },
    { 
      id: 'servico', 
      name: 'Serviço', 
      icon: Briefcase, 
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      description: 'Ofereça seus serviços'
    },
    { 
      id: 'vaga', 
      name: 'Vaga de Emprego', 
      icon: TrendingUp, 
      color: 'from-green-500 to-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      description: 'Divulgue oportunidades'
    },
    { 
      id: 'doacao', 
      name: 'Doação', 
      icon: Gift, 
      color: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      description: 'Doe ou receba itens'
    },
    { 
      id: 'aviso', 
      name: 'Aviso', 
      icon: Bell, 
      color: 'from-yellow-500 to-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      description: 'Informe a comunidade'
    },
  ]

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (images.length + files.length > 4) {
      setError('Máximo de 4 imagens permitidas')
      return
    }

    setImages([...images, ...files])
    
    // Criar previews
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
    setImagePreviews(imagePreviews.filter((_, i) => i !== index))
  }

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = []

    for (const image of images) {
      const fileExt = image.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}-${Math.random()}.${fileExt}`
      const filePath = `publications/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, image)

      if (uploadError) {
        console.error('Erro upload:', uploadError)
        continue
      }

      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath)

      uploadedUrls.push(publicUrl)
    }

    return uploadedUrls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      // 1. Upload de imagens (se houver)
      let imageUrls: string[] = []
      if (images.length > 0) {
        imageUrls = await uploadImages()
      }

      // 2. Criar publicação
      const { data, error: insertError } = await supabase
        .from('publications')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          images: imageUrls.length > 0 ? imageUrls : null,
          status: 'ativo',
          comments_count: 0,
          reactions_count: 0
        })
        .select()
        .single()

      if (insertError) throw insertError

      setSuccess(true)
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push(`/publicacao/${data.id}`)
      }, 2000)

    } catch (err: any) {
      setError(err.message || 'Erro ao criar publicação. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Publicado com sucesso! 🎉
          </h2>
          <p className="text-gray-600 mb-6">
            Sua publicação já está visível para toda a comunidade
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  const selectedCategory = categories.find(c => c.id === formData.category)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition mb-4"
          >
            <ArrowLeft size={20} />
            Voltar
          </Link>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Criar Publicação
          </h1>
          <p className="text-xl text-gray-600">
            Compartilhe com sua comunidade
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selecionar Categoria */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <label className="block text-lg font-bold text-gray-900 mb-4">
              1. Selecione a categoria *
            </label>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon
                const isSelected = formData.category === cat.id
                
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.id as any })}
                    className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                      isSelected 
                        ? `${cat.border} ${cat.bg} shadow-lg` 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${cat.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    <p className={`text-sm font-semibold ${isSelected ? cat.text : 'text-gray-700'}`}>
                      {cat.name}
                    </p>
                  </button>
                )
              })}
            </div>

            {selectedCategory && (
              <div className={`mt-4 p-4 ${selectedCategory.bg} rounded-lg border ${selectedCategory.border}`}>
                <p className={`text-sm ${selectedCategory.text}`}>
                  💡 {selectedCategory.description}
                </p>
              </div>
            )}
          </div>

          {/* Título */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <label className="block text-lg font-bold text-gray-900 mb-4">
              2. Título da publicação *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Preciso de ajuda para carregar móveis"
              required
              maxLength={100}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
            />
            <p className="text-sm text-gray-500 mt-2">
              {formData.title.length}/100 caracteres
            </p>
          </div>

          {/* Descrição */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <label className="block text-lg font-bold text-gray-900 mb-4">
              3. Descrição detalhada *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva os detalhes da sua publicação..."
              required
              maxLength={1000}
              rows={6}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
            <p className="text-sm text-gray-500 mt-2">
              {formData.description.length}/1000 caracteres
            </p>
          </div>

          {/* Upload de Imagens */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <label className="block text-lg font-bold text-gray-900 mb-4">
              4. Adicionar imagens (opcional)
            </label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
                disabled={images.length >= 4}
              />
              <label
                htmlFor="image-upload"
                className={`cursor-pointer ${images.length >= 4 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 font-semibold mb-2">
                  Clique para adicionar imagens
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG até 5MB ({images.length}/4 imagens)
                </p>
              </label>
            </div>

            {/* Preview das imagens */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Erro */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-500" size={24} />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-4">
            <Link
              href="/"
              className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-bold text-lg text-center"
            >
              Cancelar
            </Link>
            
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send size={20} />
                  Publicar
                </>
              )}
            </button>
          </div>

          {/* Dicas */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <AlertCircle size={20} />
              Dicas para uma boa publicação:
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>✅ Seja claro e específico no título</li>
              <li>✅ Forneça todos os detalhes importantes na descrição</li>
              <li>✅ Adicione fotos quando possível</li>
              <li>✅ Seja educado e respeitoso</li>
              <li>✅ Responda os comentários rapidamente</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  )
}
