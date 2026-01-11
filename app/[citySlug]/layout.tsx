// app/[citySlug]/layout.tsx
export default function CityLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { citySlug: string }
}) {
  return <>{children}</>
}