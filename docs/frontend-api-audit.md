# Frontend API Audit

Last updated: 2026-02-21

## Command

Run from `/Users/nuralisagyndykuly/qfl/qfl-website`:

```bash
npm run audit:api
```

## What it validates

1. Contract check:
   - compares frontend endpoints in `/Users/nuralisagyndykuly/qfl/qfl-website/src/lib/api/endpoints.ts`
   - against backend OpenAPI at `http://localhost:8000/openapi.json`
   - with normalized path placeholders
2. Schema guard:
   - `alembic current == alembic head`
   - `games.id` is `bigint`
   - `games.sota_id` exists
3. Runtime GET smoke:
   - seasons, games, teams, players, news, pages
4. Runtime write-flow smoke:
   - news reactions (`view`, `like`, `reactions`)
5. Negative checks:
   - invalid IDs return controlled non-500 responses
6. Backend log guard:
   - no `500` for tested routes since audit start

## Reports

After each run:

- JSON report: `/Users/nuralisagyndykuly/qfl/docs/frontend-api-audit-report.json`
- Markdown report: `/Users/nuralisagyndykuly/qfl/docs/frontend-api-audit-report.md`

## Pass criteria

Audit status is PASS only when all sections are green:

- contract
- schema
- runtime_get
- runtime_write
- negative
- log_guard
