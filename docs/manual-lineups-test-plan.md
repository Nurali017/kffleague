# Manual Test Plan: Legacy Lineups Rendering Modes

## 1. Goal
Validate one-time legacy lineup backfill and runtime rendering behavior for match page lineups:
- `field` - field visualization + lineup lists
- `list` - lineup lists only
- `hidden` - lineup tab and lineup blocks are hidden

## 2. Scope
- Backend endpoint: `GET /api/v1/games/{id}/lineup`
- Match page UI:
  - `/matches/{id}` tabs area
  - Lineup tab content
  - Overview sidebar mini lineup block
- Rendering rules:
  - Championship gate: `1,2,3`
  - Date gate: `>= 2025-06-01`
  - Field data validity from starters positions

## 3. Preconditions
- Migration applied for `games.lineup_source`, `games.lineup_render_mode`, `games.lineup_backfilled_at`.
- One-time script executed:
  - `python -m scripts.backfill_legacy_lineups --dry-run` (validation)
  - `python -m scripts.backfill_legacy_lineups` (apply)
- Test dataset contains matches across:
  - championships `1/2/3`
  - championships outside gate (`4`, `6`)
  - dates before and after `2025-06-01`
  - sources: `team_squad`, `sota_api`, `vsporte_api`, `matches_players`, empty

## 4. Test Matrix
Validate combinations:
- Rendering mode: `field`, `list`, `hidden`
- Championship: in-gate (`1/2/3`) and out-of-gate
- Date: `< 2025-06-01` and `>= 2025-06-01`
- Source: `team_squad`, `sota_api`, `vsporte_api`, `matches_players`
- Language: `ru`, `kz`, `en`
- Device: desktop and mobile viewport

## 5. Core Scenarios

### Scenario A: Valid field lineup (`field`)
1. Open match with:
   - championship in `1/2/3`
   - date `>= 2025-06-01`
   - both teams with valid starters (`amplua + field_position`)
2. Call `GET /api/v1/games/{id}/lineup`.
3. Open `/matches/{id}`.

Expected:
- API: `rendering.mode = "field"`, `field_allowed_by_rules = true`, `field_data_valid = true`.
- UI: lineup tab visible.
- Lineup tab: field visible and lists visible.
- Overview: mini lineup block visible.

### Scenario B: Lineup exists but field is not allowed/invalid (`list`)
1. Open match where lineup exists, but:
   - date before cutoff, or championship out of gate, or invalid starter positions.
2. Call lineup endpoint.
3. Open match page.

Expected:
- API: `rendering.mode = "list"`.
- UI: lineup tab visible.
- Lineup tab: only list layout, no field markers.
- Overview: mini lineup block visible in list-only form.

### Scenario C: No lineup (`hidden`)
1. Open match with no lineup rows.
2. Call lineup endpoint.
3. Open match page.

Expected:
- API: `rendering.mode = "hidden"`, `has_lineup = false`.
- UI: lineup tab hidden.
- Overview: no lineup mini block.

### Scenario D: Duplicate players on same `amplua + position`
1. Use match where >=2 starters share same `amplua + field_position`.
2. Open lineup field.

Expected:
- Player markers are separated vertically by spacing.
- No overlap pile-up in the same point (except unavoidable extreme cases).

### Scenario E: Data parity checks
1. Compare API and UI for several matches.
2. Validate:
   - shirt number
   - captain badge
   - goalkeeper marker
   - player name consistency

Expected:
- UI data matches API payload for both home and away teams.

## 6. Regression Checks
- Match page tabs continue to work:
  - overview
  - statistics
  - h2h
- Live matches still refresh without JS/runtime errors.
- No layout break on mobile.

## 7. Exit Criteria
- 0 blocker/critical defects.
- All mandatory checklist items are `PASS`.
- QA report includes tested match IDs and observed rendering mode for each.

