'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  href: string
  label: string
  badge?: number
}

interface SidebarSection {
  heading?: string
  items: NavItem[]
}

interface AdminSidebarProps {
  sections: SidebarSection[]
}

export default function AdminSidebar({ sections }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <nav style={{
      width: '220px',
      flexShrink: 0,
      background: 'white',
      border: '1px solid var(--clr-border)',
      borderRadius: 'var(--radius-xl)',
      padding: '1rem 0',
      alignSelf: 'flex-start',
      position: 'sticky',
      top: '1.5rem',
    }}>
      {sections.map((section, si) => (
        <div key={si}>
          {section.heading && (
            <div style={{
              padding: '.375rem 1.25rem',
              fontSize: '.6875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '.08em',
              color: 'var(--clr-text-secondary)',
              marginTop: si > 0 ? '.75rem' : 0,
            }}>
              {section.heading}
            </div>
          )}
          {section.items.map(item => {
            const active = pathname === item.href || (item.href !== '/dashboard/admin' && item.href !== '/dashboard/superadmin' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '.5rem 1.25rem',
                  fontSize: '.9rem',
                  fontWeight: active ? 600 : 400,
                  color: active ? 'var(--clr-primary)' : 'var(--clr-text)',
                  background: active ? 'var(--clr-primary-light, #eff6ff)' : 'transparent',
                  textDecoration: 'none',
                  borderLeft: active ? '3px solid var(--clr-primary)' : '3px solid transparent',
                  transition: 'background .1s',
                }}
              >
                {item.label}
                {item.badge != null && item.badge > 0 && (
                  <span style={{
                    background: '#ef4444',
                    color: 'white',
                    fontSize: '.6875rem',
                    fontWeight: 700,
                    padding: '.1rem .4rem',
                    borderRadius: '999px',
                    minWidth: '18px',
                    textAlign: 'center',
                  }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
