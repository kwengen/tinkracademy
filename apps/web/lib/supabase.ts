import { createClient } from '@supabase/supabase-js'

// Fallback-verdier sikrer at Next.js kan bygge uten .env.local.
// Legg inn ekte verdier i apps/web/.env.local før du kjører dev/prod.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? 'https://placeholder.supabase.co'
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key'

export const supabase = createClient(url, key)
