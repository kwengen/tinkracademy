'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { ArtikkelDetalj } from '@/lib/artikler-cms'

// ── Hjelpere ──────────────────────────────────────────────────────────────────

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ── Komponent ─────────────────────────────────────────────────────────────────

export default function AdminArtiklerPage() {
  const [artikler, setArtikler]   = useState<ArtikkelDetalj[]>([])
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [feil, setFeil]           = useState<string | null>(null)
  const [nyTittel, setNyTittel]   = useState('')
  const [visNyForm, setVisNyForm] = useState(false)

  // ── Hent alle artikler ────────────────────────────────────────────────────

  const hent = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('artikler')
      .select('*')
      .order('sortering', { ascending: true })
    if (error) { setFeil(error.message); setLoading(false); return }
    setArtikler((data ?? []).map(a => ({ ...a, seksjoner: [] })))
    setLoading(false)
  }, [])

  useEffect(() => { hent() }, [hent])

  // ── Opprett ny artikkel ───────────────────────────────────────────────────

  async function opprettArtikkel() {
    if (!nyTittel.trim()) return
    setSaving(true)
    setFeil(null)

    const maxSortering = artikler.reduce((m, a) => Math.max(m, a.sortering ?? 0), 0)
    const { error } = await supabase.from('artikler').insert({
      tittel:    nyTittel.trim(),
      slug:      slugify(nyTittel.trim()),
      tier:      'gratis',
      published: false,
      sortering: maxSortering + 10,
    })

    if (error) { setFeil(error.message); setSaving(false); return }
    setNyTittel('')
    setVisNyForm(false)
    setSaving(false)
    hent()
  }

  // ── Oppdater ett felt ─────────────────────────────────────────────────────

  async function oppdater(id: string, felt: Partial<ArtikkelDetalj>) {
    const { error } = await supabase.from('artikler').update(felt).eq('id', id)
    if (error) { setFeil(error.message); return }
    setArtikler(prev => prev.map(a => a.id === id ? { ...a, ...felt } : a))
  }

  // ── Slett ─────────────────────────────────────────────────────────────────

  async function slett(id: string) {
    if (!confirm('Slette denne artikkelen? Alle seksjoner slettes også.')) return
    const { error } = await supabase.from('artikler').delete().eq('id', id)
    if (error) { setFeil(error.message); return }
    setArtikler(prev => prev.filter(a => a.id !== id))
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.375rem', fontWeight: 800, color: 'var(--clr-text)' }}>
          Artikler
        </h1>
        <button
          onClick={() => setVisNyForm(!visNyForm)}
          style={{
            background: 'var(--clr-primary)', color: 'white',
            border: 'none', borderRadius: '8px', padding: '.5rem 1rem',
            fontSize: '.875rem', fontWeight: 600, cursor: 'pointer',
          }}
        >
          + Ny artikkel
        </button>
      </div>

      {/* Ny artikkel-form */}
      {visNyForm && (
        <div style={{
          background: 'var(--clr-primary-light)', border: '1px solid var(--clr-border)',
          borderRadius: '10px', padding: '1rem', marginBottom: '1rem',
          display: 'flex', gap: '.75rem', alignItems: 'flex-end',
        }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '.8125rem', fontWeight: 600, marginBottom: '.35rem', color: 'var(--clr-text)' }}>
              Tittel
            </label>
            <input
              type="text"
              value={nyTittel}
              onChange={e => setNyTittel(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && opprettArtikkel()}
              placeholder="Artikkelens tittel…"
              style={{
                width: '100%', padding: '.5rem .75rem', fontSize: '.9375rem',
                border: '1px solid var(--clr-border)', borderRadius: '6px',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          <button
            onClick={opprettArtikkel}
            disabled={saving || !nyTittel.trim()}
            style={{
              background: 'var(--clr-primary)', color: 'white',
              border: 'none', borderRadius: '8px', padding: '.5rem 1rem',
              fontSize: '.875rem', fontWeight: 600, cursor: 'pointer',
              opacity: saving || !nyTittel.trim() ? .5 : 1,
            }}
          >
            {saving ? 'Lagrer…' : 'Opprett'}
          </button>
          <button
            onClick={() => { setVisNyForm(false); setNyTittel('') }}
            style={{
              background: 'none', border: '1px solid var(--clr-border)',
              borderRadius: '8px', padding: '.5rem .875rem',
              fontSize: '.875rem', cursor: 'pointer', color: 'var(--clr-text-secondary)',
            }}
          >
            Avbryt
          </button>
        </div>
      )}

      {feil && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '.75rem 1rem', marginBottom: '1rem', fontSize: '.875rem', color: '#991b1b' }}>
          {feil}
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--clr-text-secondary)' }}>Laster…</p>
      ) : artikler.length === 0 ? (
        <p style={{ color: 'var(--clr-text-secondary)', fontStyle: 'italic' }}>
          Ingen artikler ennå. Klikk «+ Ny artikkel» for å komme i gang.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          {artikler.map(a => (
            <div
              key={a.id}
              style={{
                background: 'white', border: '1px solid var(--clr-border)',
                borderRadius: '10px', padding: '1rem 1.25rem',
                boxShadow: 'var(--shadow-sm)',
                display: 'grid', gridTemplateColumns: '1fr auto auto auto auto',
                alignItems: 'center', gap: '1rem',
              }}
            >
              {/* Tittel + slug */}
              <div>
                <div style={{ fontWeight: 600, fontSize: '.9375rem', color: 'var(--clr-text)' }}>
                  {a.tittel}
                </div>
                <div style={{ fontSize: '.78rem', color: 'var(--clr-text-secondary)', marginTop: '.15rem' }}>
                  /{a.slug}
                </div>
              </div>

              {/* Tier-velger */}
              <select
                value={a.tier}
                onChange={e => oppdater(a.id, { tier: e.target.value as ArtikkelDetalj['tier'] })}
                style={{
                  padding: '.35rem .6rem', fontSize: '.8125rem', border: '1px solid var(--clr-border)',
                  borderRadius: '6px', background: 'white', cursor: 'pointer',
                }}
              >
                <option value="gratis">Gratis</option>
                <option value="basis">Abonnement</option>
                <option value="premium">Premium</option>
              </select>

              {/* Publisert toggle */}
              <button
                onClick={() => oppdater(a.id, { published: !a.published })}
                style={{
                  padding: '.35rem .75rem', fontSize: '.8125rem', fontWeight: 600,
                  borderRadius: '999px', border: 'none', cursor: 'pointer',
                  background: a.published ? '#dcfce7' : '#f3f4f6',
                  color:      a.published ? '#166534' : '#6b7280',
                }}
              >
                {a.published ? 'Publisert' : 'Utkast'}
              </button>

              {/* Vis-lenke */}
              <a
                href={`/artikler/${a.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '.8125rem', color: 'var(--clr-primary)', fontWeight: 500, textDecoration: 'none' }}
              >
                Vis →
              </a>

              {/* Slett */}
              <button
                onClick={() => slett(a.id)}
                style={{
                  background: 'none', border: '1px solid #fca5a5', borderRadius: '6px',
                  padding: '.35rem .6rem', fontSize: '.8125rem', color: '#dc2626', cursor: 'pointer',
                }}
              >
                Slett
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
