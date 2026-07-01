# Planning — Expo + Supabase Multi-Tenant SaaS Starter Kit

## Target User

Uno sviluppatore che deve lanciare un SaaS multi-tenant in fretta e non vuole reinventare:
- Autenticazione multi-ruolo
- Row Level Security (RLS) per multi-tenancy
- Onboarding organizzazione/sedi/utenti
- Routing condizionato per ruolo su mobile

## MVP Scope (cosa entra)

- [ ] Autenticazione multi-ruolo (owner, admin sede, staff, utente finale)
- [ ] Multi-tenancy vera (organizzazioni → sedi → utenti)
- [ ] RLS pronte e testate per lo schema base
- [ ] App mobile Expo con navigazione condizionata per ruolo
- [ ] Edge Function di esempio (invito utente, notifica)
- [ ] Script di seed dati demo

## Fuori dall'MVP (plugin futuri)

- Pagamenti / fatturazione
- Chat in realtime
- Notifiche push (salvo esempio edge function)
- Dashboard web (opzionale, Next.js)

## Licenza

MIT — massimizza adozione e contributi.
