'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth, ROLE_DASHBOARD } from '../lib/auth'

// ── Tilpass nettstedsnavnet her ───────────────────────────────────────────────
const SITE_NAME = 'WengenCMS'

// ── Legg til menypunkter her ──────────────────────────────────────────────────
// { href: '/eksempelside', label: 'Eksempelside' }
const NAV_LINKS: { href: string; label: string }[] = [
  { href: '/artikler', label: 'Artikler' },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, profile, role, loading, signOut } = useAuth()
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    setUserMenuOpen(false)
    router.push('/')
  }

  return (
    <header>
      <nav className="nav" aria-label="Hovednavigasjon">
        <div className="container">
          <div className="nav__inner">
            <Link href="/" className="nav__logo">{SITE_NAME}</Link>
            <ul className="nav__links" role="list">
              {NAV_LINKS.map(l => (
                <li key={l.href}><Link href={l.href} className="nav__link">{l.label}</Link></li>
              ))}
            </ul>
            <div className="nav__actions">
              {!loading && (
                user ? (
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '.5rem',
                        background: 'var(--clr-primary-light)', border: '1px solid var(--clr-border)',
                        borderRadius: '999px', padding: '.375rem .875rem .375rem .375rem',
                        cursor: 'pointer', fontSize: '.875rem', fontWeight: 600,
                      }}
                    >
                      <span style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        background: 'var(--clr-primary)', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '.75rem', fontWeight: 700,
                      }}>
                        {(profile?.name ?? user.email ?? '?')[0].toUpperCase()}
                      </span>
                      <span>{profile?.name ?? user.email?.split('@')[0]}</span>
                    </button>
                    {userMenuOpen && (
                      <div style={{
                        position: 'absolute', right: 0, top: 'calc(100% + .5rem)',
                        background: 'white', border: '1px solid var(--clr-border)',
                        borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
                        minWidth: '180px', zIndex: 100,
                      }}>
                        {role && (
                          <Link
                            href={ROLE_DASHBOARD[role]}
                            onClick={() => setUserMenuOpen(false)}
                            style={{ display: 'block', padding: '.75rem 1rem', fontSize: '.875rem', fontWeight: 600, borderBottom: '1px solid var(--clr-border)' }}
                          >
                            Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleSignOut}
                          style={{ display: 'block', width: '100%', textAlign: 'left', padding: '.75rem 1rem', fontSize: '.875rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          Logg ut
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/logg-inn" className="nav__login">Logg inn</Link>
                )
              )}
              <button
                className="nav__hamburger"
                aria-label={open ? 'Lukk meny' : 'Åpne meny'}
                aria-expanded={open}
                aria-controls="mobile-menu"
                onClick={() => setOpen(!open)}
              >
                <span /><span /><span />
              </button>
            </div>
          </div>
        </div>
        <div id="mobile-menu" className={`nav__mobile ${open ? 'open' : ''}`} aria-hidden={!open}>
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} className="nav__mobile-link" onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          {user ? (
            <button onClick={handleSignOut} className="nav__mobile-link" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', width: '100%' }}>
              Logg ut
            </button>
          ) : (
            <Link href="/logg-inn" className="nav__mobile-link" onClick={() => setOpen(false)}>Logg inn</Link>
          )}
        </div>
      </nav>
    </header>
  )
}
