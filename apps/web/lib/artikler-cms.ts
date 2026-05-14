import { supabase } from './supabase'

// ── Typer ──────────────────────────────────────────────────────────────────────

export type ArtikkelSeksjonType = 'tekst' | 'liste' | 'lenker'

export interface ArtikkelSeksjon {
  id:          string
  artikkel_id: string
  type:        ArtikkelSeksjonType
  tittel:      string | null
  innhold:     string | null
  meta:        Record<string, unknown>
  sortering:   number
  published:   boolean
}

export interface ArtikkelDetalj {
  id:         string
  tittel:     string
  slug:       string
  ingress:    string | null
  tier:       'gratis' | 'basis' | 'premium'
  published:  boolean
  sortering:  number
  created_at: string
  seksjoner:  ArtikkelSeksjon[]
}

// ── Fetch-funksjoner ───────────────────────────────────────────────────────────

export async function fetchArtikler(): Promise<ArtikkelDetalj[]> {
  const { data, error } = await supabase
    .from('artikler')
    .select('*')
    .eq('published', true)
    .order('sortering', { ascending: true })

  if (error) { console.error(error); return [] }
  return (data ?? []).map(a => ({ ...a, seksjoner: [] }))
}

export async function fetchArtikkelBySlug(slug: string): Promise<ArtikkelDetalj | null> {
  const { data: artikkel, error } = await supabase
    .from('artikler')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !artikkel) return null

  const { data: seksjoner } = await supabase
    .from('artikkel_seksjoner')
    .select('*')
    .eq('artikkel_id', artikkel.id)
    .eq('published', true)
    .order('sortering', { ascending: true })

  return { ...artikkel, seksjoner: seksjoner ?? [] }
}

export async function fetchAlleArtikler(): Promise<ArtikkelDetalj[]> {
  // For admin – henter også upubliserte
  const { data, error } = await supabase
    .from('artikler')
    .select('*')
    .order('sortering', { ascending: true })

  if (error) { console.error(error); return [] }
  return (data ?? []).map(a => ({ ...a, seksjoner: [] }))
}
