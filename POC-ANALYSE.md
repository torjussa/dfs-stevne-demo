# DFS Påmeldinger POC - Analyse

**Dato:** 2025-01-27  
**Versjon:** 1.2 (oppdatert med fokusområder)  
**Status:** Proof of Concept (Frontend-only)

> **Viktig:** Dette dokumentet er blitt gjennomgått kritisk for å sikre nøyaktighet. Noen initiale funn var feilaktige og har blitt rettet.

## Innhold

1. [Samandrag](#samandrag)
2. [Det som er implementert](#det-som-er-implementert)
3. [Det som mangler](#det-som-mangler)
4. [Eventuelle feil eller problemer](#eventuelle-feil-eller-problemer)
5. [Rekkefølge for videre utvikling](#rekkefølge-for-videre-utvikling)

---

## Samandrag

Dette er en frontend-only POC for DFS sitt påmeldingssystem (Påmeldinger). Fokuset har vore på å implementere kjernefunksjonaliteten for påmelding til stevner, møter og kurs med valg av tidspunkter (tidsluker og skiver).

**Vurdering:** POC-en dekker grunnleggende funksjonalitet og viser godt fundament for påmelding, men manglar fleire kritiske funksjonar som er spesifisert i kravspesifikasjonen.

### 🎯 Viktigste fokusområder

**Prioritert fokus for videre utvikling:**

1. **Påmelding til stevner** - Fullføre påmeldingsflyten med reservasjonssystem og tidsluke-valg
2. **Opprette stevne** - Admin-grensesnitt for å opprette og administrere stevner
3. **Innmelding med forsikring** - Medlemsregistrering og forsikringsbehandling

Disse tre områdene skal ha høyest prioritet da de utgjør kjernen i DFS sitt påmeldingssystem.

---

## Det som er implementert

### ✅ Grunnleggende arkitektur og teknisk infrastruktur

- Next.js 14+ med App Router
- TypeScript for type safety
- shadcn/ui components for moderne UI
- Tailwind CSS for styling
- React Context for state management (AuthContext)
- Mock data og services (lib/mock-data.ts, lib/data.ts)

### ✅ Autentisering og autorisering

- Demo-login system med rolle-basert tilgang (medlem, skytterlagsleder, admin)
- Role-based access control i AuthContext
- Brukarinformasjon inkludert medlemsklasse (baseClass)
- Mulighet for å bytte rolle ved login

### ✅ Arrangementsoversikt

- Dashboard med oversikt over arrangementer (`app/page.tsx`)
- Liste over alle arrangementer (`app/events/page.tsx`)
- Filtrering og søk av arrangementer
- Kartvisning av arrangementer (`components/event-map.tsx`)
- Støtte for tre arrangementstyper:
  - **Stevner** med tidsluker og skiver
  - **Møter** med agenda og møtetype
  - **Kurs** med instruktør, forutsetninger, maks deltakere

### ✅ Konkurranse-specifikk funksjonalitet (Stevner)

- Detaljvisning av enkelt stevne (`app/competition/[id]/page.tsx`)
- Tidsluke-booking system med:
  - Visualisering av tidsluker per skive
  - Støtte for flere dager
  - Klasse-restriksjoner på tidsluker (allowedClasses)
  - Låst/åpen status for tidsluker
  - Booking av enkelt tidsluke
  - Multi-select booking av flere tidsluker samtidig (ekstra funksjonalitet, ikke eksplisitt krav)

### ✅ Booking dialog

- `components/booking-dialog.tsx` med:
  - Visning av stevne-info (skive, tid, dato)
  - Klasse-valg basert på brukerens status
  - Reservasjon for seg selv
  - Reservasjon for venn/lagmedlem
  - Fakturering og betalingsvelger
  - Loading states og success feedback

### ✅ Admin-funksjonalitet

- Admin dashboard (`app/admin/page.tsx`)
- Administrasjon av stevner (`components/admin/competition-list.tsx`)
- Opprettelsesdialog for stevner (`components/admin/create-competition-dialog.tsx`)
- Stevne-wizard med templates (`app/create-event/page.tsx`):
  - Tidligere events-kopi
  - Template-valg
  - Event-informasjon
  - Event-innstillinger
  - Disiplin-konfigurasjon
  - Forhåndsvisning

### ✅ Bruker-oversikter

- "Mine påmeldinger" (`app/my-registrations/page.tsx`)
- Profil-side (`app/profile/page.tsx`)
- Notifikasjoner (`app/notifications/page.tsx`)

### ✅ UI/UX komponenter

- Sidebar-navigasjon (`components/app-sidebar.tsx`)
- Responsive layout
- Filtrering og søk
- Status-badges (åpen, full, stengt)
- Loading states
- Success/error feedback
- Norsk språk i grensesnittet

---

## Det som mangler

### 🔴 Kritiske mangler (må ha for MVP)

#### 1. Tidsluke-reservasjon system

**Krav fra docs:** "Reservasjon av skive varer i 10 minutter, før skive låses opp igjen" (ref: `docs/ssa-k_bilag_2024.html` L8757)

**Status:** ❌ Ikke implementert

**Detaljer:**

- Reservasjonen skal ha en timeout på 10 minutter
- Tidsluka skal låses for andre brukere når noen starter reservasjon
- Dersom booking ikke fullføres innen 10 min, skal tidsluka frigis automatisk

**Implementasjon behov:**

```typescript
// Pseudo-kode
interface TimeSlotReservation {
  slotId: string;
  userId: string;
  reservedAt: Date;
  expiresAt: Date; // reservedAt + 10 minutes
}
```

#### 2. Offentlig påmeldingsliste

**Krav fra docs:** "Påmeldingslisten skal være synlig for alle, inkludert de som ikke er innlogget" (ref: `docs/ssa-k_bilag_2024.html` L8584)

**Status:** ❌ Ikke implementert

**Det som mangler:**

- Påmeldingsliste vises kun for innloggede brukere (AuthHeader blocker ikke-innloggede)
- Trenger bedre visning av hvem som er påmeldt hvor (skive og tidspunkt)
- Bør kunne vise booking-status uten å være innlogget

#### 3. Påmelding uten tidsluke-valg

**Krav fra docs:** "Påmelding til et kurs, møte eller stevne uten å velge et spesifikt tidspunkt" (ref: `docs/ssa-k_bilag_2024.html` – møte/kurs uten tidsluker omtales i samme kapittel som påmeldingsflyt rundt L8616–L8633)

**Status:** ❌ Ikke implementert

**Detaljer:**

- For møter og kurs skal medlemmer kunne melde seg på uten å velge tid
- Kun stevner har tidsluke-system i dag
- Møter og kurs har `totalSlots` men ingen tidsluker

**Implementasjon behov:**

- Forskjellig booking-flow for stevner vs møter/kurs
- Enkel "Meld på" knapp for møter og kurs

#### 4. Bekreftelse og notifikasjoner

**Krav fra docs:** "Varsling via portaler, rapporter eller e-post" (ref: `docs/540-2025-Skykontoret forhandlingsmøte 2[34].html` L3954)

**Status:** ❌ Ikke implementert

**Det som mangler:**

- E-post bekreftelse ved påmelding
- Notifikasjoner for kommende arrangement
- Varsler ved endringer i stevne (avlysning, tidsendring, etc.)

#### 5. Klasse-restriksjoner per tidsluke

**Krav fra docs:** "Mulighet for å reservere lag kun for utvalgte klasser. Slik at f.eks. de 4 siste lagene på Landsskytterstevnet er reservert for klasse 3,4,5 og EJ" (ref: `docs/ssa-k_bilag_2024.html` L8785–L8786)

**Status:** ⚠️ Delvis implementert

**Det som er der:**

- `allowedClasses` felt i TimeSlot type
- `getAllowedClassesForTime()` utility funksjon

**Det som mangler:**

- Visuell indikasjon i UI når en tidsluke har klasse-restriksjoner
- Sjekk at brukerens klasse er i allowedClasses før booking tillates
- Admin-grensesnitt for å sette klasse-restriksjoner

#### 6. Voucher/kode system

**Krav fra docs:** "Voucher kode for å selge plass hvis man vet at man ikke får delta" (ref: `docs/ssa-k_bilag_2024.html` L8790)

**Status:** ❌ Ikke implementert

**Detaljer:**

- Medlemmer skal kunne generere en voucher-kode for sitt påmeldte tidsluke
- Andre medlemmer kan bruke voucher-koden til å "overta" tidsluka
- Administrator kan også administrere vouchere

---

### 🟡 Viktige mangler (bør ha)

#### 7. Endre/slette påmelding

**Krav fra docs:** "Man kan også endre påmelding og da velge å slette eller flytte påmelding til annet lag/skive"

**Status:** ⚠️ Delvis implementert

**Det som er der:**

- `handleUnbook()` funksjon i competition page
- Mulighet for admin å kansellere bookings

**Det som mangler:**

- Bruker kan ikke endre/flytte egen påmelding fra "Mine påmeldinger"
- Ikke visuell indikasjon av at bruker kan flytte påmelding
- Drag-and-drop eller "bytt til" funksjon

#### 8. Melde på andre

**Krav fra docs:** "Som medlem kan man også registrere påmeldinger på vegne av andre i sitt lag eller 'venner'" (ref: `docs/ssa-k_bilag_2024.html` L8597)

**Status:** ✅ Implementert i booking dialog

**Kommentar:**

- BookingDialog har støtte for å reservere for venner
- Men "Mine påmeldinger" viser ikke separate påmeldinger gjort for andre

#### 9. Bekreftelse når booking er fullført

**Status:** ⚠️ Delvis implementert

**Det som er der:**

- Success state i BookingDialog

**Det som mangler:**

- Riktig lagring av booking i mock-data (bare oppdaterer local state)
- Persistering av påmeldinger
- Visning i "Mine påmeldinger" etter suksess

#### 10. Adminserting av tidsluke-konfigurasjon

**Krav fra docs:** "Skytterlagene oppretter selv alle lag, med spesifikke klokkeslett og antall skiver per bane som er tilgjengelige" (ref: `docs/ssa-k_bilag_2024.html` L8616–L8617)

**Status:** ⚠️ Delvis implementert

**Det som er der:**

- CreateCompetitionDialog lar admin sette antall skiver
- Tidsluker genereres automatisk basert på start/end tid

**Det som mangler:**

- Admin kan ikke tilpasse individuelle tidsluker (kunne legge til pause, endre duration)
- Ikke mulighet til å låse/blokke spesifikke tidsluker under setup
- Mangler avanserte tidsluke-oppsett (pauser, ulike durations per dag)

---

### 🟢 Nåværende begrensninger (ikke kritisk for POC)

#### 11. Backend/persistering

**Status:** Ok for POC (mock data)

**Kommentar:**

- Alt bruker mock data og localStorage
- Bookings persisteres ikke på tvers av reloads
- Trenger API-integrasjon for produksjon

#### 12. XML eksport / API integrasjon

**Krav fra docs:** "En optimal løsning vil tillate løpende påmelding, også under stevnet, hvor resultatprogrammet kan hente påmeldinger kontinuerlig via et API" (ref: `docs/ssa-k_bilag_2024.html` L8630–L8633)

**Status:** ❌ Ikke implementert (forventet for POC)

**Kommentar:**

- Dette er viktig for produksjon, men ikke kritisk for POC
- Trenger API-endepunkter for:
  - GET /api/competitions/:id/slots (hent tidsluker)
  - POST /api/bookings (opprett booking)
  - DELETE /api/bookings/:id (slett booking)
  - XML eksport for kompatibilitet med eksisterende systemer

#### 13. Håndtering av høy belastning

**Krav fra docs:** "Takle stor belastning"

**Status:** ❌ Ikke implementert (vanskelig å teste i frontend POC)

**Kommentar:**

- Dette krever backend-infrastruktur
- Optimistic locking
- Queue-system
- Load balancing

#### 14. Betaling-integrasjon

**Status:** Mock implementert

**Kommentar:**

- BookingDialog har dummy betalingsvelger
- Ingen ekte integrering med betalingsløsning (Vipps, betalingskort, etc.)
- For produksjon trenger vi ekte betalingsløsning

#### 15. Oppdater/rediger stevne

**Status:** ❌ Ikke implementert

**Det som mangler:**

- Admin kan opprette men ikke redigere eksisterende stevner
- Ikke mulighet til å endre påmeldingsdetaljer etter opprettelse
- Varsel til påmeldte ved endringer

#### 16. Statistikk og rapportering

**Status:** ❌ Ikke implementert

**Det som mangler:**

- Statistikk over påmeldinger per stevne
- Popularitetsstatistikk (hvilke tidsluker er mest populære)
- Eksport til CSV/Excel for administratorer
- Dashboard med nøkkeltall for admin

---

## Eventuelle feil eller problemer

### 🔴 Kritiske problemer

#### 1. Bookings ikke persistert

**Problem:**

- Bookings lagres bare i local state (`useState<Map<string, TimeSlot[]>>`)
- Går tapt ved refresh
- Ikke tilgj worn i "Mine påmeldinger" (siden viser tom mock array)
- Bookings genereres på nytt hver gang fra mock-data

**Løsning:**

- Implementer localStorage-persistering for POC
- Eller integrer med backend API for produksjon

#### 2. Generering av bookings fra mock-data

**Problem:**

- Bookings genereres fresh hver gang fra `generateTimeSlots()`
- Mock bookinger som er pre-generert i mock-data går tapt
- Custom bookings du oppretter vil gå tapt ved refresh

**Løsning:**

- Persist bookings til localStorage når de opprettes
- Load fra localStorage ved mount
- Merg mock data med persisted bookings

### 🟡 Mindre feil/forbedringer

#### 3. Manglende error boundaries

- Ingen error handling hvis API-kall feiler (når backend implementeres)
- Manglende loading states i flere komponenter

#### 4. Accessibility issues

- Tidsluke-grid er vanskelig å navigere med tastatur
- Manglende ARIA-labels i booking dialog
- Farge-coding basert utelukkende på farger (ikke tekst)

#### 5. Mobile responsivitet

- POC er desktop-først
- Tidsluke-grid vil ikke fungere godt på mobile
- BookingDialog kan være for bred for mobile

#### 6. Type safety issues

- `allowedClasses` er `string[] | undefined` men brukes som array
- Manglende runtime validering av data fra API

---

## Rekkefølge for videre utvikling

> **Prioritering:** Fokus på påmelding, opprettelse av stevner, og innmelding med forsikring først.

### Fase 0: Kjerneflyt - Påmelding og Innmelding (2-3 uker) 🎯

**Mål:** Få de viktigste brukerflytene fungerende end-to-end.

#### A. Fullfør Påmeldingsflyten (1-2 uker)

1. **Reservasjonssystem med timeout**

   - Implementer 10-minutters reservasjon
   - Vis countdown i UI
   - Automatisk frigiving ved timeout
   - Lager TimeSlotReservation type og logikk

2. **Persistering av bookings**

   - Implementer localStorage-basert persistering for POC
   - Lagre bookings når de opprettes
   - Lade fra localStorage ved mount
   - Merge med mock data
   - Vis bookings i "Mine påmeldinger"

3. **Offentlig påmeldingsliste**

   - Vis påmeldinger for ikke-innloggede brukere
   - Forbedre visning av hvem som er påmeldt
   - Vis skive og tidspunkt for hver påmelding

4. **Endre/flytte påmelding**
   - Mulighet til å endre påmelding fra "Mine påmeldinger"
   - Vis "Flytt til annen skive/tid" funksjonalitet
   - Dragging eller "bytt til" dialog

#### B. Innmelding med forsikring (1 uke) 🆕

1. **Medlemsregistrering**

   - Skjema for nytt medlem
   - Validering av påkrevde felt
   - Lagring av medlemsdata

2. **Forsikringsintegrasjon**

   - Visning av forsikringsdekning
   - Automatisk forsikring ved innmelding
   - Informasjon om forsikringsgyldighet
   - Håndtering av forsikringsstatus

3. **Medlemsbehandling**
   - Verifisering av medlemskap
   - Status på forsikring
   - Betalingsdetaljer (medlemsskonting)

#### C. Opprette stevne - Admin (3-5 dager)

1. **Forbedre CreateCompetitionDialog**

   - Multi-step wizard med klarere struktur
   - Validering av alle felt
   - Preview av stevne før publisering

2. **Tidsluke-konfigurasjon**

   - Mulighet til å tilpasse individuelle tidsluker
   - Legge til pauser
   - Sette klasse-restriksjoner per tidsluke
   - Låse/blokke spesifikke tidsluker

3. **Stevne-templates**
   - Lagre stevne som template
   - Gjenbruk templates for lignende stevner
   - Quick setup med forhåndsdefinerte innstillinger

### Fase 1: Kritiske problemer og mangler (1-2 uker)

1. **Påmelding uten tidsluker** (for møter og kurs)

   - Lag BookingDialog-variant for møter/kurs
   - Enkel "Meld på" flow
   - Vis antall ledige/totale plasser

2. **Klasse-restriksjoner**

   - Valider brukerens klasse før booking
   - Vis klasse-restriksjoner i UI
   - Admin-grensesnitt for å sette restriksjoner

3. **E-post bekreftelse og notifikasjoner**
   - E-post bekreftelse ved påmelding
   - Notifikasjoner for kommende arrangement
   - Varsler ved endringer i stevne

### Fase 2: Backend integration (2-4 uker)

1. Design API endpoints for påmelding, innmelding og stevner
2. Implementer API routes (Next.js API routes eller ekstern API)
3. Bytt ut mock data med API calls
4. Implementer error handling
5. Loading states og optimistic updates

### Fase 3: Ekstra funksjoner (1-2 uker)

1. Voucher system
2. E-post notifikasjoner
3. Statistikk og rapportering
4. XML eksport
5. Betalingsintegrasjon

### Fase 4: Testing og optimalisering (1-2 uker)

1. Enhetstester
2. Integrasjonstester
3. Load testing (backend)
4. Accessibility audit
5. Performance optimalisering

---

## Konklusjon

POC-en har et solid fundament med god arkitektur og moderne teknologi. Kjernefunksjonaliteten for tidsluke-booking er implementert, men mangler viktige aspekter som reservasjonstimeout, offentlig påmeldingsliste, og tilpasning til møter/kurs.

**Neste steg:** Fokusere på **Fase 0** (Kjerneflyt) for å få de tre viktigste områdene fungerende:

1. Påmelding til stevner (med reservasjonssystem)
2. Opprette stevner (admin-funksjonalitet)
3. Innmelding med forsikring (medlemsregistrering)

**Estimert tid til MVP:** 2-3 uker (kun Fase 0)
**Estimert tid til full løsning:** 6-10 uker (alle faser)

---

## Korreksjoner / Endringshistorie

### Versjon 1.2 (Oppdatert med fokusområder)

- **Lagt til:** "Viktigste fokusområder" i samandrag
  - Prioritering av påmelding, opprettelse av stevner, og innmelding med forsikring
- **Lagt til:** "Fase 0: Kjerneflyt - Påmelding og Innmelding"
  - Detaljert plan for de tre høyest prioriterte områdene
  - Nye underavsnitt for Innmelding med forsikring (B) og Opprette stevne (C)
- **Oppdatert:** Rekkefølge av faser
  - Fase 0 (ny): Kjerneflyt
  - Fase 1: Kritiske problemer og mangler
  - Fase 2: Backend integration
  - Fase 3: Ekstra funksjoner
  - Fase 4: Testing og optimalisering
- **Oppdatert:** Konklusjon med estimert tid for MVP (2-3 uker)

### Versjon 1.1 (Korrigert)

- **Fjernet:** Feilaktig påstand om undefined error i competition page (linje 32)
  - Faktum: Koden bruker `React.use()` korrekt for async params
  - Faktum: Null-checking finnes allerede på linje 85-96
- **Fjernet:** Feilaktig påstand om manglende import av BookingDialog
  - Faktum: Import statement finnes på linje 23
- **Oppdatert:** Endret status for "Offentlig påmeldingsliste" fra "Delvis implementert" til "Ikke implementert"
  - Mer nøyaktig beskrivelse av manglene
- **Forbedret:** Mer detaljert beskrivelse av bookings-persistering problem
  - La til info om at bookings genereres på nytt fra mock-data hver gang

### Versjon 1.0 (Initial)

- Første versjon av analysen

---

## Vedlegg

### Referanser

- `dfs.txt` - Hovedkravspesifikasjon
- `docs/ssa-k_bilag_2024.html` - Detaljert kravdokumentasjon (seksjon 1.1.5)
- `docs/540-2025-Skykontoret forhandlingsmøte 2[34].html` - Forhandlingsdokument

### Nøkkelfiler å undersøke

- `app/competition/[id]/page.tsx` - Hovedsiden for stevne booking
- `components/booking-dialog.tsx` - Booking dialog
- `lib/types.ts` - Type definitions
- `lib/mock-data.ts` - Mock data
- `lib/auth-context.tsx` - Autentisering

### Test-scenarioer som bør fungere deadlines

#### Test 1: Påmelding til stevne

1. Logg inn som medlem
2. Finn et stevne fra liste
3. Velg skive og tidspunkt
4. Reservasjon starter (10 min countdown?)
5. Velg klasse og betalingsmetode
6. Bekreft booking
7. Booking vises i "Mine påmeldinger"

#### Test 2: Offentlig påmelding

1. Utlogget besøkliste (ut logg).
2. Finn et stevne
3. Se hvem som er påmeldt
4. Kan IKKE melde seg på (må logge inn)

#### Test 3: Møte/kurs påmelding

1. Logg inn som medlem
2. Finn et møte eller kurs
3. Klikk "Meld på" (ingen tidsluke-valg)
4. Bekreft påmelding
5. Booking vises i "Mine påmeldinger"

#### Test 4: Admin opprettelse av stevne

1. Logg inn som admin
2. Gå til admin-siden
3. Klikk "Opprett stevne"
4. Fyll ut opplysninger
5. Sett klase-restriksjoner
6. Lagre
7. Stevne vises i arrangementliste

#### Test 5: Endre påmelding

1. Logg inn som medlem med eksisterende påmelding
2. Gå til "Mine påmeldinger"
3. Klikk "Endre" på en påmelding
4. Velg ny skive/tid
5. Bekreft
6. Påmelding er flyttet
