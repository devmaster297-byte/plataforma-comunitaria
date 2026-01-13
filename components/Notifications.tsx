// components/Notifications.tsx
'use client'

import { useState, useEffect } from 'react'
import { Bell, X, Check, MessageCircle, Heart, User, AlertCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'
import {
  getUserNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '@/lib/supabase-helpers'
import type { NotificationWithSender } from '@/lib/types'

interface NotificationsProps {
  userId: string
}

export default function Notifications({ userId }: NotificationsProps) {
  const [notifications, setNotifications] = useState<NotificationWithSender[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userId) {
      loadNotifications()
      loadUnreadCount()
      
      // Atualizar a cada 30 segundos
      const interval = setInterval(() => {
        loadUnreadCount()
      }, 30000)
      
      return () => clearInterval(interval)
    }
  }, [userId])

  const loadNotifications = async () => {
    setLoading(true)
    const data = await getUserNotifications(userId, 20)
    setNotifications(data as NotificationWithSender[])
    setLoading(false)
  }

  const loadUnreadCount = async () => {
    const count = await getUnreadNotificationsCount(userId)
    setUnreadCount(count)
  }

  const handleMarkAsRead = async (notificationId: string) => {
    await markNotificationAsRead(notificationId)
    await loadNotifications()
    await loadUnreadCount()
  }

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead(userId)
    await loadNotifications()
    await loadUnreadCount()
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'comment':
      case 'reply':
        return <MessageCircle size={20} className="text-blue-600" />
      case 'reaction':
        return <Heart size={20} className="text-red-600" />
      case 'mention':
        return <User size={20} className="text-purple-600" />
      case 'system':
        return <AlertCircle size={20} className="text-yellow-600" />
      default:
        return <Bell size={20} className="text-gray-600" />
    }
  }

  return (
    <div className="relative">
      {/* Botão de notificações */}
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen) loadNotifications()
        }}
        className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-full transition"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown de notificações */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={20} className="text-primary-600" />
                <h3 className="font-bold text-gray-900">Notificações</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Marcar todas como lidas
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Lista de notificações */}
            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell size={48} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">Nenhuma notificação</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <Link
                        href={notification.link || '#'}
                        onClick={() => {
                          if (!notification.read) {
                            handleMarkAsRead(notification.id)
                          }
                          setIsOpen(false)
                        }}
                        className="block"
                      >
                        <div className="flex gap-3">
                          {/* Avatar ou ícone */}
                          <div className="flex-shrink-0">
                            {notification.sender?.avatar_url ? (
                              <img
                                src={notification.sender.avatar_url}
                                alt={notification.sender.name}
                                className="w-10 h-10 rounded-full"
                              />
                            ) : notification.sender ? (
                              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                                {notification.sender.name?.[0]?.toUpperCase()}
                              </div>
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                {getNotificationIcon(notification.type)}
                              </div>
                            )}
                          </div>

                          {/* Conteúdo */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {formatDistanceToNow(new Date(notification.created_at), {
                                addSuffix: true,
                                locale: ptBR
                              })}
                            </p>
                          </div>
                        </div>
                      </Link>

                      {/* Botão de marcar como lida */}
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            handleMarkAsRead(notification.id)
                          }}
                          className="mt-2 text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                        >
                          <Check size={14} />
                          Marcar como lida
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 text-center">
                <Link
                  href="/notificacoes"
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Ver todas as notificações
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}