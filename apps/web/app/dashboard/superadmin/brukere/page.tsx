'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Bruker {
  id: string
  name: string | null
  role: string
  tier: string
  organization_id: string | null
}

const ROLLER = ['bruker', 'kommuneadmin', 'admin', 'superadmin']
const ROLE_LABEL: Record<string, string> = {
  superadmin: 'Superadmin', admin: 'Admin',
  kommuneadmin: 'Kommuneadmin', bruker: 'Bruker',
}

export default function BrukerePage() {
  const [brukere, setBrukere] = useState<Bruker[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState<string | null>(null)
  const [filter, setFilter]   = useState<string>('alle')
  const [search, setSearch]   = useState('')

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id,name,role,tier,organization_id')
      .order('role')
      .then(({ data }) => { setBrukere(data ?? []); setLoading(false) })
  }, [])

  async function changeRole(id: string, role: string) {
    setSaving(id)
    await supabase.from('profiles').update({ role }).eq('id', id)
    setBrukere(prev => prev.map(b => b.id === id ? { ...b, role } : b))
    setSaving(null)
  }

  const filtered = brukere.filter(b => {
    const matchRole = filter === 'alle' || b.role === filter
    const matchSearch = !search || (b.name ?? '').toLowerCase().includes(search.toLowerCase())
    return matchRole && matchSearch
  })

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '.25rem' }}>Brukere</h1>
        <p style={{ color: 'var(--clr-text-secondary)', fontSize: '.875rem' }}>
          {brukere.length} brukere totalt
        </p>
      </div>

      {/* Rolle-stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px,1fr))', gap: '.75rem', marginBottom: '1.5rem' }}>
        {ROLLER.map(r => (
          <div key={r} style={{ background: 'white', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-xl)', padding: '1rem' }}>
            <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--clr-primary)' }}>
              {brukere.filter(b => b.role === r).length}
            </div>
            <div style={{ fontSize: '.8125rem', color: 'var(--clr-text-secondary)', marginTop: '.125rem' }}>{ROLE_LABEL[r]}</div>
          </div>
        ))}
      </div>

      {/* Filter + søk */}
      <div style={{ display: 'flex', gap: '.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Søk på navn…"
          style={{ padding: '.4rem .75rem', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', fontSize: '.875rem', width: '200px' }}
        />
        {['alle', ...ROLLER].map(r => (
          <button
            key={r}
            onClick={() => setFilter(r)}
            style={{
              padding: '.375rem .75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--clr-border)',
              background: filter === r ? 'var(--clr-primary)' : 'white',
              color: filter === r ? 'white' : 'var(--clr-text)',
              fontWeight: filter === r ? 600 : 400,
              fontSize: '.8125rem',
              cursor: 'pointer',
            }}
          >
            {r === 'alle' ? 'Alle' : ROLE_LABEL[r]}
          </button>
        ))}
      </div>

      <div style={{ background: 'white', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--clr-text-secondary)' }}>Laster…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--clr-text-secondary)' }}>Ingen brukere funnet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Navn', 'Tilgangsnivå', 'Rolle', ''].map((h, i) => (
                  <th key={i} style={{ padding: '.75rem 1.25rem', textAlign: 'left', fontSize: '.8125rem', fontWeight: 600, color: 'var(--clr-text-secondary)', borderBottom: '1px solid var(--clr-border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr key={b.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--clr-border)' : 'none' }}>
                  <td style={{ padding: '.875rem 1.25rem', fontWeight: 500 }}>{b.name ?? '–'}</td>
                  <td style={{ padding: '.875rem 1.25rem' }}>
                    <span style={{ fontSize: '.75rem', padding: '.25rem .625rem', borderRadius: '999px', background: '#f3f4f6', fontWeight: 600 }}>{b.tier}</span>
                  </td>
                  <td style={{ padding: '.875rem 1.25rem' }}>
                    <select
                      value={b.role}
                      onChange={e => changeRole(b.id, e.target.value)}
                      disabled={saving === b.id}
                      style={{ fontSize: '.875rem', padding: '.375rem .625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)', background: 'white', cursor: 'pointer' }}
                    >
                      {ROLLER.map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '.875rem 1.25rem', fontSize: '.8125rem', color: 'var(--clr-text-secondary)' }}>
                    {saving === b.id ? 'Lagrer…' : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
