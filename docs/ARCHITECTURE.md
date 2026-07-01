# Architettura: quando usare RPC, Edge Function o query diretta con RLS

## 1. Query diretta + RLS (la via predefinita)

**Quando usarla:**
- Lettura/scrittura di dati che l'utente è autorizzato a vedere/modificare
- Operazioni CRUD standard già coperte dalle RLS policy
- Caricamento dati per schermate (es. lista membri, sedi)

**Vantaggi:**
- Minima latenza (nessun round trip aggiuntivo)
- Sfrutta le RLS già definite
- Funziona sia da client che da server

**Esempio:**
```ts
const { data } = await supabase
  .from("memberships")
  .select("*, users:user_id(email)")
  .eq("organization_id", orgId);
```

---

## 2. RPC functions (operazioni atomiche lato database)

**Quando usarla:**
- Operazioni che richiedono transazioni multi-tabella (es. accettare invito → crea membership)
- Logica che deve essere atomica e non può essere suddivisa in più query client
- Operazioni che RLS da sola non gestisce (es. `accept_invite` verifica il token, controlla scadenza, crea membership in un unico passo)

**Vantaggi:**
- Atomicità (tutto o niente)
- Esecuzione vicina ai dati (nessun trasferimento dati superfluo)
- Richiamabile via `supabase.rpc()` sia da client che da Edge Function

**Esempio:**
```sql
select * from accept_invite('token-value');
```

---

## 3. Edge Functions (logica server-side con service role)

**Quando usarla:**
- Operazioni che richiedono la `service_role` key (bypassare RLS)
- Integrazione con API esterne (Resend, Stripe, OpenAI, ecc.)
- Logica complessa che non vuoi esporre al client
- Operazioni asincrone o schedulabili (webhook, CRON)

**Vantaggi:**
- Accesso a variabili d'ambiente segrete (API key, secret)
- Può usare qualsiasi libreria JS/TS (Deno)
- Scala indipendentemente dal database

**Esempio:**
```ts
// Edge Function che usa service_role per creare un invito
// e chiama Resend per inviare l'email
```

---

## Tabella riassuntiva

| Criterio | Query + RLS | RPC | Edge Function |
|---|---|---|---|
| Latenza | Bassa | Bassa | Media (cold start) |
| Security context | Utente (anon key) | Utente (anon key) / Definer | Service role |
| Atomicità | Manuale (lato client) | Garantita (SQL tx) | Manuale |
| API esterne | ❌ | ❌ | ✅ |
| Segreti/env vars | ❌ | ❌ | ✅ |
| Costo | Gratuito | Gratuito | CPU/timeout |
| Debugging | Semplice | Medio | Complesso |

## Regola pratica

1. **Inizia sempre con RLS + query diretta.**
2. **Se hai bisogno di atomicità multi-tabella → RPC.**
3. **Se hai bisogno di API esterne o service role → Edge Function.**
4. **Se una Edge Function diventa troppo lenta → valuta RPC per la parte critica.**
