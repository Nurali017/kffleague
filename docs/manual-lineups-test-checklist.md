# Manual Checklist: Legacy Lineups

## A. Backend Response
- [ ] `GET /api/v1/games/{id}/lineup` returns `rendering.mode`.
- [ ] `rendering.source` is present and matches expected source.
- [ ] `rendering.field_allowed_by_rules` is correct for championship/date.
- [ ] `rendering.field_data_valid` reflects starter positions validity.
- [ ] `has_lineup` is `false` when there are no lineup rows.

## B. Rendering Modes
- [ ] `field`: field + lists shown.
- [ ] `list`: only lists shown, field hidden.
- [ ] `hidden`: lineup tab hidden, lineup blocks hidden.

## C. Rules Validation
- [ ] Championship in `1/2/3` and date `>= 2025-06-01` can render `field`.
- [ ] Championship outside `1/2/3` never renders `field`.
- [ ] Date before `2025-06-01` never renders `field`.
- [ ] Invalid positions downgrade to `list`.

## D. Sources
- [ ] `team_squad` match verified.
- [ ] `sota_api` match verified.
- [ ] `vsporte_api` match verified.
- [ ] `matches_players` fallback match verified.
- [ ] empty/no-source match verified as `hidden`.

## E. UI Data Integrity
- [ ] Home lineup numbers/names match API.
- [ ] Away lineup numbers/names match API.
- [ ] Captain marker is correct.
- [ ] Goalkeeper entry is correct.
- [ ] Duplicate `amplua+position` players are spaced (no hard overlap).

## F. Localization and Devices
- [ ] `ru` locale checked.
- [ ] `kz` locale checked.
- [ ] `en` locale checked.
- [ ] Desktop viewport checked.
- [ ] Mobile viewport checked.

## G. Regression
- [ ] Overview tab unaffected.
- [ ] Statistics tab unaffected.
- [ ] H2H tab unaffected.
- [ ] Live match update behavior unaffected.
- [ ] No console/runtime errors.

## H. Release Decision
- [ ] No blocker defects.
- [ ] Mandatory items passed.
- [ ] QA report with tested match IDs + rendering mode attached.

