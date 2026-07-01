# Expo + Supabase Multi-Tenant SaaS Starter

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![CI](https://github.com/Gabriele06-local/expo-supabase-multitenant-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/Gabriele06-local/expo-supabase-multitenant-starter/actions/workflows/ci.yml)
[![Expo](https://img.shields.io/badge/Expo-52.0-000?logo=expo)](https://expo.dev)
[![Supabase](https://img.shields.io/badge/Supabase-2.47-3ECF8E?logo=supabase)](https://supabase.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-000?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://typescriptlang.org)

Boilerplate per costruire SaaS multi-sede/multi-tenant con **Expo** (mobile) + **Supabase**.

Auth multi-ruolo, RLS pronte, onboarding organizzazione, Edge Functions — tutto funzionante.

---

## Stack

| Livello | Tecnologia |
|---|---|
| Mobile | Expo SDK 52 + Expo Router 4 |
| Web (opzionale) | Next.js 15 |
| Backend | Supabase (Postgres, Auth, RLS, Edge Functions) |
| Linguaggio | TypeScript |
| Monorepo | npm workspaces |
| Lint/Format | ESLint + Prettier + Husky |
| Test | Vitest |
| CI | GitHub Actions (lint, typecheck, DB test) |

## Quick start

```bash
git clone https://github.com/Gabriele06-local/expo-supabase-multitenant-starter.git
cd expo-supabase-multitenant-starter
./setup.sh
npm run dev:mobile
```

Prerequisiti: [Node.js](https://nodejs.org) 22+, [Docker](https://docker.com), [Supabase CLI](https://supabase.com/docs/guides/cli).

## Demo accounts

| Email | Password | Ruolo | Org |
|---|---|---|---|
| owner@acme.com | password123 | Owner | Acme Corp |
| admin@acme.com | password123 | Admin | Acme Corp |
| staff@acme.com | password123 | Staff | Acme Corp |
| customer@acme.com | password123 | Customer | Acme Corp |
| owner@globex.com | password123 | Owner | Globex Inc |

## Struttura

```
/
├── apps/
│   ├── mobile/              → Expo (Router, auth, dashboard, CRUD membri/sedi)
│   └── web/                 → Next.js 15 (auth pages, dashboard server)
├── packages/
│   ├── supabase/            → Client Supabase condiviso
│   ├── shared-types/        → Tipi TypeScript (Database, entità, enum) + test
│   └── shared-ui/           → Componenti RN (RoleBadge)
├── supabase/
│   ├── migrations/          → 3 migrazioni (schema, RLS, RPC)
│   ├── functions/           → 2 Edge Functions (invite-user, send-notification)
│   └── seed.sql             → Dati demo realistici
├── .github/workflows/       → CI + DB test
└── docs/                    → ARCHITETTURA, CONTRIBUTING
```

## Comandi

| Comando | Descrizione |
|---|---|
| `npm run dev:mobile` | Avvia Expo |
| `npm run dev:web` | Avvia Next.js |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run typecheck` | TypeScript |
| `npm run test` | Vitest |
| `npm run setup` | Bootstrap completo |

**Database:**
`db:start` `db:stop` `db:reset` `db:migrate` `db:seed` `db:types` `db:studio`

**Edge Functions:**
`functions:serve` `functions:deploy`

## Documentazione

- [Architettura](docs/ARCHITECTURE.md) — schema, RLS, RPC vs Edge Functions, tradeoff, come estendere
- [Contribuire](docs/CONTRIBUTING.md) — commit convention, PR, linee guida

## Licenza

MIT
