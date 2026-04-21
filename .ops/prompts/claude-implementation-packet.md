---
pass_id: P6-001-hero-system-reset
phase: 6-prep
owner_model: Claude Sonnet 4.x
reviewer_model: Gemini 2.5 Pro
accepting_authority: GPT-5.4
repo: last_breath
branch: chillin_v2
status: active
---

# Objective

Replace weak, lazy, or generic public marketing route heroes with a more disciplined hero system that improves perceived quality without reopening project-proof architecture or changing contracts.

# Why this pass exists

The current marketing site is no longer mainly blocked by architecture. It is being dragged down by weak hero-image choices and inconsistent hero treatment on support routes.

# In scope

Primary routes:

- /about
- /contact
- /services
- /services-overview
- /inspections-testing
- /special-inspections
- /structural-engineering
- /construction
- /swppp-checker
- /consultation
- /blog
- /blog/:slug

Files likely in scope:

- hero components
- route image references / manifest entries
- hero CSS treatment
- local hero-support images in `client/public/images/routes`
- route-level page files for the routes above

# Out of scope

- homepage proof structure
- project gallery proof backbone
- approved Tier 1 project imagery
- public API behavior
- internal portal
- microservice integration
- broad content rewrites

# Constraints

- no public API changes
- no auth/seam drift
- no synthetic project proof
- no fake team portraits
- no broad page-layout rewrites unless a hero pattern requires local adjustment
- prefer text-first or split heroes over low-quality full-bleed imagery

# Inputs

- current branch state
- current screenshots for weak route heroes
- Figma node references for hero-safe areas where available
- current route image inventory
- current approved project asset backbone

# Acceptance criteria

- each in-scope route is assigned a deliberate hero pattern:
  - proof hero
  - text-first technical hero
  - split hero
- weak full-bleed heroes are replaced, reframed, or downgraded into safer treatments
- no hero image feels obviously generic, stretched, pixelated, or lazy
- no project-detail proof image is forced into a hero if it is too weak to carry one
- desktop and mobile hero crops feel intentional
- build/check/hygiene all pass
- no new overflow, broken images, or console errors

# Deliverables

- changed file list
- per-route hero decision summary
- validation summary
- note of any routes still intentionally provisional
- recommendation: ready for review / needs one more pass

# Stop conditions

- stop if a change requires public API or shared contract changes
- stop if asset quality is too weak and a design-pattern change is required instead
- stop if route scope starts to expand beyond the listed hero routes

# Implementation instructions

1. Inventory the current hero pattern used by each in-scope route.
2. Classify each as:
   - keep
   - re-crop
   - enhance
   - replace from local assets
   - convert to text-first hero
   - convert to split hero
3. Prioritize the worst offenders first.
4. Do not reopen already-approved project-proof routes unless there is a direct hero defect.
5. Prefer restrained overlays, technical backgrounds, and strong type hierarchy over weak wallpaper imagery.
6. If an image is too weak for hero duty, move away from a photo-heavy hero rather than over-processing it.
7. Run:
   - npm run check
   - npm run build
   - npm run check:repo-hygiene
8. Verify all touched routes at desktop and mobile width.

# Final output format

## Changed files

## Route-by-route hero decisions

## Validation results

## Remaining weak spots

## Recommendation
