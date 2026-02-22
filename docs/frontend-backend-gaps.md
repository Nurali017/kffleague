# Frontend ↔ Backend Gaps

Last updated: 2026-02-21

## Current status

- No critical public API gaps are open for the frontend.
- News reactions flow is now implemented and verified in dev:
  - `POST /news/{news_id}/view`
  - `POST /news/{news_id}/like`
  - `GET /news/{news_id}/reactions`

## Notes

1. `news_likes.news_id` intentionally has no FK to `news.id` because `news` uses a composite primary key and has duplicated `id` across languages.
2. Existence/integrity for reactions is enforced at API level (`404` when `news_id` does not exist).
3. `news` selection logic should use safe single-row selection by `id` with `limit(1)` semantics where necessary.
