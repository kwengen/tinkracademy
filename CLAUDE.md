# Tinkr Academy – utviklerdokumentasjon

> Denne filen leses automatisk av Claude Code i alle chatter.
> Oppdater den etter hver sesjon.

---

## Hva er Tinkr Academy?

Tinkr Academy er en kursplattform for Tinkr AS, bygget på WengenCMS-rammeverket:

- Brukerhåndtering (registrering, innlogging, profiler)
- Fire roller: `bruker`, `kommuneadmin`, `admin`, `superadmin`
- Tier-system: `gratis`, `basis`, `premium`
- Innholdstype: **Kurs** — synkronisert fra Microsoft Dynamics 365 Marketing via Power Automate
- Admin-dashboard med sidebar-layout
- Deployed på: https://tinkracademy.vercel.app
- Supabase-prosjekt: `yrojqfzyprzqsgzywkru`

---

## Teknisk stack

| Lag | Teknologi |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Database + Auth | Supabase (PostgreSQL + RLS + Auth) |
| Styling | CSS-variabler + klasser i `globals.css` (ingen Tailwind) |
| Monorepo | pnpm workspaces – app i `apps/web/` |
| Migrering | PowerShell-skript mot Supabase Management API |
| CRM-integrasjon | Microsoft Dynamics 365 Marketing → Power Automate → Supabase |

---

## Katalogstruktur

```
tinkracademy/
├── apps/web/
│   ├── app/
│   │   ├── page.tsx               ← Forside
│   │   ├── layout.tsx             ← Root layout, AuthProvider, Nav, Footer
│   │   ├── globals.css            ← Hele designsystemet (ikke endre uten rammeverk-chat)
│   │   ├── kurs/
│   │   │   ├── page.tsx           ← Offentlig kursliste
│   │   │   └── [slug]/page.tsx    ← Kursdetaljside
│   │   ├── api/
│   │   │   └── dynamics-sync/route.ts  ← Webhook fra Power Automate
│   │   ├── logg-inn/page.tsx
│   │   ├── registrer/page.tsx
│   │   └── dashboard/
│   │       ├── layout.tsx         ← Auth-sjekk + padding
│   │       ├── bruker/page.tsx
│   │       ├── kommuneadmin/page.tsx
│   │       ├── admin/
│   │       │   ├── layout.tsx     ← AdminSidebar-wrapper
│   │       │   ├── page.tsx       ← Oversikt med statistikk
│   │       │   └── kurs/page.tsx  ← CRUD for kurs
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
│       └── kurs-cms.ts            ← Typer + fetch-funksjoner for kurs
├── supabase/
│   ├── Invoke-SupabaseSQL.ps1    ← Kjører SQL mot Supabase Management API
│   ├── kjor-alt.ps1              ← Kjører alle migrasjonsskript i riktig rekkefølge
│   ├── schema.sql                ← Kjerne: profiles, organizations, roller, trigger
│   ├── kurs.sql                  ← kurs + kurs_datoer tabeller med RLS
│   └── kurs-dynamics.sql         ← dynamics_id-kolonne + utvidet kategori-constraint
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

### Kurs-tabeller (`kurs.sql` + `kurs-dynamics.sql`)

| Tabell | Innhold |
|---|---|
| `kurs` | tittel, slug, ingress, kategori, sted, datoer_tekst, max_deltakere, published, dynamics_id |
| `kurs_datoer` | kurs_id, maaned, dag, label, tid, sortering |

`dynamics_id` (TEXT UNIQUE) brukes til upsert fra Dynamics 365.

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

## Dynamics 365-integrasjon

### Arkitektur
Dynamics 365 Marketing (tinkr-sales.crm4.dynamics.com) → Power Automate → POST `/api/dynamics-sync` → Supabase upsert på `dynamics_id`

### Feltmapping

| Dynamics-felt | → Supabase-kolonne |
|---|---|
| `msevtmgt_eventid` | `dynamics_id` |
| `msevtmgt_name` | `tittel` |
| `crc65_omkurset` | `ingress` |
| `new_kursmodulinnovasjonssystemet` (FormattedValue) | `kategori` |
| `msevtmgt_eventstartdate` | `datoer_tekst` + `kurs_datoer` |
| `msevtmgt_eventenddate` | `kurs_datoer.tid` (slutt) |
| `msevtmgt_buildingname` | `sted` |
| `msevtmgt_maximumeventcapacity` | `max_deltakere` |
| `statecode` (0=aktiv) | `published` |

### Kategori-verdier (picklist)
`Introduksjon til innovasjonsledelse`, `Kultur`, `Ledelse` (→ Lederskap), `Struktur`, `Prosess`, `Ressurser`, `Strategi`

### Sikkerhet
Webhook valideres med `x-webhook-secret`-header mot `DYNAMICS_WEBHOOK_SECRET` env-variabel i Vercel.

### Power Automate-flow
- Navn: **Kursoversikt**
- Utløser: Dataverse — When a row is added, modified or deleted
- Tabell: Events, Change type: Added or Modified, Scope: Organization
- Tilkobling: **Tinkr Dynamics** (tinkr-sales.crm4.dynamics.com)

---

## Konvensjoner for feature-chatter

**Kan endres:**
- Filer under `app/kurs/`
- `app/api/dynamics-sync/route.ts`
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
