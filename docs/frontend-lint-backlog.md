# Frontend Lint/UX Backlog (`qfl-website`)

Last updated: 2026-02-20

## Current lint state

- `npm run lint` passes with **no warnings and no errors**.
- `react-hooks/exhaustive-deps` warning in `/Users/nuralisagyndykuly/qfl/qfl-website/src/components/news/ImageGallery.tsx` fixed via memoized callbacks/deps.
- `@next/next/no-img-element` is now disabled in `/Users/nuralisagyndykuly/qfl/qfl-website/.eslintrc.json` to unblock delivery while preserving current image behavior.

## Priority backlog

1. Plan gradual migration to `next/image` (performance backlog):
   - `/Users/nuralisagyndykuly/qfl/qfl-website/src/app/page.tsx` via dependent components:
     - `/Users/nuralisagyndykuly/qfl/qfl-website/src/components/HeroSection.tsx`
     - `/Users/nuralisagyndykuly/qfl/qfl-website/src/components/HomeMatches.tsx`
     - `/Users/nuralisagyndykuly/qfl/qfl-website/src/components/NewsSection.tsx`
   - `/Users/nuralisagyndykuly/qfl/qfl-website/src/app/matches/[id]/page.tsx` via:
     - `/Users/nuralisagyndykuly/qfl/qfl-website/src/components/MatchHeader.tsx`
     - `/Users/nuralisagyndykuly/qfl/qfl-website/src/components/match/LineupField.tsx`
   - `/Users/nuralisagyndykuly/qfl/qfl-website/src/app/news/[id]/page.tsx`

2. Replace remaining `<img>` usages in shared components:
   - tournament UI (`TournamentBar`, `TournamentSwitcherView`, `TournamentIcons`)
   - team UI (`TeamOverviewSection`, `TeamPageHero`, `TeamPlayerStats`, `TeamOverviewCards`, `TeamDashboard`)
   - stats/table UI (`PlayerStatsTable`, `ClubStatsTable`, `FullLeagueTable`, `ResultsGrid`)

3. UX cleanup backlog (non-lint):
   - unify loading/error empty states across page-level routes.
   - ensure image placeholders and dimensions are stable to avoid layout shift.
   - add skeleton consistency for SSR fallback + SWR revalidation transitions.

## Definition of done for this backlog

- `npm run lint` without warnings.
- remove global disable for `@next/next/no-img-element` and keep lint green.
- no direct `<img>` in app/components except justified raw HTML content blocks.
