'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth, ROLE_DASHBOARD } from '../lib/auth'

const NAV_LINKS = [
  { href: '/kurs',      label: 'Kurs' },
  { href: '/nettverk',  label: 'Innovasjonsnettverket' },
  { href: '/om',        label: 'Om' },
]

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, profile, role, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href)

  async function handleSignOut() {
    await signOut()
    setUserMenuOpen(false)
    router.push('/')
  }

  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="brand" aria-label="Tinkr Academy forside">
          <img className="logo" src="/img/tinkr-academy-logo.png" alt="Tinkr Academy" />
        </Link>

        <nav className="site-nav" aria-label="Hovednavigasjon">
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? 'page' : undefined}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {!loading && (
            user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: 'color-mix(in oklab, var(--ink) 6%, transparent)',
                    border: '1px solid var(--ink-100)',
                    borderRadius: '999px', padding: '6px 14px 6px 6px',
                    cursor: 'pointer', fontSize: '14px', fontWeight: 600,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <span style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'var(--brand-gradient)', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 700, flexShrink: 0,
                  }}>
                    {(profile?.name ?? user.email ?? '?')[0].toUpperCase()}
                  </span>
                  <span style={{ color: 'var(--ink)' }}>{profile?.name ?? user.email?.split('@')[0]}</span>
                </button>
                {userMenuOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    background: 'var(--paper)',
                    border: '1px solid var(--ink-100)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 16px 40px rgba(26,26,34,.14)',
                    minWidth: '180px', zIndex: 100, overflow: 'hidden',
                  }}>
                    {role && (
                      <Link
                        href={ROLE_DASHBOARD[role]}
                        onClick={() => setUserMenuOpen(false)}
                        style={{ display: 'block', padding: '12px 16px', fontSize: '14px', fontWeight: 600, borderBottom: '1px solid var(--ink-100)', color: 'var(--ink)' }}
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px', fontSize: '14px', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                    >
                      Logg ut
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/logg-inn"
                style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink-700)' }}
              >
                Logg inn
              </Link>
            )
          )}

          <Link href="/kurs" className="btn nav-cta">
            Se alle kurs <span className="arrow">→</span>
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Lukk meny' : 'Åpne meny'}
            aria-expanded={mobileOpen}
            className="mobile-menu-btn"
            style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', display: 'none', flexDirection: 'column', gap: '5px' }}
          >
            <span style={{ display: 'block', width: '22px', height: '2px', background: 'var(--ink)', borderRadius: '2px' }} />
            <span style={{ display: 'block', width: '22px', height: '2px', background: 'var(--ink)', borderRadius: '2px' }} />
            <span style={{ display: 'block', width: '22px', height: '2px', background: 'var(--ink)', borderRadius: '2px' }} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div style={{ borderTop: '1px solid var(--ink-100)', background: 'var(--off-white)', padding: '12px 0' }}>
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{ display: 'block', padding: '12px var(--gutter)', fontSize: '16px', fontWeight: 500, color: 'var(--ink-700)' }}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={handleSignOut}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px var(--gutter)', fontSize: '16px', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
            >
              Logg ut
            </button>
          ) : (
            <Link href="/logg-inn" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '12px var(--gutter)', fontSize: '16px', color: 'var(--ink-700)' }}>
              Logg inn
            </Link>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 880px) {
          .site-nav { display: none !important; }
          .nav-cta { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  )
}
