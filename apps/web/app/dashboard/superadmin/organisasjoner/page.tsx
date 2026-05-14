'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Org {
  id: string
  name: string
  domain: string | null
  tier: string
  created_at: string
}

const TIER_STYLE: Record<string, { background: string; color: string }> = {
  gratis:      { background: '#f3f4f6', color: '#6b7280' },
  kommune:     { background: '#dbeafe', color: '#1d4ed8' },
  premium:     { background: '#f3e8ff', color: '#7c3aed' },
}

export default function OrganisasjonerPage() {
  const [orgs, setOrgs]       = useState<Org[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]       = useState({ name: '', domain: '', tier: 'kommune' })
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    supabase
      .from('organizations')
      .select('id,name,domain,tier,created_at')
      .order('name')
      .then(({ data }) => { setOrgs(data ?? []); setLoading(false) })
  }, [])

  async function addOrg() {
    if (!form.name.trim()) return
    setSaving(true)
    const { data } = await supabase.from('organizations').insert({
      name: form.name.trim(),
      domain: form.domain.trim() || null,
      tier: form.tier,
    }).select().single()
    if (data) setOrgs(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
    setForm({ name: '', domain: '', tier: 'kommune' })
    setShowForm(false)
    setSaving(false)
  }

  async function changeTier(id: string, tier: string) {
    await supabase.from('organizations').update({ tier }).eq('id', id)
    setOrgs(prev => prev.map(o => o.id === id ? { ...o, tier } : o))
  }

  async function deleteOrg(id: string) {
    if (!confirm('Slette denne organisasjonen? Brukere mister organisasjonstilknytning.')) return
    await supabase.from('organizations').delete().eq('id', id)
    setOrgs(prev => prev.filter(o => o.id !== id))
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '.25rem' }}>Organisasjoner</h1>
          <p style={{ color: 'var(--clr-text-secondary)', fontSize: '.875rem' }}>
            {orgs.length} kommuner og organisasjoner registrert
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{ padding: '.5rem 1rem', background: 'var(--clr-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600, fontSize: '.875rem' }}
        >
          + Ny organisasjon
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'white', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '.875rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>Ny organisasjon</h2>
          <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
            <input
              autoFocus
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Navn (f.eks. Bodø kommune)…"
              style={{ flex: 2, minWidth: '200px', padding: '.5rem .75rem', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', fontSize: '.9rem' }}
            />
            <input
              value={form.domain}
              onChange={e => setForm(p => ({ ...p, domain: e.target.value }))}
              placeholder="E-postdomene (f.eks. bodo.kommune.no)…"
              style={{ flex: 2, minWidth: '200px', padding: '.5rem .75rem', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', fontSize: '.9rem' }}
            />
            <select
              value={form.tier}
              onChange={e => setForm(p => ({ ...p, tier: e.target.value }))}
              style={{ padding: '.5rem .75rem', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', fontSize: '.9rem' }}
            >
              <option value="gratis">Gratis</option>
              <option value="kommune">Kommune</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '.5rem' }}>
            <button onClick={addOrg} disabled={saving || !form.name.trim()}
              style={{ padding: '.5rem 1rem', background: 'var(--clr-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600, fontSize: '.875rem' }}>
              Lagre
            </button>
            <button onClick={() => setShowForm(false)}
              style={{ padding: '.5rem 1rem', border: '1px solid var(--clr-border)', background: 'white', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '.875rem' }}>
              Avbryt
            </button>
          </div>
        </div>
      )}

      <div style={{ background: 'white', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--clr-text-secondary)' }}>Laster…</div>
        ) : orgs.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--clr-text-secondary)' }}>Ingen organisasjoner ennå.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Navn', 'Domene', 'Abonnement', ''].map(h => (
                  <th key={h} style={{ padding: '.75rem 1.25rem', textAlign: 'left', fontSize: '.8125rem', fontWeight: 600, color: 'var(--clr-text-secondary)', borderBottom: '1px solid var(--clr-border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orgs.map((o, i) => (
                <tr key={o.id} style={{ borderBottom: i < orgs.length - 1 ? '1px solid var(--clr-border)' : 'none' }}>
                  <td style={{ padding: '.875rem 1.25rem', fontWeight: 500 }}>{o.name}</td>
                  <td style={{ padding: '.875rem 1.25rem', fontSize: '.875rem', color: 'var(--clr-text-secondary)' }}>
                    {o.domain ?? <span style={{ fontStyle: 'italic' }}>–</span>}
                  </td>
                  <td style={{ padding: '.875rem 1.25rem' }}>
                    <select
                      value={o.tier}
                      onChange={e => changeTier(o.id, e.target.value)}
                      style={{ fontSize: '.875rem', padding: '.35rem .625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)', background: 'white', cursor: 'pointer' }}
                    >
                      <option value="gratis">Gratis</option>
                      <option value="kommune">Kommune</option>
                      <option value="premium">Premium</option>
                    </select>
                  </td>
                  <td style={{ padding: '.875rem 1.25rem' }}>
                    <button onClick={() => deleteOrg(o.id)}
                      style={{ fontSize: '.8125rem', padding: '.35rem .75rem', border: '1px solid #fca5a5', borderRadius: 'var(--radius-md)', background: 'white', color: '#ef4444', cursor: 'pointer' }}>
                      Slett
                    </button>
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
