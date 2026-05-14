'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth, ROLE_DASHBOARD } from '@/lib/auth'

export default function LoggInn() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const { signIn, role }        = useAuth()
  const router                  = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError('Feil e-post eller passord. Prøv igjen.')
    } else {
      router.push(role ? ROLE_DASHBOARD[role] : '/dashboard')
    }
  }

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/">
            <img src="/img/tinkr-academy-logo.png" alt="Tinkr Academy" style={{ height: '36px' }} />
          </Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '1.5rem', marginBottom: '.5rem' }}>Logg inn</h1>
          <p style={{ color: 'var(--clr-text-secondary)', fontSize: '.9375rem' }}>
            Logg inn med din Tinkr Academy-konto.
          </p>
        </div>

        <div style={{ background: 'white', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow-md)' }}>
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', padding: '.875rem 1rem', marginBottom: '1.25rem', color: '#b91c1c', fontSize: '.875rem' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="email" style={{ display: 'block', fontSize: '.875rem', fontWeight: 600, marginBottom: '.5rem' }}>
                E-postadresse
              </label>
              <input
                id="email" type="email" required autoComplete="email"
                placeholder="navn@kommune.no"
                value={email} onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '.75rem 1rem', border: '2px solid var(--clr-border)', borderRadius: 'var(--radius-md)', fontSize: '1rem', fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
                <label htmlFor="password" style={{ fontSize: '.875rem', fontWeight: 600 }}>Passord</label>
                <Link href="/glemt-passord" style={{ fontSize: '.8125rem', color: 'var(--clr-text-secondary)' }}>Glemt passord?</Link>
              </div>
              <input
                id="password" type="password" required autoComplete="current-password"
                placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '.75rem 1rem', border: '2px solid var(--clr-border)', borderRadius: 'var(--radius-md)', fontSize: '1rem', fontFamily: 'inherit' }}
              />
            </div>
            <button type="submit" className="btn btn--primary" style={{ width: '100%', justifyContent: 'center', padding: '.875rem' }} disabled={loading}>
              {loading ? 'Logger inn…' : 'Logg inn'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '.875rem', color: 'var(--clr-text-secondary)' }}>
          Ny bruker?{' '}
          <Link href="/registrer" style={{ fontWeight: 600 }}>Opprett konto</Link>
        </p>
      </div>
    </main>
  )
}
