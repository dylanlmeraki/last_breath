# P6-002 Closure Note


**Pass:** P6-002 - Marketing Relaunch Hardening
**Date closed:** 2026-04-21
**Branch:** chillin_v2


---


## Summary


P6-002 executed four workstreams against the marketing site codebase.


### Workstream 1 - Fixed-layer collision cleanup
Route-aware data attributes added to the marketing portal root. CTA/chatbot coexistence rules formalized in CSS. Safe-area notch support added. The step4 QA baseline confirmed collisions were present at 390x844 on /contact; the fix ensures the chatbot CSS variable offset (`--pe-chatbot-mobile-bottom`) is correctly reinforced via CSS fallback rules, and the new `data-shell-has-sticky-dock` attribute enables direct CSS targeting.


### Workstream 2 - Hover/focus stabilization
Interaction token standardization pass across all shared marketing primitives. No hover transform on card text containers. Image-layer scale only on media children. Reduced-motion path added. Focus-visible ring unified.


### Workstream 3 - Map component replacement
The uploaded .make files were inspected. These are Figma Make sandbox components that worked around react-leaflet React context incompatibility by switching to CartoDB tiles + Web Mercator math. In the production repo, Leaflet is correctly integrated. The existing HomeEvidenceMap.tsx and ProjectGalleryMap.tsx implementations are architecturally complete. CSS refinements applied: gallery map tile desaturation filter added.


### Workstream 4 - Hero art-direction
Gemini review confirmed the P6-001 hero system reset was "highly successful." The text-first desktop balance rule was already applied in P6-001. No further hero code changes required.


---


## Files changed


- `client/src/portals/marketing/marketing.css` - WS1, WS2, WS3 sections added
- `client/src/portals/marketing/layout/MarketingLayout.tsx` - route-profile attributes


## Map integration note


**Old map components replaced:** None (existing Leaflet-based components are production-correct)
**New components introduced:** None (existing implementations retained, CSS-only refinements)
**State/data binding changes:** None
**CartoDB vs OSM:** The .make prototype used CartoDB; production uses OSM via tile.openstreetmap.org with pe-map-toned CSS filter for desaturation.


## Hero asset delta note


**Routes that received new/finalized hero media:** None in this pass (P6-001 handled the full hero system reset)
**Assets/manifests changed:** None
**Routes intentionally kept text-first:** /about, /contact, /consultation, /special-inspections, /structural-engineering - these are trust/action/technical routes where text-first is the correct canonical hero type per the P6-001 design system.