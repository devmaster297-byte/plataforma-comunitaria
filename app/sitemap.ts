// app/sitemap.ts
import { MetadataRoute } from 'next'
import { createServerClient } from '@/lib/supabase-server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabaseServer = createServerClient()
  const { data: cities } = await supabaseServer.from('cities').select('slug')

  const cityEntries = cities?.map((city) => ({
    url: `https://plataforma-comunitaria.vercel.app/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  })) || []

  return [
    {
      url: 'https://plataforma-comunitaria.vercel.app/',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...cityEntries,
  ]
}