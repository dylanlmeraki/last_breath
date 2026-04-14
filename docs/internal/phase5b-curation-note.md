# Phase 5B Curation Note

Date: 2026-04-13  
Branch: `chillin_v2`  
Scope: Phase 5B only (asset quality uplift, no contract or architecture changes)

## What Changed

1. Replaced weak duplicate provisional imagery across Tier 1/Tier 2/Tier 3 public marketing surfaces with curated local assets sourced from `example-projects-completed.pdf`.
2. Promoted all six proof-backbone project manifest entries from `provisional` to `approved` in `shared/marketing-asset-manifest.ts`.
3. Added project-specific provenance and stronger alt/caption metadata for each approved project entry.
4. Kept blog and team image families in `provisional` status where editorial-specific or person-specific final packs are still pending.
5. Preserved all contract-sensitive endpoint behavior and payload shapes (`image: string`, `images: string[]`, `featured_image` string).

## Provisional Assets Upgraded

1. `port-of-san-francisco-portwide-demolition` (project image set)
2. `caltrans-stormwater-ada-improvements` (project image set)
3. `sfusd-bond-program-civil-stormwater` (project image set)
4. `sfpuc-water-infrastructure-swppp` (project image set)
5. `sfo-terminal-3-boarding-area-e` (project image set)
6. `chief-medical-examiner-building` (project image set)

## Weakest Assets Addressed First (Trust Impact Priority)

1. Homepage/project evidence cards that previously reused fallback imagery
2. Project gallery thumbnails and map-adjacent visuals
3. Project detail hero/carousel image set for core proof projects
4. Route hero/support imagery that still felt repetitive from the first migration pass
5. Blog hero/card imagery using weak provisional matches

## Intentionally Deferred

1. Team headshots (`/images/team/*`) remain provisional pending approved person-specific photos
2. Blog-specific editorial hero pack remains provisional pending content/design final curation

## Manifest Status Changes

1. `provisional -> approved`:
   - `port-of-san-francisco-portwide-demolition`
   - `caltrans-stormwater-ada-improvements`
   - `sfusd-bond-program-civil-stormwater`
   - `sfpuc-water-infrastructure-swppp`
   - `sfo-terminal-3-boarding-area-e`
   - `chief-medical-examiner-building`
2. Remaining `provisional`:
   - all three blog entries
   - all six team entries

## Generated Visual Helper Status

1. `shared/project-visuals.ts` remains in repo as legacy fallback helper.
2. Active production marketing flow does not call generated visual output paths.
3. Active generated visual exceptions: `0`.

## Nano-Banana / Generative Usage

1. No Nano-Banana synthetic generation was used.
2. This pass used curated crops/normalization from real project-document source imagery plus existing approved fallback assets.

## Validation Summary

1. `npm run check` passed.
2. `npm run build` passed.
3. `npm run check:repo-hygiene` passed.
4. Route sweep passed on core + sanity set with no image 404s and no horizontal overflow:
   - evidence: `artifacts/e2e/20260413-phase5b/phase5b-route-summary.json`
5. Source-policy scan passed:
   - no active Unsplash
   - no active `@assets` marketing serving path
   - no active external texture URL
   - no active generated `data:image` usage in production marketing flow
6. Contract/seam smoke remained stable:
   - evidence: `artifacts/e2e/20260413-phase5b/seam-diff-summary.json`
