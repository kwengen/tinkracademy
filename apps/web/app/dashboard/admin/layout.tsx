'use client'

import AdminSidebar from '@/components/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const sections = [
    {
      items: [
        { href: '/dashboard/admin', label: 'Oversikt' },
      ],
    },
    {
      heading: 'Innhold',
      items: [
        { href: '/dashboard/admin/artikler', label: 'Artikler' },
      ],
    },
  ]

  return (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
      <AdminSidebar sections={sections} />
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  )
}
