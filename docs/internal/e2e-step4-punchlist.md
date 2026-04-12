# Step 4 E2E Punchlist (Ranked Severity)

Status timestamp: 2026-04-12

## Ranked Findings

### 1) S3 - Known PostCSS `from` warning remains
- `id`: `STEP4-E2E-S3-POSTCSS-FROM`
- `severity`: `S3`
- `seamImpact`: `none`
- `route`: `build pipeline`
- `viewport`: `n/a`
- `repro`:
  1. run `npm run build`
  2. observe warning: `A PostCSS plugin did not pass the from option to postcss.parse...`
- `expected`: clean, attributable build logs with no unresolved plugin warning.
- `actual`: build passes, warning remains visible.
- `rootCause`: likely upstream or dependency-level PostCSS plugin behavior, not a local warning suppression issue.
- `impactedFiles`: `build.ts` (surface where warning appears), dependency chain.
- `evidence`:
  - `docs/internal/e2e-step4-runlog.md`
  - `artifacts/e2e/20260412-0421/seam-diff-summary.json`
- `owner`: frontend/platform hardening
- `ETA`: current hardening window
- `status`: `open-tracked-debt`

Fix plan:
1. run targeted dependency trace for PostCSS plugin source ownership.
2. if external ownership confirmed, log exact package/version and mitigation window.
3. keep warning visible; do not suppress.
4. patch only if a safe, compatibility-preserving local upgrade/fix is confirmed.

### 2) S3 - Gallery E2E selector drift vs legacy check (`Civil Design`)
- `id`: `STEP4-E2E-S3-GALLERY-CATEGORY-DRIFT`
- `severity`: `S3`
- `seamImpact`: `none`
- `route`: `/project-gallery`
- `viewport`: `1280x800` test context
- `repro`:
  1. query category controls
  2. `button-category-Civil Design` is absent in current data/UI
- `expected`: test harness target category exists when using legacy check name.
- `actual`: current categories include `Civil + Stormwater` (and others), not `Civil Design`.
- `rootCause`: taxonomy/label drift between older verification assumption and current UI content.
- `impactedFiles`: test harness logic and QA expectation notes (not runtime seam).
- `evidence`:
  - `artifacts/e2e/20260412-0421/functional-checks.json`
- `owner`: QA automation
- `ETA`: immediate
- `status`: `open-low`

Fix plan:
1. update E2E assertion to derive category dynamically or use current canonical label.
2. keep contract checks behavior-oriented (count/filter effect), not brittle to historical label text.
3. no backend/shared contract change required.

## Resolved/Closed in this run
- `S0/S1/S2`: none found.
- Matrix runtime stability: clean (`0` console/page/overflow/collision failures).
- Focused 5-round loops: clean (`0` failures).
- Public/internal seam behavior: unchanged.

## Closure Decision
- Step 4 E2E can close from a blocking-risk standpoint.
- Remaining punchlist contains non-blocking `S3` items with explicit owners and follow-ups.

