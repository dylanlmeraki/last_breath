# Phase 5 Asset Map

Date: 2026-04-13  
Branch: `chillin_v2`  
Manifest authority: `shared/marketing-asset-manifest.ts`

## Naming Governance

- Projects: `client/public/images/projects/<project-slug>-01.jpg`, `-02.jpg`
- Team: `client/public/images/team/<person-id>-01.jpg`
- Blog: `client/public/images/blog/<post-slug>-hero.jpg`
- Route support: `client/public/images/routes/<route-key>.jpg`

## Tier 1 (Proof-Forward Core)

| Family | Key | Public URL(s) | Alt | Status | Fallback |
| --- | --- | --- | --- | --- | --- |
| projects | `port-of-san-francisco-portwide-demolition` | `/images/projects/port-of-san-francisco-portwide-demolition-01.jpg`, `-02.jpg` | Port of San Francisco waterfront demolition support showing active pier and equipment context. | approved | `/images/routes/bay-bridge-fallback.jpg` |
| projects | `caltrans-stormwater-ada-improvements` | `/images/projects/caltrans-stormwater-ada-improvements-01.jpg`, `-02.jpg` | Caltrans corridor construction scene showing drainage and access-improvement field conditions. | approved | `/images/routes/bay-bridge-fallback.jpg` |
| projects | `sfusd-bond-program-civil-stormwater` | `/images/projects/sfusd-bond-program-civil-stormwater-01.jpg`, `-02.jpg` | SFUSD bond-program civil coordination visual with campus planning and grading documentation context. | approved | `/images/routes/bay-bridge-fallback.jpg` |
| projects | `sfpuc-water-infrastructure-swppp` | `/images/projects/sfpuc-water-infrastructure-swppp-01.jpg`, `-02.jpg` | SFPUC utility construction scene with excavation and public-water infrastructure field work. | approved | `/images/routes/bay-bridge-fallback.jpg` |
| projects | `sfo-terminal-3-boarding-area-e` | `/images/projects/sfo-terminal-3-boarding-area-e-01.jpg`, `-02.jpg` | SFO Terminal 3 airside/terminal visual supporting design-build civil and utility sequencing context. | approved | `/images/routes/bay-bridge-fallback.jpg` |
| projects | `chief-medical-examiner-building` | `/images/projects/chief-medical-examiner-building-01.jpg`, `-02.jpg` | Chief Medical Examiner Building visual with survey and excavation support documentation context. | approved | `/images/routes/bay-bridge-fallback.jpg` |

## Tier 2 (About / Previous Work / Route Support)

| Family | Key | Public URL(s) | Alt | Status | Fallback |
| --- | --- | --- | --- | --- | --- |
| team | `mark-waldman` | `/images/team/mark-waldman-01.jpg` | Pacific Engineering leadership profile image placeholder for A. Mark Waldman. | provisional | `/images/routes/logo-fallback.jpg` |
| team | `barry-buckley` | `/images/team/barry-buckley-01.jpg` | Pacific Engineering leadership profile image placeholder for Barry Buckley. | provisional | `/images/routes/logo-fallback.jpg` |
| team | `miles-grant` | `/images/team/miles-grant-01.jpg` | Pacific Engineering leadership profile image placeholder for Miles Grant. | provisional | `/images/routes/logo-fallback.jpg` |
| team | `angie-aylsworth` | `/images/team/angie-aylsworth-01.jpg` | Pacific Engineering leadership profile image placeholder for Angie Aylsworth. | provisional | `/images/routes/logo-fallback.jpg` |
| team | `jack-smith` | `/images/team/jack-smith-01.jpg` | Pacific Engineering leadership profile image placeholder for Jack Smith. | provisional | `/images/routes/logo-fallback.jpg` |
| team | `mike-johnson` | `/images/team/mike-johnson-01.jpg` | Pacific Engineering leadership profile image placeholder for Mike Johnson. | provisional | `/images/routes/logo-fallback.jpg` |
| routes | `about-hero`, `contact-hero`, `services-hero`, `services-overview-hero`, `inspections-hero`, `construction-hero`, `special-inspections-hero`, `structural-hero`, `consultation-hero`, `previous-work-hero`, `home-cta-bg` | `/images/routes/<route-key>.jpg` | Bay Area engineering and construction contextual imagery. | provisional | `/images/routes/bay-bridge-fallback.jpg` |
| routes | `construction-detail-01`, `construction-detail-02`, `construction-detail-03` | `/images/routes/<route-key>.jpg` | Construction detail support imagery for service examples. | provisional | `/images/routes/bay-bridge-fallback.jpg` |
| routes | `special-inspections-lead`, `special-inspections-case-steel`, `special-inspections-case-seismic` | `/images/routes/<route-key>.jpg` | Special inspections support imagery for case-study sections. | provisional | `/images/routes/bay-bridge-fallback.jpg` |
| routes | `structural-lead` | `/images/routes/structural-lead.jpg` | Structural consulting section support imagery. | provisional | `/images/routes/bay-bridge-fallback.jpg` |

## Tier 3 (Blog)

| Family | Key | Public URL(s) | Alt | Status | Fallback |
| --- | --- | --- | --- | --- | --- |
| blog | `what-bay-area-teams-miss-when-swppp-planning-starts-too-late` | `/images/blog/what-bay-area-teams-miss-when-swppp-planning-starts-too-late-hero.jpg` | Stormwater compliance planning visual for Bay Area preconstruction sequencing. | provisional | `/images/routes/bay-bridge-fallback.jpg` |
| blog | `special-inspection-coordination-that-actually-helps-the-schedule` | `/images/blog/special-inspection-coordination-that-actually-helps-the-schedule-hero.jpg` | Special inspections coordination visual focused on schedule reliability. | provisional | `/images/routes/bay-bridge-fallback.jpg` |
| blog | `field-driven-engineering-decisions-save-more-than-redlines` | `/images/blog/field-driven-engineering-decisions-save-more-than-redlines-hero.jpg` | Field-driven engineering visual for constructability-focused project decisions. | provisional | `/images/routes/bay-bridge-fallback.jpg` |

## Provenance Rules Applied

- Public-serving image URLs now resolve from `client/public/images/...`.
- `attached_assets` remains source/reference only.
- External stock URLs, generated data-URI visuals, and `@assets` marketing image serving were removed from active flow.
- Tier 1 project imagery now uses curated crops from `example-projects-completed.pdf` and was promoted to `approved` in the shared manifest.

## Generated Visual Status

- `shared/project-visuals.ts` status: `legacy fallback only`
- Active published marketing flow status: `inactive` for generated visuals
- Remaining active generated visual exceptions: `0`
