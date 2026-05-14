'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export default function Registrer() {
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const { signUp }              = useAuth()
  const router                  = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passordene stemmer ikke overens.'); return }
    if (password.length < 8)  { setError('Passordet må være minst 8 tegn.'); return }
    setLoading(true)
    const { error } = await signUp(email, password, name)
    setLoading(false)
    if (error) {
      setError(error)
    } else {
      setSuccess(true)
    }
  }

  if (success) return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '440px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '.75rem' }}>Sjekk e-posten din</h1>
        <p style={{ color: 'var(--clr-text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
          Vi har sendt en bekreftelseslenke til <strong>{email}</strong>. Klikk på lenken for å aktivere kontoen.
        </p>
        <Link href="/logg-inn" className="btn btn--primary">Gå til innlogging</Link>
      </div>
    </main>
  )

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--clr-primary-dark)' }}>
            Omstillingsportalen
          </Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '1.5rem', marginBottom: '.5rem' }}>Opprett konto</h1>
          <p style={{ color: 'var(--clr-text-secondary)', fontSize: '.9375rem' }}>
            Bruk din kommunale e-postadresse for automatisk tilgang.
          </p>
        </div>

        <div style={{ background: 'white', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow-md)' }}>
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', padding: '.875rem 1rem', marginBottom: '1.25rem', color: '#b91c1c', fontSize: '.875rem' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {[
              { id: 'name',     label: 'Fullt navn',      type: 'text',     value: name,     set: setName,     placeholder: 'Ola Nordmann' },
              { id: 'email',    label: 'E-postadresse',   type: 'email',    value: email,    set: setEmail,    placeholder: 'navn@kommune.no' },
              { id: 'password', label: 'Passord',         type: 'password', value: password, set: setPassword, placeholder: 'Minst 8 tegn' },
              { id: 'confirm',  label: 'Bekreft passord', type: 'password', value: confirm,  set: setConfirm,  placeholder: '••••••••' },
            ].map(f => (
              <div key={f.id} style={{ marginBottom: '1.25rem' }}>
                <label htmlFor={f.id} style={{ display: 'block', fontSize: '.875rem', fontWeight: 600, marginBottom: '.5rem' }}>
                  {f.label}
                </label>
                <input
                  id={f.id} type={f.type} required
                  placeholder={f.placeholder}
                  value={f.value} onChange={e => f.set(e.target.value)}
                  style={{ width: '100%', padding: '.75rem 1rem', border: '2px solid var(--clr-border)', borderRadius: 'var(--radius-md)', fontSize: '1rem', fontFamily: 'inherit' }}
                />
              </div>
            ))}
            <button type="submit" className="btn btn--primary" style={{ width: '100%', justifyContent: 'center', padding: '.875rem', marginTop: '.25rem' }} disabled={loading}>
              {loading ? 'Oppretter konto…' : 'Opprett konto'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '.875rem', color: 'var(--clr-text-secondary)' }}>
          Har du allerede konto?{' '}
          <Link href="/logg-inn" style={{ fontWeight: 600 }}>Logg inn</Link>
        </p>
      </div>
    </main>
  )
}
