# WengenCMS – utviklerdokumentasjon

> Denne filen leses automatisk av Claude Code i alle chatter.
> Oppdater den etter hver rammeverk-sesjon.

---

## Hva er WengenCMS?

WengenCMS er et **klart-til-bruk-rammeverk** for raskt å bygge innholdsbaserte nettsider med:

- Brukerhåndtering (registrering, innlogging, profiler)
- Fire roller: `bruker`, `kommuneadmin`, `admin`, `superadmin`
- Tier-system: `gratis`, `basis`, `premium`
- Inline redigering for admin direkte på siden
- Admin-dashboard med sidebar-layout
- Én eksempel-innholdstype: **Artikler** (kopier dette mønsteret for nye typer)

Ny nettside: sett inn domeneinnhold, erstatt lorem ipsum, legg til innholdstyper.

---

## Teknisk stack

| Lag | Teknologi |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Database + Auth | Supabase (PostgreSQL + RLS + Auth) |
| Styling | CSS-variabler + klasser i `globals.css` (ingen Tailwind) |
| Monorepo | pnpm workspaces – app i `apps/web/` |
| Migrering | PowerShell-skript mot Supabase Management API |

---

## Katalogstruktur

```
WengenCMS/
├── apps/web/
│   ├── app/
│   │   ├── page.tsx               ← Forside (lorem ipsum – erstatt)
│   │   ├── layout.tsx             ← Root layout, AuthProvider, Nav, Footer
│   │   ├── globals.css            ← Hele designsystemet (ikke endre uten rammeverk-chat)
│   │   ├── artikler/
│   │   │   ├── page.tsx           ← Offentlig artikkelliste
│   │   │   └── [slug]/page.tsx    ← Artikkeldetal jsside med seksjoner
│   │   ├── logg-inn/page.tsx
│   │   ├── registrer/page.tsx
│   │   └── dashboard/
│   │       ├── layout.tsx         ← Auth-sjekk + padding
│   │       ├── bruker/page.tsx
│   │       ├── kommuneadmin/page.tsx
│   │       ├── admin/
│   │       │   ├── layout.tsx     ← AdminSidebar-wrapper
│   │       │   ├── page.tsx       ← Oversikt med statistikk
│   │       │   └── artikler/page.tsx  ← CRUD for artikler
│   │       └── superadmin/
│   │           ├── layout.tsx
│   │           ├── page.tsx
│   │           ├── brukere/page.tsx
│   │           └── organisasjoner/page.tsx
│   ├── components/
│   │   ├── Nav.tsx                ← Toppmeny (SITE_NAME + NAV_LINKS konstanter øverst)
│   │   ├── Footer.tsx             ← Bunn (SITE_NAME + SITE_TAGLINE konstanter øverst)
│   │   ├── AdminSidebar.tsx       ← Gjenbrukbar sidebar
│   │   ├── EditModeContext.tsx    ← Global redigeringsmodus-toggle
│   │   ├── InlineEdit.tsx         ← Klikk-for-å-redigere (TipTap)
│   │   └── AdminEditBar.tsx       ← Flytende admin-stripe (lenke til backend-editor)
│   └── lib/
│       ├── supabase.ts            ← Supabase-klient
│       ├── auth.tsx               ← AuthProvider + useAuth hook
│       └── artikler-cms.ts        ← Typer + fetch-funksjoner for artikler
├── supabase/
│   ├── Invoke-SupabaseSQL.ps1    ← Kjører SQL mot Supabase Management API
│   ├── kjor-alt.ps1              ← Kjører alle migrasjonsskript i riktig rekkefølge
│   ├── schema.sql                ← Kjerne: profiles, organizations, roller, trigger
│   ├── artikler.sql              ← Artikler + artikkel_seksjoner med RLS
│   └── seed-artikler.sql         ← Lorem ipsum-seed (hopp over i prod)
└── CLAUDE.md                     ← Denne filen
```

---

## Kom i gang (nytt Supabase-prosjekt)

```powershell
# 1. Kopiér miljøvariabler
cp apps/web/.env.local.example apps/web/.env.local
# Rediger .env.local med dine Supabase-verdier

# 2. Installer avhengigheter
pnpm install

# 3. Kjør migrasjon
$env:SUPABASE_TOKEN = "sbp_xxxxx"  # https://supabase.com/dashboard/account/tokens
.\supabase\kjor-alt.ps1 -ProjectRef "dittprosjektref"

# 4. Start dev-server (port 3001)
pnpm dev
```

---

## Databasetabeller

### Kjernetabeller (`schema.sql`)

| Tabell | Innhold |
|---|---|
| `profiles` | Utvider `auth.users` – name, organization_id, tier, role |
| `organizations` | Organisasjoner – name, domain, tier |

**Trigger `on_auth_user_created`:** Oppretter profil automatisk ved registrering.
Tier arves fra `organizations.tier` basert på e-postdomene.

### Eksempel-innholdstype (`artikler.sql`)

| Tabell | Innhold |
|---|---|
| `artikler` | tittel, slug, ingress, tier, published, sortering |
| `artikkel_seksjoner` | type: tekst/liste/lenker, tittel, innhold, meta JSONB, sortering |

---

## RLS-mønster for nye innholdstyper

```sql
ALTER TABLE <tabell> ENABLE ROW LEVEL SECURITY;

-- Alle kan lese publisert innhold
CREATE POLICY "<tabell>_les" ON <tabell>
  FOR SELECT USING (published = true);

-- Admin og superadmin kan gjøre alt
CREATE POLICY "<tabell>_admin" ON <tabell>
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','superadmin'))
  );

-- Grants (begge må være på plass)
GRANT SELECT ON <tabell> TO anon;
GRANT ALL    ON <tabell> TO authenticated;
```

**Viktig:** Både `GRANT` og `POLICY` må være på plass. Den ene alene er ikke nok.
Admin-policyer **må** ha `TO authenticated` for å unngå at anon-rollen prøver å slå opp i `profiles`.

---

## Rollesystem

| Rolle | Dashboard | Tilgang |
|---|---|---|
| `bruker` | `/dashboard/bruker` | Eget innhold, bruke siden |
| `kommuneadmin` | `/dashboard/kommuneadmin` | Kommunens brukere |
| `admin` | `/dashboard/admin` | All innholdsadministrasjon |
| `superadmin` | `/dashboard/superadmin` | Alt + brukere og organisasjoner |

`get_user_role()` — SECURITY DEFINER-funksjon som unngår RLS-rekursjon.

---

## Tier-system

| Tier | Tilgang |
|---|---|
| `gratis` | Grunninnhold, åpne sider |
| `basis` | Abonnement-innhold |
| `premium` | Alt innhold |

Tier settes på `profiles.tier` og arves fra `organizations.tier` ved registrering.
Betalingsløsning er **ikke inkludert** — legg til Stripe etter behov.

---

## Auth-mønster

```tsx
import { useAuth } from '@/lib/auth'
const { user, profile, role, loading, signIn, signOut } = useAuth()
```

`AuthProvider` ligger i `app/layout.tsx`.

---

## Tilpass rammeverket

### Nettstedsnavn og menyer

**Nav.tsx** og **Footer.tsx** har konstanter øverst i filen:

```tsx
// Nav.tsx
const SITE_NAME = 'WengenCMS'          // ← Endre til ditt nettstedsnavn
const NAV_LINKS = [                     // ← Legg til/fjern menypunkter
  { href: '/artikler', label: 'Artikler' },
]

// Footer.tsx
const SITE_NAME    = 'WengenCMS'
const SITE_TAGLINE = 'Et CMS-rammeverk for raskt å bygge nye nettsider.'
```

### Legg til ny innholdstype

1. Lag `lib/<type>-cms.ts` (typer + fetch-funksjoner, kopier fra `artikler-cms.ts`)
2. Lag `app/<type>/page.tsx` (offentlig liste)
3. Lag `app/<type>/[slug]/page.tsx` (offentlig detaljside)
4. Lag `app/dashboard/admin/<type>/page.tsx` (admin CRUD)
5. Oppdater `app/dashboard/admin/layout.tsx` (legg til i sidebar-seksjoner)
6. Legg til `Nav.tsx`-lenke
7. Lag `supabase/<type>.sql` (tabell + RLS + grants)
8. Legg til i `supabase/kjor-alt.ps1`

---

## Inline redigering

`EditModeContext.tsx` gir `isEditMode` + `setEditMode` til hele appen.
Toggle-knappen vises i Nav for admin/superadmin.

```tsx
import { InlineEdit } from '@/components/InlineEdit'

<InlineEdit
  table="artikler"          // Supabase-tabell
  id={a.id}                 // Rad-ID
  field="tittel"            // Kolonnenavn
  value={a.tittel}          // Nåværende verdi
  multiline                 // Valgfritt: TipTap rich editor
  tag="h1"                  // Valgfritt: HTML-element
/>
```

---

## Designsystem

Alle CSS-variabler og klasser i `apps/web/app/globals.css`.

### Nøkkelvariabler

```css
--clr-primary:        #1461A8   /* Hovedblå */
--clr-primary-dark:   #0D3D6E
--clr-primary-light:  #E8F1FA
--clr-accent:         #C94B1A   /* Oransje CTA */
--clr-text:           #1A2332
--clr-text-secondary: #4D5E75
--clr-border:         #D1DCE8
```

### CSS-regel: punktlister

`globals.css` nullstiller `list-style` på alle `ul`/`ol`. Sett alltid `listStyleType: 'disc'` eksplisitt:

```tsx
<ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
```

### Viktige CSS-klasser

```
.container      Sentrert innhold, maks 1200px
.section        Seksjonspading
.section--white Hvit bakgrunn
.btn--primary   Primærknapp
.btn--outline   Konturknapp
```

---

## DB-migrering via PowerShell

```powershell
$env:SUPABASE_TOKEN = "sbp_xxxxx"

# Kjør ett skript
.\supabase\Invoke-SupabaseSQL.ps1 -SqlFile .\supabase\artikler.sql -ProjectRef "ref"

# Kjør alle i riktig rekkefølge
.\supabase\kjor-alt.ps1 -ProjectRef "ref"
```

---

## Konvensjoner for feature-chatter

**Kan endres:**
- Filer under `app/<innholdstype>/`
- `app/page.tsx` (forside-innhold)
- `components/Nav.tsx` (kun SITE_NAME og NAV_LINKS-konstantene)
- `components/Footer.tsx` (kun SITE_NAME og SITE_TAGLINE-konstantene)
- Nye filer under `lib/` og `supabase/`

**Ikke endre uten rammeverk-chat:**
- `globals.css`
- `app/layout.tsx`
- `components/AdminSidebar.tsx`
- `components/InlineEdit.tsx`
- `components/EditModeContext.tsx`
- `components/AdminEditBar.tsx`
- `lib/auth.tsx`, `lib/supabase.ts`
- `app/dashboard/**`
- `supabase/schema.sql`, `supabase/roles.sql`
- `CLAUDE.md`
