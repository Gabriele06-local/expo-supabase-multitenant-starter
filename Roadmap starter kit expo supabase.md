# Expo + Supabase Multi-Tenant SaaS Starter Kit
### Roadmap di sviluppo — da zero a progetto pubblicabile

**Obiettivo:** creare un boilerplate open source pronto all'uso per costruire SaaS multi-sede/multi-tenant con Expo (mobile) + Next.js (web opzionale) + Supabase, basato sull'esperienza reale su Leon Lab, Trainex e BarberHub Pro.

**Nome provvisorio del repo:** `expo-supabase-saas-starter` (da rifinire)

---

## FASE 0 — Definizione e scope (1-2 giorni)

- [x] Scrivi in una nota (non ancora README) **chi è l'utente target**: dev che deve lanciare un SaaS multi-tenant in fretta e non vuole reinventare auth/RLS/onboarding.
- [x] Decidi lo **scope minimo vendibile** (MVP dello starter, non del prodotto finale). Suggerimento:
  - Autenticazione multi-ruolo (owner, admin sede, staff, utente finale)
  - Multi-tenancy vera (organizzazioni → sedi → utenti)
  - RLS pronte e testate per lo schema base
  - App mobile Expo con navigazione condizionata per ruolo
  - Edge Function di esempio (es. invito utente, invio notifica)
  - Script di seed dati demo
- [x] Decidi cosa **non** entra nell'MVP dello starter (es. pagamenti, chat realtime) — li segni come "esempi futuri" o plugin separati. Uno starter kit che fa tutto non lo mantiene nessuno.
- [x] Scegli la licenza (MIT è la scelta standard per starter kit, massimizza adozione).

**Perché questa fase conta per il CV:** dimostra capacità di scoping, non solo di scrivere codice. È la differenza tra "ho fatto un progetto" e "ho progettato un prodotto".

---

## FASE 1 — Architettura dati e RLS (3-5 giorni)

Questa è la parte più preziosa del progetto: la trasformi dall'esperienza cliente-specifica in un modello riusabile.

- [x] Disegna lo schema minimo multi-tenant:
  - `organizations` (tenant principale)
  - `locations` (sedi, come in Leon Lab)
  - `memberships` (utente ↔ org/location ↔ ruolo) — è il cuore del sistema di permessi
  - `invites` (per onboarding nuovi utenti)
- [x] Scrivi le **RLS policy** per ogni tabella partendo da questi principi:
  - Nessun accesso di default (deny by default)
  - Policy basate su `memberships`, non su ID hardcoded
  - Separazione netta tra policy di lettura, scrittura, update, delete
- [x] Scrivi **RPC functions** per le operazioni che RLS da sole non gestiscono bene (es. creare un invito, promuovere un utente).
- [ ] **Testa le RLS** creando utenti fittizi con ruoli diversi e verificando manualmente in SQL che ognuno veda solo ciò che deve. (da fare dopo setup Supabase locale)
- [x] Documenta lo schema con un diagramma ER (DBML in `supabase/schema.dbml`).

**Nota:** questa fase, se vuoi ampliarla in futuro, è anche il seme naturale per l'idea "tool di testing RLS" di cui parlavamo — puoi anche scrivere qui gli script di test come modulo riusabile a parte.

---

## FASE 2 — Setup del monorepo (2-3 giorni)

- [x] Struttura consigliata (monorepo con workspace, es. Turborepo o semplice npm workspaces):
  ```
  /apps
    /mobile        → Expo app
    /web           → Next.js 15 (opzionale, se vuoi includerlo)
  /packages
    /supabase      → migrazioni, seed, tipi generati
    /shared-ui     → componenti condivisi (se web+mobile)
    /shared-types  → tipi TypeScript condivisi
  /supabase
    /migrations
    /functions     → Edge Functions
  ```
- [x] Configura Supabase CLI locale per migrazioni versionate (niente modifiche a mano da dashboard: tutto tracciato in `/migrations`).
- [x] Genera i tipi TypeScript automaticamente da Supabase (`supabase gen types typescript`) e integrali nel pacchetto condiviso (schema manuale in `shared-types`, script `npm run db:types` per auto-generazione).
- [x] Configura ESLint + Prettier + Husky per pre-commit hook.

---

## FASE 3 — Autenticazione e onboarding (4-6 giorni)

- [ ] Implementa il flusso di auth Supabase (email/password + eventualmente magic link) sia su mobile che web.
- [ ] Costruisci il flusso di **onboarding organizzazione**:
  1. Utente si registra
  2. Crea (o viene invitato in) un'organizzazione
  3. Viene assegnato un ruolo tramite `memberships`
- [ ] Implementa il sistema di **inviti** (email con link, accettazione, creazione membership).
- [ ] Gestisci il **routing condizionato per ruolo** in Expo (es. con Expo Router, gruppi di route protette).
- [ ] Aggiungi gestione sessione robusta (refresh token, logout, persistenza).

---

## FASE 4 — Edge Functions di esempio (2-3 giorni)

Scegline 2-3 che dimostrino pattern diversi, non servono tante:

- [ ] Una Edge Function "server-side privileged" (es. invio invito, azione che richiede service role key e non può stare sul client).
- [ ] Una Edge Function con integrazione esterna (es. invio email transazionale con Resend, o notifica push).
- [ ] Documenta il pattern generale: quando usare RPC vs Edge Function vs query diretta con RLS.

---

## FASE 5 — App mobile: schermate di esempio (4-5 giorni)

Non serve costruire un'app finita, ma abbastanza da mostrare il pattern:

- [ ] Dashboard base con dati filtrati per organizzazione/sede (dimostra RLS che funziona end-to-end)
- [ ] Schermata gestione membri (lista, invito, cambio ruolo) — riusa direttamente esperienza da BarberHub Pro
- [ ] Switch tra sedi/organizzazioni se l'utente ne ha più di una
- [ ] Configurazione EAS Build pronta (profili dev/preview/production) documentata nel README

---

## FASE 6 — Developer Experience (DX) (3-4 giorni)

Questo è ciò che distingue uno starter kit "usabile" da un repo qualsiasi:

- [ ] Script `setup.sh` o comando npm che fa tutto il bootstrap iniziale (env, migrazioni, seed) in un comando solo.
- [ ] File `.env.example` completo e commentato.
- [ ] Script di **seed dati demo** realistici (organizzazione fittizia, sedi, utenti con ruoli diversi) per poter testare subito senza inserire dati a mano.
- [ ] Comandi npm chiari e documentati (`npm run dev`, `npm run db:reset`, `npm run db:seed`, ecc.)

---

## FASE 7 — Documentazione (3-4 giorni, non sottovalutare)

Per uno starter kit, la documentazione **è** il prodotto tanto quanto il codice.

- [ ] `README.md` principale: cosa fa, screenshot/gif, quick start in meno di 5 minuti, stack usato, licenza.
- [ ] `ARCHITECTURE.md`: spiega le decisioni (perché questo schema multi-tenant, perché queste RLS, tradeoff considerati).
- [ ] `CONTRIBUTING.md`: come proporre modifiche, convenzioni di commit.
- [ ] Diagramma architetturale (anche semplice, tipo Excalidraw esportato in PNG/SVG).
- [ ] Sezione "Come estendere questo starter" (es. aggiungere pagamenti, aggiungere una nuova tabella con RLS).

---

## FASE 8 — Qualità e CI (2-3 giorni)

- [ ] Aggiungi GitHub Actions basilari:
  - Lint + typecheck su ogni PR
  - (Opzionale, più avanzato) test automatici delle RLS policy contro un'istanza Supabase locale in CI
- [ ] Badge nel README (build status, licenza, versione Expo/Next).
- [ ] Se il tempo lo permette: qualche test unitario sulle funzioni di business logic più delicate (es. calcolo permessi).

---

## FASE 9 — Lancio (1-2 giorni + attività continua)

- [ ] Repo pubblico su GitHub con topics ben scelti (`supabase`, `expo`, `react-native`, `saas-starter`, `multi-tenant`, `rls`) per farti trovare nella ricerca.
- [ ] Pubblica un post breve su dove sei attivo (LinkedIn, magari un thread su X, community Supabase/Expo su Discord).
- [ ] Considera di postarlo su:
  - Supabase Discord (canale showcase)
  - r/reactnative, r/Supabase su Reddit
  - Product Hunt (se vuoi visibilità extra, va preparato con cura)
- [ ] Aggiungi il link nel tuo CV/portfolio (gabrielepau.com) con una breve descrizione tecnica delle scelte fatte (RLS multi-tenant, monorepo, ecc.) — è proprio il tipo di dettaglio che i recruiter tecnici notano.

---

## Timeline realistica

Considerando che lavori già a tempo pieno su Leon Lab e studi Ingegneria: **6-8 settimane** lavorando qualche ora a sera/weekend, procedendo fase per fase. Non è una gara — un repo curato pubblicato in 2 mesi vale molto più di uno abbandonato a metà dopo una settimana di sprint.

## Consiglio finale

Fai commit frequenti e descrittivi fin dall'inizio (non un unico "initial commit" con tutto dentro). La cronologia dei commit di un repo open source ben curato è spesso la prima cosa che un recruiter tecnico o un dev curioso guarda per capire come lavori.