// components/UserProfile.tsx
'use client'

import { useState, useEffect } from 'react'
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Award, 
  TrendingUp,
  Edit2,
  Camera,
  Save,
  X
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { getUserStats, updateUserProfile, uploadAvatar } from '@/lib/supabase-helpers'
import { createSupabaseClient } from '@/lib/supabase'
import type { Profile, UserStats } from '@/lib/types'

interface UserProfileProps {
  userId: string
  isOwnProfile?: boolean
}

export default function UserProfile({ userId, isOwnProfile = false }: UserProfileProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    phone: '',
    bairro: ''
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const supabase = createSupabaseClient()

  useEffect(() => {
    loadProfile()
    loadStats()
  }, [userId])

  const loadProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (data) {
      setProfile(data)
      setEditForm({
        name: data.name || '',
        bio: data.bio || '',
        phone: data.phone || '',
        bairro: data.bairro || ''
      })
    }
  }

  const loadStats = async () => {
    const data = await getUserStats(userId)
    setStats(data)
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tamanho (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 2MB')
      return
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem')
      return
    }

    setUploading(true)
    const { url, error } = await uploadAvatar(userId, file)

    if (url) {
      await loadProfile()
    } else {
      alert('Erro ao fazer upload da imagem')
    }
    setUploading(false)
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    const { data, error } = await updateUserProfile(userId, editForm)

    if (data) {
      setProfile(data)
      setIsEditing(false)
    } else {
      alert('Erro ao salvar perfil')
    }
    setSaving(false)
  }

  const getNivelInfo = (nivel: string) => {
    switch (nivel) {
      case 'expert':
        return { label: 'Expert', color: 'bg-purple-100 text-purple-700', icon: '👑' }
      case 'avancado':
        return { label: 'Avançado', color: 'bg-blue-100 text-blue-700', icon: '⭐' }
      case 'intermediario':
        return { label: 'Intermediário', color: 'bg-green-100 text-green-700', icon: '✨' }
      default:
        return { label: 'Iniciante', color: 'bg-gray-100 text-gray-700', icon: '🌱' }
    }
  }

  if (!profile) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const nivelInfo = getNivelInfo(profile.nivel)

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header com gradiente */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 h-32"></div>

      {/* Conteúdo do perfil */}
      <div className="px-6 pb-6">
        {/* Avatar e nome */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 mb-6">
          <div className="relative">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-primary-600 flex items-center justify-center text-white text-5xl font-bold">
                {profile.name?.[0]?.toUpperCase()}
              </div>
            )}

            {isOwnProfile && !isEditing && (
              <label className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition">
                <Camera size={20} className="text-gray-700" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}

            {uploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            {isEditing ? (
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="text-3xl font-bold text-gray-900 border-2 border-gray-300 rounded-lg px-3 py-1 w-full mb-2"
                placeholder="Seu nome"
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
            )}

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${nivelInfo.color}`}>
                {nivelInfo.icon} {nivelInfo.label}
              </span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold flex items-center gap-1">
                <Award size={16} />
                {profile.pontos} pontos
              </span>
            </div>

            {isOwnProfile && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center gap-2 mx-auto sm:mx-0"
              >
                <Edit2 size={16} />
                Editar perfil
              </button>
            )}
          </div>
        </div>

        {/* Informações do perfil */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Coluna esquerda - Info básica */}
          <div className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg resize-none"
                    rows={3}
                    placeholder="Conte um pouco sobre você..."
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {editForm.bio.length}/200 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={16} className="inline mr-1" />
                    Bairro
                  </label>
                  <input
                    type="text"
                    value={editForm.bairro}
                    onChange={(e) => setEditForm({ ...editForm, bairro: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                    placeholder="Seu bairro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone size={16} className="inline mr-1" />
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save size={16} />
                    {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setEditForm({
                        name: profile.name || '',
                        bio: profile.bio || '',
                        phone: profile.phone || '',
                        bairro: profile.bairro || ''
                      })
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
                  >
                    <X size={16} />
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                {profile.bio && (
                  <div className="flex items-start gap-3">
                    <User size={20} className="text-gray-400 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">{profile.bio}</p>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-gray-400" />
                  <p className="text-gray-700">{profile.email}</p>
                </div>

                {profile.bairro && (
                  <div className="flex items-center gap-3">
                    <MapPin size={20} className="text-gray-400" />
                    <p className="text-gray-700">{profile.bairro}, {profile.cidade}</p>
                  </div>
                )}

                {profile.phone && isOwnProfile && (
                  <div className="flex items-center gap-3">
                    <Phone size={20} className="text-gray-400" />
                    <p className="text-gray-700">{profile.phone}</p>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-gray-400" />
                  <p className="text-gray-700">
                    Membro {formatDistanceToNow(new Date(profile.membro_desde), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Coluna direita - Estatísticas */}
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} className="text-primary-700" />
              <h3 className="text-lg font-bold text-primary-900">Estatísticas</h3>
            </div>

            {stats && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-primary-600">
                    {stats.publications_count}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Publicações</p>
                </div>

                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {stats.comments_count}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Comentários</p>
                </div>

                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-red-600">
                    {stats.reactions_received}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Curtidas</p>
                </div>

                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-yellow-600">
                    {stats.badges_count}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Badges</p>
                </div>
              </div>
            )}

            <div className="mt-4 p-4 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Próximo nível
                </span>
                <span className="text-sm text-gray-600">
                  {profile.pontos}/500
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min((profile.pontos / 500) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}