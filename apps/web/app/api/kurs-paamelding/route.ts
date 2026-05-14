import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const fornavn         = (body['fornavn'] as string)?.trim()
  const etternavn       = (body['etternavn'] as string)?.trim()
  const epost           = (body['epost'] as string)?.trim().toLowerCase()
  const kursId          = body['kurs_id'] as string
  const dynamicsEventId = body['dynamics_event_id'] as string
  const organisasjon    = (body['organisasjon'] as string)?.trim() ?? ''
  const stilling        = (body['stilling'] as string)?.trim() ?? ''
  const kommentar       = (body['kommentar'] as string)?.trim() ?? ''
  const betalingsmetode = (body['betalingsmetode'] as string) === 'faktura' ? 'faktura' : 'kort'

  if (!fornavn || !etternavn || !epost || !kursId || !dynamicsEventId) {
    return NextResponse.json({ error: 'Mangler påkrevde felter' }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(epost)) {
    return NextResponse.json({ error: 'Ugyldig e-postadresse' }, { status: 400 })
  }

  const { error } = await supabase.from('kurs_paameldinger').insert({
    kurs_id:           kursId,
    dynamics_event_id: dynamicsEventId,
    fornavn,
    etternavn,
    epost,
    organisasjon,
    stilling,
    kommentar,
    betalingsmetode,
  })

  if (error) {
    console.error('Supabase insert-feil:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const paUrl = process.env.POWER_AUTOMATE_PAAMELDING_URL
  if (paUrl) {
    try {
      await fetch(paUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fornavn, etternavn, epost, organisasjon, stilling, dynamics_event_id: dynamicsEventId }),
      })
    } catch (e) {
      console.error('Power Automate-feil (ikke kritisk):', e)
    }
  }

  return NextResponse.json({ ok: true })
}
