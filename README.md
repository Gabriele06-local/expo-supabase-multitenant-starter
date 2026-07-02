# Expo + Supabase Multi-Tenant Starter

Boilerplate per SaaS multi-tenant con Expo + Supabase.

## Quick start

```bash
npm install
npx expo start
```

Prerequisiti: Node.js 22+, Expo Go (SDK 54).

## Supabase (opzionale per sviluppo locale)

```bash
supabase start
supabase db push
supabase db reset --linked
```

Crea `.env` con i tuoi valori Supabase (copia da `.env.example`).

## Demo accounts

Solo per sviluppo locale — non deployare in produzione.

| Email | Password | Ruolo |
|---|---|---|
| owner@acme.com | password123 | Owner |
| admin@acme.com | password123 | Admin |
| staff@acme.com | password123 | Staff |
| customer@acme.com | password123 | Customer |
| owner@globex.com | password123 | Owner |

## Stack

- Expo SDK 54 + Expo Router
- Supabase (Auth, RLS, Edge Functions)
- TypeScript

## Licenza

MIT