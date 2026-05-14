import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ── Supabase-klient med service role for server-side skriving ──────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ── Kategori-mapping: Dynamics → kurs-tabellen ────────────────────────────────
const KATEGORI_MAP: Record<string, string> = {
  'Introduksjon til innovasjonsledelse': 'Introduksjon til innovasjonsledelse',
  'Kultur':    'Kultur',
  'Ledelse':   'Lederskap',
  'Struktur':  'Struktur',
  'Prosess':   'Prosess',
  'Ressurser': 'Ressurser',
  'Strategi':  'Strategi',
}

// ── Slugify ───────────────────────────────────────────────────────────────────
function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ── Datoformat: "22. apr" ─────────────────────────────────────────────────────
function formatDato(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })
}

// ── POST /api/dynamics-sync ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Valider shared secret
  const secret = req.headers.get('x-webhook-secret')
  if (secret !== process.env.DYNAMICS_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // ── Hent felter fra Dynamics-payload ────────────────────────────────────────
  const dynamicsId   = body['msevtmgt_eventid'] as string
  const tittel       = body['msevtmgt_name'] as string
  const beskrivelse  = body['crc65_omkurset'] as string | null
  const startdato    = body['msevtmgt_eventstartdate'] as string | null
  const sluttdato    = body['msevtmgt_eventenddate'] as string | null
  const kapasitet    = body['msevtmgt_maximumeventcapacity'] as number | null
  const by           = body['msevtmgt_buildingname'] as string | null
  const statecode    = body['statecode'] as number  // 0 = aktiv, 1 = inaktiv
  const dynamicsKategori = body['new_kursmodulinnovasjonssystemet'] as string | null

  if (!dynamicsId || !tittel) {
    return NextResponse.json({ error: 'Mangler påkrevde felter: msevtmgt_eventid og msevtmgt_name' }, { status: 400 })
  }

  // ── Map til kurs-tabellen ────────────────────────────────────────────────────
  const kategori = dynamicsKategori
    ? (KATEGORI_MAP[dynamicsKategori] ?? dynamicsKategori)
    : 'Lederskap'

  const datoerTekst = startdato ? formatDato(startdato) : null
  const published   = Number(statecode) === 0

  const kursData = {
    dynamics_id:  dynamicsId,
    tittel,
    slug:         slugify(tittel),
    ingress:      beskrivelse ?? null,
    kategori,
    sted:         by ?? null,
    max_deltakere: kapasitet ? `Maks ${kapasitet} deltakere` : null,
    datoer_tekst: datoerTekst,
    published,
    updated_at:   new Date().toISOString(),
  }

  // ── Upsert: oppdater eksisterende eller opprett nytt kurs ────────────────────
  const { error } = await supabase
    .from('kurs')
    .upsert(kursData, { onConflict: 'dynamics_id' })

  if (error) {
    console.error('Supabase upsert-feil:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // ── Sync datoer hvis startdato finnes ───────────────────────────────────────
  if (startdato) {
    const { data: kursRow } = await supabase
      .from('kurs')
      .select('id')
      .eq('dynamics_id', dynamicsId)
      .single()

    if (kursRow) {
      const startD = new Date(startdato)
      const datoEntry = {
        kurs_id:  kursRow.id,
        maaned:   startD.toLocaleDateString('nb-NO', { month: 'short' }),
        dag:      String(startD.getDate()),
        label:    `Kursdag 1 · ${by ?? ''}`.trim(),
        tid:      `${startD.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })}${sluttdato ? ' – ' + new Date(sluttdato).toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' }) : ''}`,
        sortering: 1,
      }

      // Slett gamle datoer og sett inn ny
      await supabase.from('kurs_datoer').delete().eq('kurs_id', kursRow.id)
      await supabase.from('kurs_datoer').insert(datoEntry)
    }
  }

  return NextResponse.json({ ok: true, slug: slugify(tittel) })
}
