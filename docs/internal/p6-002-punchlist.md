# P6-002 Punchlist


**Pass:** P6-002 - Marketing Relaunch Hardening
**Status:** Implementation complete, validation pending


---


## Resolved items


| # | Workstream | Item | Status |
|---|-----------|------|--------|
| 1 | WS1 | Chatbot overlaps form inputs at 390x844 on /contact | Fixed via route-profile data attribute + CSS clearance rules |
| 2 | WS1 | Chatbot/CTA stack on mobile | Fixed via data-shell-has-sticky-dock CSS targeting |
| 3 | WS1 | Missing safe-area notch support for sticky bar | Fixed via @supports rule |
| 4 | WS2 | Project card hover causes transform/reflow | Fixed: transform:none on cards, scale only on img layer |
| 5 | WS2 | No reduced-motion path for hover animations | Fixed: @media (prefers-reduced-motion) block added |
| 6 | WS2 | Focus-visible inconsistency | Fixed: unified ring style |
| 7 | WS3 | .make components inspected and architecture extracted | Done: CartoDB/Web Mercator noted, Leaflet confirmed superior |
| 8 | WS3 | Gallery map tile saturation too vivid | Fixed: saturate(0.38) filter added to gallery map tiles |
| 9 | WS4 | Hero art-direction review | P6-001 already addressed; Gemini confirmed system successful |


## Open items / known defects


| # | Severity | Item | Owner |
|---|---------|------|-------|
| 1 | Low | Hero text-first desktop balance - P6-001 rule present; may need viewport fine-tuning | Next pass |
| 2 | Low | Screenshot matrix validation not yet run (dev server required) | Next pass |
| 3 | Info | Map .make components used CartoDB tiles as Figma Make workaround | N/A |