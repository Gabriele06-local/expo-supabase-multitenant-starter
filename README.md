# expo-supabase-multitenant-starter

Boilerplate open source per costruire SaaS multi-sede/multi-tenant con Expo (mobile) + Supabase.

Stack: Expo (React Native) | Supabase (Postgres, Auth, RLS, Edge Functions) | Next.js 15 (web) | TypeScript

## Struttura

```
/
├── apps/
│   ├── mobile/        → Expo app (Expo Router, auth flow, onboarding, dashboard)
│   └── web/           → Next.js 15 (auth pages, server components)
├── packages/
│   ├── supabase/      → Client Supabase condiviso
│   ├── shared-types/  → Tipi TypeScript condivisi
│   └── shared-ui/     → Componenti React Native condivisi
├── supabase/
│   ├── migrations/    → Migrazioni versionate (schema, RLS, RPC)
│   ├── functions/     → Edge Functions Deno
│   ├── seed.sql       → Dati demo
│   └── config.toml    → Config Supabase CLI
└── docs/
    └── ARCHITECTURE.md → Decisioni architetturali
```

## Quick start

```bash
# 1. Clona e installa
git clone https://github.com/Gabriele06-local/expo-supabase-multitenant-starter.git
cd expo-supabase-multitenant-starter
npm install

# 2. Copia le variabili d'ambiente
cp .env.example .env.local
# Inserisci SUPABASE_URL e SUPABASE_ANON_KEY nel file .env.local

# 3. Avvia Supabase in locale (richiede Supabase CLI e Docker)
supabase start
npm run db:migrate
npm run db:seed
npm run db:types

# 4. Avvia l'app mobile
npm run dev:mobile

# 5. (Opzionale) Avvia il web
npm run dev:web
```

## Comandi npm

| Comando | Descrizione |
|---|---|
| `npm run dev:mobile` | Avvia Expo dev server |
| `npm run dev:web` | Avvia Next.js dev server |
| `npm run lint` | ESLint su tutto il progetto |
| `npm run format` | Prettier formattazione |
| `npm run typecheck` | TypeScript type check su tutti i workspace |
| `npm run db:migrate` | Applica migrazioni Supabase |
| `npm run db:types` | Genera tipi TypeScript da Supabase |
| `npm run db:seed` | Seed dati demo |
| `npm run setup` | Bootstrap completo (install + migrate + seed + types) |

## EAS Build

L'app mobile è pronta per EAS Build con tre profili:

```bash
# Sviluppo (expo-dev-client)
eas build --profile development --platform all

# Preview (distribuzione interna)
eas build --profile preview --platform all

# Produzione (App Store / Play Store)
eas build --profile production --platform all
```

Configurazione in `apps/mobile/eas.json`.

## Edge Functions

```bash
# Serve localmente
supabase functions serve --no-browser

# Deploy su Supabase
supabase functions deploy invite-user
supabase functions deploy send-notification
```

## Licenza

MIT
