# QFL Website (Next.js)

## Quick start

```bash
cd qfl-website
npm install
npm run dev
```

App runs on `http://localhost:3000`.

## Environment

Create `.env.local` (or copy from `.env.example`):

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_API_BASE_URL` (default `/api/v1`)
- `NEXT_PUBLIC_DEFAULT_SEASON_ID`
- `NEXT_PUBLIC_DEFAULT_TOUR`
- `NEXT_PUBLIC_DEFAULT_LANGUAGE`

Optional (server usage / future SSR):
- `API_BASE_URL` (absolute, e.g. `http://localhost:8000/api/v1`)

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — ESLint
- `npm run test` — Vitest (run once)
- `npm run test:watch` — Vitest watch mode
- `npm run test:coverage` — coverage
- `npm run screenshots:stats` — Playwright stats screenshots

## Architecture notes

- API layer lives in `src/lib/api` (client, services, endpoints).
- Common utilities live in `src/lib/utils`.
- Old `src/api` and `src/utils` have been removed to avoid duplication.
