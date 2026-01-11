// lib/types-city.ts
// ============================================
// TIPOS MULTI-CIDADE
// ============================================

export interface City {
  id: string
  slug: string
  name: string
  state: string
  population?: number
  area_km2?: number
  
  // Customização
  primary_color: string
  secondary_color: string
  logo_url?: string
  banner_url?: string
  
  // Informações
  description?: string
  mayor_name?: string
  city_hall_address?: string
  city_hall_phone?: string
  city_hall_email?: string
  website_url?: string
  
  // Status
  is_active: boolean
  is_premium: boolean
  trial_ends_at?: string
  subscription_status: 'trial' | 'active' | 'expired' | 'cancelled'
  
  // Estatísticas
  users_count: number
  publications_count: number
  
  created_at: string
  updated_at: string
}

export interface CitySettings {
  id: string
  city_id: string
  welcome_message?: string
  about_text?: string
  contact_info?: {
    phone?: string
    email?: string
    address?: string
  }
  features: {
    publications: boolean
    comments: boolean
    events: boolean
    pharmacies: boolean
    services: boolean
    jobs: boolean
  }
  custom_categories?: Array<{
    id: string
    name: string
    icon: string
    color: string
  }>
  social_media: {
    facebook?: string
    instagram?: string
    twitter?: string
    youtube?: string
  }
  moderation: {
    auto_approve: boolean
    require_phone_verification: boolean
    min_account_age_days: number
  }
  created_at: string
  updated_at: string
}

export interface CityAdmin {
  id: string
  city_id: string
  user_id: string
  role: 'owner' | 'admin' | 'moderator'
  permissions: {
    manage_users: boolean
    manage_content: boolean
    view_analytics: boolean
    manage_settings?: boolean
    manage_billing?: boolean
  }
  created_at: string
}

export interface CityAnalytics {
  id: string
  city_id: string
  date: string
  new_users: number
  active_users: number
  new_publications: number
  total_publications: number
  comments_count: number
  reactions_count: number
  page_views: number
  created_at: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  slug: string
  description?: string
  monthly_price: number
  yearly_price: number
  max_users?: number
  max_admins: number
  max_publications_per_month?: number
  features: {
    custom_branding: boolean
    analytics: boolean
    api_access: boolean
    priority_support?: boolean
    remove_branding?: boolean
  }
  is_active: boolean
}

export interface CityWithSettings extends City {
  settings?: CitySettings
}

export interface CityStats {
  total_users: number
  active_users_today: number
  total_publications: number
  publications_this_month: number
  total_comments: number
  total_reactions: number
  growth_rate: number
}