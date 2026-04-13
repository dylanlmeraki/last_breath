# Phase 5 Image Inventory

Date: 2026-04-13  
Branch: `chillin_v2`  
Pass: Production imagery source migration (Phase 5)

## Baseline Classification Snapshot

| Metric | Before | After |
| --- | ---: | ---: |
| external stock URLs (`images.unsplash.com`) | 37 | 0 |
| active `@assets` marketing image imports | 2 | 0 |
| active generated project visual path usage (`createGeneratedProjectVisuals`) | 2 | 0 |
| active external texture URL (`transparenttextures.com`) | 1 | 0 |

## Source Families (Current)

| Family | File Source | Current Value Source | Classification | Status |
| --- | --- | --- | --- | --- |
| project gallery/media | `shared/marketing-content.ts` | `shared/marketing-asset-manifest.ts` -> `/images/projects/...` | production-safe local | provisional |
| blog featured images | `shared/marketing-content.ts` | `shared/marketing-asset-manifest.ts` -> `/images/blog/...` | production-safe local | provisional |
| team profile images | `client/src/portals/marketing/data/aboutTeamProfiles.ts` | `shared/marketing-asset-manifest.ts` -> `/images/team/...` | production-safe local | provisional |
| route hero/support imagery | marketing page files | `shared/marketing-asset-manifest.ts` -> `/images/routes/...` | production-safe local | provisional |
| generated helper | `shared/project-visuals.ts` | retained legacy helper (inactive) | generated legacy | quarantined |

## Route-by-Route Inventory

| Route | Component/File | Field Source | Current URL Source | Classification | Priority | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | `HomeRecovered.tsx` | CTA background | `/images/routes/home-cta-bg.jpg` | production-safe local | Tier 1 | hero video unchanged; CTA background now local |
| `/about` | `About.tsx` | hero background | `/images/routes/about-hero.jpg` | production-safe local | Tier 2 | removed `@assets` import |
| `/contact` | `Contact.tsx` | hero background | `/images/routes/contact-hero.jpg` | production-safe local | Tier 2 | external URL removed |
| `/services` | `Services.tsx` | hero + 2 detail visuals | `/images/routes/services-*.jpg` | production-safe local | Tier 2 | external URL removed |
| `/services-overview` | `ServicesOverview.tsx` | hero background | `/images/routes/services-overview-hero.jpg` | production-safe local | Tier 2 | external URL removed |
| `/inspections-testing` | `InspectionsTesting.tsx` | hero background | `/images/routes/inspections-hero.jpg` | production-safe local | Tier 2 | external URL removed |
| `/special-inspections` | `SpecialInspections.tsx` | hero + lead + case-study visuals | `/images/routes/special-inspections-*.jpg` | production-safe local | Tier 2 | external URL removed |
| `/structural-engineering` | `StructuralEngineering.tsx` | hero + lead visual | `/images/routes/structural-*.jpg` | production-safe local | Tier 2 | external URL removed |
| `/construction` | `Construction.tsx` | hero + section visuals | `/images/routes/construction-*.jpg` | production-safe local | Tier 2 | fixed broken local refs and external URL removal |
| `/project-gallery` | `ProjectGalleryRecovered.tsx` | project cards + map popups | `/images/projects/<slug>-01.jpg` | production-safe local | Tier 1 | value source moved through shared manifest |
| `/project/:slug` | `ProjectDetail.tsx` | carousel `images[]` | `/images/projects/<slug>-0{1,2}.jpg` | production-safe local | Tier 1 | external texture URL replaced with CSS gradient |
| `/projects/:slug` | `ProjectDetail.tsx` | carousel `images[]` | `/images/projects/<slug>-0{1,2}.jpg` | production-safe local | Tier 1 | alias route behavior unchanged |
| `/previous-work` | `PreviousWork.tsx` | project card images + hero | `marketingPreviousWorkImageMap` -> `/images/projects/...`, `/images/routes/previous-work-hero.jpg` | production-safe local | Tier 2 | no external stock URLs remain |
| `/blog` | `Blog.tsx` | hero + post images | `/images/routes/blog-hero.jpg`, `/images/blog/<slug>-hero.jpg` | production-safe local | Tier 3 | featured/list images now local |
| `/blog/:slug` | `BlogPost.tsx` | post hero image | `/images/blog/<slug>-hero.jpg` via API | production-safe local | Tier 3 | schema/image behavior unchanged |
| `/swppp-checker` | `SWPPPChecker.tsx` | hero background | `/images/routes/consultation-hero.jpg` | production-safe local | Tier 2 | external URL removed |
| `/consultation` | `SWPPPChecker.tsx` | hero background | `/images/routes/consultation-hero.jpg` | production-safe local | Tier 2 | external URL removed |

## Provisional / Deferred Notes

| Item | Current Status | Owner | Next Action |
| --- | --- | --- | --- |
| approved project photography pack | deferred | design + content | ingest final approved pack and update manifest statuses to `approved` |
| approved team headshots | deferred | design + leadership | replace logo fallback profile images |
| approved blog-specific imagery | deferred | content | replace provisional blog hero images per post |
| generated helper code (`project-visuals.ts`) | quarantined legacy | frontend/platform | remove only after fallback removal window closes |

## Validation Artifacts

- artifact root: `artifacts/e2e/20260413-phase5`
- route summary: `artifacts/e2e/20260413-phase5/phase5-route-summary.json`
- source policy report: `artifacts/e2e/20260413-phase5/phase5-source-policy-report.json`
- seam diff summary: `artifacts/e2e/20260413-phase5/seam-diff-summary.json`
- inventory json: `artifacts/e2e/20260413-phase5/phase5-image-inventory.json`
