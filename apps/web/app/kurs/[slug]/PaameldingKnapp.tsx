'use client'

import { useState } from 'react'

interface Props {
  kursId: string
  dynamicsEventId: string
  kursTittel: string
}

export default function PaameldingKnapp({ kursId, dynamicsEventId, kursTittel }: Props) {
  const [open, setOpen]           = useState(false)
  const [fornavn, setFornavn]     = useState('')
  const [etternavn, setEtternavn] = useState('')
  const [epost, setEpost]         = useState('')
  const [status, setStatus]       = useState<'idle' | 'loading' | 'ok' | 'feil'>('idle')
  const [feil, setFeil]           = useState('')

  async function send(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setFeil('')

    const res = await fetch('/api/kurs-paamelding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fornavn, etternavn, epost, kurs_id: kursId, dynamics_event_id: dynamicsEventId }),
    })

    if (res.ok) {
      setStatus('ok')
    } else {
      const data = await res.json().catch(() => ({}))
      setFeil(data.error ?? 'Noe gikk galt. Prøv igjen.')
      setStatus('feil')
    }
  }

  function lukk() {
    setOpen(false)
    setStatus('idle')
    setFornavn('')
    setEtternavn('')
    setEpost('')
    setFeil('')
  }

  const inputStyle = {
    width: '100%', padding: '.75rem 1rem',
    border: '2px solid var(--clr-border)', borderRadius: '8px',
    fontSize: '1rem', fontFamily: 'inherit', boxSizing: 'border-box' as const,
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn"
        style={{ width: '100%', justifyContent: 'center', marginTop: '24px' }}
      >
        Meld deg på <span className="arrow">→</span>
      </button>

      {open && (
        <div
          onClick={e => e.target === e.currentTarget && lukk()}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div style={{
            background: 'white', borderRadius: '16px',
            padding: '2rem', width: '100%', maxWidth: '440px',
            boxShadow: '0 24px 64px rgba(0,0,0,.18)',
          }}>
            {status === 'ok' ? (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✓</div>
                <h2 style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: '.5rem' }}>Påmelding mottatt!</h2>
                <p style={{ color: 'var(--clr-text-secondary)', marginBottom: '1.5rem' }}>
                  Vi har registrert påmeldingen din til <strong>{kursTittel}</strong> og tar kontakt på {epost}.
                </p>
                <button onClick={lukk} className="btn btn--outline" style={{ width: '100%', justifyContent: 'center' }}>
                  Lukk
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Meld deg på</h2>
                    <p style={{ color: 'var(--clr-text-secondary)', fontSize: '.875rem', marginTop: '.25rem' }}>{kursTittel}</p>
                  </div>
                  <button onClick={lukk} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--clr-text-secondary)', lineHeight: 1 }}>✕</button>
                </div>

                {feil && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '.75rem 1rem', marginBottom: '1rem', fontSize: '.875rem', color: '#b91c1c' }}>
                    {feil}
                  </div>
                )}

                <form onSubmit={send} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '.875rem', fontWeight: 600, marginBottom: '.4rem' }}>Fornavn</label>
                      <input
                        type="text" required
                        value={fornavn} onChange={e => setFornavn(e.target.value)}
                        placeholder="Ola"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '.875rem', fontWeight: 600, marginBottom: '.4rem' }}>Etternavn</label>
                      <input
                        type="text" required
                        value={etternavn} onChange={e => setEtternavn(e.target.value)}
                        placeholder="Nordmann"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '.875rem', fontWeight: 600, marginBottom: '.4rem' }}>E-postadresse</label>
                    <input
                      type="email" required
                      value={epost} onChange={e => setEpost(e.target.value)}
                      placeholder="navn@kommune.no"
                      style={inputStyle}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '.25rem', opacity: status === 'loading' ? .6 : 1 }}
                  >
                    {status === 'loading' ? 'Sender…' : 'Send påmelding →'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
