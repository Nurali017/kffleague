# Click Audit Matrix (Active Routes)

## Scope
- Only active routes under `qfl-website/src/app`
- Excludes legacy/unused components not rendered by active routes

## Rules
- If a row/card has one logical destination, entire row/card must be clickable
- If row/card has secondary controls, keep them functional and prevent accidental primary navigation on secondary interaction
- Keyboard support required for primary clickable rows/cards (`Enter` and `Space`)
- No `href="#"` placeholders on active routes

## Findings and Fix Status

| Area | Component | Expected destination | Status before | Status after |
|---|---|---|---|---|
| Stats overview | `FeaturedStatBlock` featured card | `/player/:id` or `/team/:id` | Partial | Fixed |
| Stats overview | `FeaturedStatBlock` desktop ranking rows | `/player/:id` or `/team/:id` | Broken (invalid link/table pattern) | Fixed |
| Stats overview | `MiniStatCard` | configured `href` | Partial (arrow only) | Fixed |
| Stats players | `PlayerStatsTable` rows | `/player/:id` | Partial | Fixed |
| Stats clubs | `ClubStatsTable` rows | `/team/:id` | Partial | Fixed |
| Table | `FullLeagueTable` desktop rows | `/team/:id` | Partial | Fixed |
| Table | `ResultsGrid` rows | `/team/:id` | Partial | Fixed |
| Team page overview | `TeamOverviewSection` standings rows | `/team/:id` | Partial | Fixed |
| Team page overview | `TeamPlayerStats` mini leader cards | `/player/:id` (fallback `/stats/players`) | Broken | Fixed |
| League documents | `DocumentCard` root card | `document.url` | Partial (button only) | Fixed |
| Home media | `VideoGrid` CTA | external video destination | Broken (no destination) | Fixed |
| Media route | `/media` page | official YouTube channel | Broken (`/video` dead-end) | Fixed |
| Header nav | `navConfig` dead-end routes | active routes (`/teams`, `/stats/players`, `/media`) | Broken (`/clubs`, `/scorers`, `/video`, `/photo`, `/podcasts`) | Fixed |

## Validation checklist
- [x] Featured cards clickable by mouse and keyboard
- [x] Desktop ranking rows clickable and table markup remains valid
- [x] Secondary controls still work (`team logo`, `next match`, document CTA)
- [x] No active-route `href="#"` placeholders
- [x] Route smoke tests pass for changed sections

## Verification commands
- `npm run typecheck`
- `npm run test -- src/components/Footer.test.tsx src/components/statistics/overview/FeaturedStatBlock.test.tsx src/components/statistics/PlayerStatsTable.test.tsx src/components/statistics/ClubStatsTable.test.tsx src/components/team/__tests__/TeamOverviewSection.test.tsx`
- `rg --line-number --glob 'qfl-website/src/**' "href=['\"]#|href=\\\"#|href=\\'#|href:\\s*['\\\"]#|href\\s*\\|\\|\\s*['\\\"]#"`
