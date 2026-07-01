# Contribuire

Grazie per l'interesse in questo starter kit! I contributi sono benvenuti.

## Convenzioni commit

Usiamo [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nuova funzionalità
fix: correzione bug
docs: documentazione
refactor: refactoring senza modifica funzionalità
chore: manutenzione (dipendenze, config)
style: formattazione, lint
test: test
```

Esempi:
```
feat: add organization settings screen
fix: redirect loop on expired session
docs: update quick start with Supabase local setup
```

## Proporre modifiche

1. Fork del repository
2. Crea un branch: `git checkout -b feat/nome-feature`
3. Fai commit descrittivi e frequenti
4. Apri una Pull Request verso `main`
5. Descrivi cosa fa la PR e perché

## Setup sviluppo

```bash
git clone https://github.com/Gabriele06-local/expo-supabase-multitenant-starter.git
cd expo-supabase-multitenant-starter
./setup.sh
```

## Linee guida

- Non rompere le migrazioni esistenti (aggiungi nuove migrazioni, non modificare quelle già pushati)
- Mantieni le RLS policy come default deny
- Aggiungi tipi TypeScript per nuove tabelle in `packages/shared-types`
- Testa con `npm run lint` e `npm run typecheck` prima di aprire PR
- Non introdurre dipendenze pesanti senza discussione

## Codice di condotta

Sii rispettoso, costruttivo e inclusivo. Questo è un progetto educativo/open source.

## Domande?

Apri una [issue](https://github.com/Gabriele06-local/expo-supabase-multitenant-starter/issues) o contatta direttamente.
