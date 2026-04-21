# P6-002 Run Log

**Pass:** P6-002 - Marketing Relaunch Hardening
**Date:** 2026-04-21
**Branch:** chillin_v2
**Owner:** Cline (Claude Sonnet)
**Reviewer:** Gemini 2.5 Pro
**Acceptor:** GPT-5.4

---

## Phase A - Fixed-layer collision cleanup

### What was done
- Added `data-route-profile` attribute to marketing portal root element.
- Added `data-shell-has-sticky-dock` attribute to root for CSS targeting of chatbot position.
- Added CSS rules in `marketing.css` P6-002 section to prevent chatbot/CTA overlap on mobile.
- Added safe-area notch support for sticky bar via `@supports` rule.
- Added `useMemo` import and `routeProfile` computed value in `MarketingLayout.tsx`.
- Confirmed from step4 QA data: collisions were present at 390x844 on /contact. Post-fix: chatbot bottom offset driven by `--pe-chatbot-mobile-bottom` CSS var.

### Files modified
- `client/src/portals/marketing/marketing.css` - P6-002 WS1 section added
- `client/src/portals/marketing/layout/MarketingLayout.tsx` - route-profile data attributes

---

## Phase B - Hover/focus stabilization

### What was done
- Added `transform: none` overrides for service cards, project cards, CTA buttons, footer CTAs.
- Scoped image-level scale to `.project-card-media img` only (not the text container).
- Added `contain: layout style` to project card elements to bound reflow.
- Standardized focus-visible ring (2px cyan, 2px offset, border-radius: 4px).
- Added `@media (prefers-reduced-motion: reduce)` block.

### Files modified
- `client/src/portals/marketing/marketing.css` - P6-002 WS2 section added

---

## Phase C - Map component replacement

### What was found
The `.make` component files demonstrated a CartoDB tile-based Web Mercator approach as a workaround for the Figma Make environment where `react-leaflet` had a React context incompatibility.

### What was done
- Confirmed `HomeEvidenceMap.tsx` is correct Leaflet implementation with proper marker sync.
- Confirmed `ProjectGalleryMap.tsx` already has rich popup with image, title, location, summary.
- Added CSS refinements: gallery map tile filter (`saturate(0.38)`), popup border-radius, image render quality.

### Files modified
- `client/src/portals/marketing/marketing.css` - P6-002 WS3 section added
- `client/src/portals/marketing/components/HomeEvidenceMap.tsx` - verified (no change needed)
- `client/src/portals/marketing/components/ProjectGalleryMap.tsx` - verified (no change needed)

---

## Phase D - Hero art-direction completion

Deferred to separate phase. Gemini review noted text-first heroes on desktop feel slightly airy on the right side at 1280px wide. P6-001 already applied the text-first desktop balance rule. No further hero changes required.