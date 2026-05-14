import { supabase } from './supabase'

// ── Typer ──────────────────────────────────────────────────────────────────────

export interface KursDato {
  id:       string
  kurs_id:  string
  maaned:   string
  dag:      string
  label:    string
  tid:      string | null
  sortering: number
}

export interface Kurs {
  id:              string
  num:             string
  tittel:          string
  slug:            string
  ingress:         string | null
  kategori:        string
  sted:            string | null
  varighet:        string | null
  pris_ou:         string | null
  pris_full:       string | null
  datoer_tekst:    string | null
  intro:           string | null
  about_tekst:     string[]
  for_hvem:        string | null
  laringsutbytter: string[]
  innhold_avsnitt: string[]
  oppfolging:      string | null
  prinsipper:      string[]
  max_deltakere:   string | null
  ou_godkjent:     boolean
  published:       boolean
  sortering:       number
  dynamics_id:     string | null
  datoer:          KursDato[]
}

// ── Fetch-funksjoner ───────────────────────────────────────────────────────────

export async function fetchKurs(): Promise<Kurs[]> {
  const { data, error } = await supabase
    .from('kurs')
    .select('*')
    .eq('published', true)
    .order('sortering', { ascending: true })

  if (error) { console.error(error); return [] }
  return (data ?? []).map(k => ({ ...k, datoer: [] }))
}

export async function fetchKursBySlug(slug: string): Promise<Kurs | null> {
  const { data: kurs, error } = await supabase
    .from('kurs')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !kurs) return null

  const { data: datoer } = await supabase
    .from('kurs_datoer')
    .select('*')
    .eq('kurs_id', kurs.id)
    .order('sortering', { ascending: true })

  return { ...kurs, datoer: datoer ?? [] }
}

export async function fetchAlleKurs(): Promise<Kurs[]> {
  const { data, error } = await supabase
    .from('kurs')
    .select('*')
    .order('sortering', { ascending: true })

  if (error) { console.error(error); return [] }
  return (data ?? []).map(k => ({ ...k, datoer: [] }))
}
