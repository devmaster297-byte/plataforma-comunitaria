'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  MapPin, 
  Calendar, 
  Award, 
  Edit3,
  Camera,
  Save,
  X,
  Mail,
  Phone,
  MessageCircle,
  Heart,
  TrendingUp,
  FileText,
  LogOut,
  Trash2
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { supabase } from '@/lib/supabase'
import type { Profile, Publication } from '@/lib/types'
import PublicationCard from '@/components/PublicationCard'

export default function PerfilPage() {
  const router = useRouter()
  
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  // Formulário de edição
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    phone: '',
    bairro: ''
  })

  // Estatísticas
  const [stats, setStats] = useState({
    publications: 0,
    comments: 0,
    reactions: 0,
    nivel: 'iniciante'
  })

  // Aba ativa
  const [activeTab, setActiveTab] = useState<'publicacoes' | 'sobre'>('publicacoes')

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      setUser(session.user)
      await loadProfile(session.user.id)
      await loadPublications(session.user.id)
      await loadStats(session.user.id)
    } catch (error) {
      console.error('Erro na autenticação:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error

      setProfile(data)
      setFormData({
        name: data.name || '',
        bio: data.bio || '',
        phone: data.phone || '',
        bairro: data.bairro || ''
      })
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    }
  }

  const loadPublications = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('publications')
        .select(`
          *,
          profiles:user_id (
            id,
            name,
            avatar_url,
            bairro,
            nivel
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPublications(data || [])
    } catch (error) {
      console.error('Erro ao carregar publicações:', error)
    }
  }

  const loadStats = async (userId: string) => {
    try {
      // Contar publicações
      const { count: pubCount } = await supabase
        .from('publications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      // Contar comentários
      const { count: commCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      // Contar reações recebidas
      const { data: pubs } = await supabase
        .from('publications')
        .select('reactions_count')
        .eq('user_id', userId)

      const totalReactions = pubs?.reduce((sum, p) => sum + (p.reactions_count || 0), 0) || 0

      setStats({
        publications: pubCount || 0,
        comments: commCount || 0,
        reactions: totalReactions,
        nivel: profile?.nivel || 'iniciante'
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    // Validar tipo e tamanho
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB')
      return
    }

    try {
      setUploadingAvatar(true)

      // Upload para Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath)

      // Atualizar perfil
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Atualizar estado local
      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null)

      alert('Avatar atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      alert('Erro ao atualizar avatar. Tente novamente.')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return

    try {
      setSaving(true)

      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          bio: formData.bio,
          phone: formData.phone,
          bairro: formData.bairro,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      await loadProfile(user.id)
      setEditMode(false)
      alert('Perfil atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
      alert('Erro ao atualizar perfil. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const getNivelInfo = (nivel: string) => {
    const niveis = {
      iniciante: { name: 'Iniciante', color: 'text-gray-600', bg: 'bg-gray-100', icon: '🌱' },
      intermediario: { name: 'Intermediário', color: 'text-blue-600', bg: 'bg-blue-100', icon: '⭐' },
      avancado: { name: 'Avançado', color: 'text-purple-600', bg: 'bg-purple-100', icon: '🏆' },
      expert: { name: 'Expert', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: '👑' }
    }
    return niveis[nivel as keyof typeof niveis] || niveis.iniciante
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Perfil não encontrado
          </h2>
          <button
            onClick={() => router.push('/')}
            className="text-primary-600 hover:underline"
          >
            Voltar para o início
          </button>
        </div>
      </div>
    )
  }

  const nivelInfo = getNivelInfo(profile.nivel)

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header com Cover e Avatar */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 h-48 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Avatar */}
          <div className="absolute -bottom-16 left-4 sm:left-8">
            <div className="relative">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary-600">
                    {profile.name?.[0]?.toUpperCase()}
                  </span>
                </div>
              )}

              {/* Botão Upload Avatar */}
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition shadow-lg"
              >
                {uploadingAvatar ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Camera size={18} className="text-white" />
                )}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Coluna Esquerda - Info do Perfil */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              {/* Nome e Nível */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {profile.name}
                </h1>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${nivelInfo.bg} ${nivelInfo.color}`}>
                  <span>{nivelInfo.icon}</span>
                  {nivelInfo.name}
                </div>
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-3 gap-3 mb-6 pb-6 border-b border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.publications}</div>
                  <div className="text-xs text-gray-600">Publicações</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.comments}</div>
                  <div className="text-xs text-gray-600">Comentários</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.reactions}</div>
                  <div className="text-xs text-gray-600">Curtidas</div>
                </div>
              </div>

              {/* Informações */}
              <div className="space-y-3 mb-6">
                {profile.bairro && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin size={18} className="text-gray-400" />
                    <span>{profile.bairro}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 text-gray-700">
                  <Mail size={18} className="text-gray-400" />
                  <span className="text-sm">{user?.email}</span>
                </div>

                {profile.phone && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone size={18} className="text-gray-400" />
                    <span>{profile.phone}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar size={18} className="text-gray-400" />
                  <span className="text-sm">
                    Membro há {formatDistanceToNow(new Date(profile.created_at), { locale: ptBR })}
                  </span>
                </div>
              </div>

              {/* Botões */}
              <div className="space-y-2">
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
                >
                  <Edit3 size={18} />
                  Editar Perfil
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
                >
                  <LogOut size={18} />
                  Sair
                </button>
              </div>
            </div>
          </div>

          {/* Coluna Direita - Conteúdo */}
          <div className="lg:col-span-2">
            {/* Modal de Edição */}
            {editMode && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Editar Perfil</h2>
                    <button
                      onClick={() => setEditMode(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Seu nome completo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                        placeholder="Conte um pouco sobre você..."
                        maxLength={500}
                      />
                      <div className="text-xs text-gray-500 text-right mt-1">
                        {formData.bio.length}/500
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="(00) 00000-0000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Bairro
                      </label>
                      <input
                        type="text"
                        value={formData.bairro}
                        onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Seu bairro"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save size={18} />
                            Salvar Alterações
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setEditMode(false)}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('publicacoes')}
                  className={`flex-1 px-6 py-4 font-semibold transition ${
                    activeTab === 'publicacoes'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FileText size={18} className="inline mr-2" />
                  Minhas Publicações ({publications.length})
                </button>

                <button
                  onClick={() => setActiveTab('sobre')}
                  className={`flex-1 px-6 py-4 font-semibold transition ${
                    activeTab === 'sobre'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <User size={18} className="inline mr-2" />
                  Sobre
                </button>
              </div>
            </div>

            {/* Conteúdo das Tabs */}
            {activeTab === 'publicacoes' ? (
              publications.length > 0 ? (
                <div className="grid gap-6">
                  {publications.map((publication) => (
                    <PublicationCard key={publication.id} publication={publication} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Nenhuma publicação ainda
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Comece a participar da comunidade criando sua primeira publicação!
                  </p>
                  <button
                    onClick={() => router.push('/publicar')}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
                  >
                    Criar Publicação
                  </button>
                </div>
              )
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Sobre Mim</h3>
                {profile.bio ? (
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">
                    Nenhuma bio adicionada ainda.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}