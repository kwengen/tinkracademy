'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth, ROLE_LABELS } from '@/lib/auth'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, role, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.push('/logg-inn')
  }, [loading, user, router])

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--clr-text-secondary)' }}>Laster…</p>
    </div>
  )

  if (!user) return null

  const navItems = [
    { href: '/dashboard/bruker',       label: 'Min side',         roles: ['bruker','kommuneadmin','admin','superadmin'] },
    { href: '/dashboard/kommuneadmin', label: 'Min kommune',      roles: ['kommuneadmin','admin','superadmin'] },
    { href: '/dashboard/admin',        label: 'Innhold',          roles: ['admin','superadmin'] },
    { href: '/dashboard/superadmin',   label: 'Administrasjon',   roles: ['superadmin'] },
  ].filter(item => role && item.roles.includes(role))

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Dashboard-header */}
      <div style={{ background: 'var(--clr-primary-dark)', color: 'white', padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Link href="/" style={{ color: 'rgba(255,255,255,.7)', fontSize: '.875rem' }}>← Tilbake til portalen</Link>
            <div style={{ fontWeight: 700, fontSize: '1.125rem', marginTop: '.25rem' }}>
              {profile?.name ?? user.email?.split('@')[0]}
              <span style={{ marginLeft: '.75rem', fontSize: '.75rem', background: 'rgba(255,255,255,.15)', padding: '.2rem .6rem', borderRadius: '999px' }}>
                {role ? ROLE_LABELS[role] : ''}
              </span>
            </div>
          </div>
          <button
            onClick={() => signOut().then(() => router.push('/'))}
            style={{ background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', color: 'white', padding: '.5rem 1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '.875rem' }}
          >
            Logg ut
          </button>
        </div>
      </div>

      {/* Tabs */}
      {navItems.length > 1 && (
        <div style={{ background: 'white', borderBottom: '1px solid var(--clr-border)' }}>
          <div className="container" style={{ display: 'flex', gap: '0' }}>
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                style={{ padding: '1rem 1.5rem', fontSize: '.9375rem', fontWeight: 500, borderBottom: '2px solid transparent', color: 'var(--clr-text-secondary)', textDecoration: 'none' }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        {children}
      </div>
    </div>
  )
}
