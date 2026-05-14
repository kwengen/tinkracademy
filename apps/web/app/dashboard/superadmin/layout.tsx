'use client'

import AdminSidebar from '@/components/AdminSidebar'

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const sections = [
    {
      items: [
        { href: '/dashboard/superadmin', label: 'Oversikt' },
      ],
    },
    {
      heading: 'Brukere & tilgang',
      items: [
        { href: '/dashboard/superadmin/brukere',       label: 'Brukere' },
        { href: '/dashboard/superadmin/organisasjoner', label: 'Organisasjoner' },
      ],
    },
    {
      heading: 'Innhold',
      items: [
        { href: '/dashboard/admin/kurs', label: 'Kurs' },
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
