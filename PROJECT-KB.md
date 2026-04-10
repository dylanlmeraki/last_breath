# Project Knowledge Base

## Project
- **Name**: Pacific Engineering marketing site
- **Repo root**: `d:\last_breath`
- **Current phase**: Step 4 visual recovery and Figma alignment

## Durable Decisions
- Use `Pacific Engineering` or `Pacific Engineering & Construction Inc.` depending on context.
- Do **not** use bare `Pacific` as the primary brand label.
- Keep the brand palette authority in [marketing.css](/d:/last_breath/client/src/portals/marketing/marketing.css).
- Keep the homepage section order unchanged during Step 4 recovery.
- Keep the mobile sticky CTA in place and unchanged functionally.
- Make only minimal changes to the bottom CTA sections.
- Preserve public routes and backend seams.

## Locked Design Direction
- The site should feel more like a serious Bay Area engineering and construction partner and less like a SaaS/startup marketing site.
- Priorities:
  - trust
  - proof
  - hierarchy
  - clarity
  - restraint
  - composure
- Visual corrections currently prioritized:
  - readable header/wordmark/nav
  - opaque, legible dropdowns
  - solid, readable mobile sticky CTA
  - Home evidence area rebuilt as project-record evidence rather than feature marketing
  - Gallery visually converged to the same map/record language

## Locked Figma References
- `35:15`: restrained hero tone
- `35:2363`: Home property-listing evidence composition
- `41:142`, `41:143`: map tone and relevant-work structure
- Later pass:
  - `35:3`: About/team card refinement
  - `38:688`: resource/document-card refinement

## Important Repo Truths
- `.vscode/mcp.json` includes `filesystem` and `fetch`.
- Filesystem MCP is configured, but it timed out on handshake from the latest GPT-5.4 session.
- `build.ts` no longer relies on the old warning-suppression preload.
- `postcss-from-patch.cjs` is not present.
- `tsconfig.json` no longer contains the invalid `ignoreDeprecations: "6.0"` setting.

## Known Technical Caveat
- `npm run build` still surfaces the visible PostCSS warning:
  - `A PostCSS plugin did not pass the from option to postcss.parse...`
- This warning is intentionally **visible**, not suppressed.

## Canonical Marketing Files
- [MarketingLayout.tsx](/d:/last_breath/client/src/portals/marketing/layout/MarketingLayout.tsx)
- [HomeRecovered.tsx](/d:/last_breath/client/src/portals/marketing/pages/HomeRecovered.tsx)
- [HomeProjectEvidence.tsx](/d:/last_breath/client/src/portals/marketing/components/HomeProjectEvidence.tsx)
- [ProjectSnippetRotator.tsx](/d:/last_breath/client/src/portals/marketing/components/ProjectSnippetRotator.tsx)
- [ProjectGalleryMap.tsx](/d:/last_breath/client/src/portals/marketing/components/ProjectGalleryMap.tsx)
- [ProjectGalleryRecovered.tsx](/d:/last_breath/client/src/portals/marketing/pages/ProjectGalleryRecovered.tsx)
- [About.tsx](/d:/last_breath/client/src/portals/marketing/pages/About.tsx)
- [AboutTeamGrid.tsx](/d:/last_breath/client/src/portals/marketing/components/AboutTeamGrid.tsx)
- [aboutTeamProfiles.ts](/d:/last_breath/client/src/portals/marketing/data/aboutTeamProfiles.ts)
- [marketing.css](/d:/last_breath/client/src/portals/marketing/marketing.css)

## Next Pass Order
1. Shell contrast and readability reset
2. Home evidence rebuild using listing-style project records + smaller real-map presentation
3. Gallery convergence to the same evidence language
4. Mobile catch-up pass after desktop is right

## Standard Validation
- `npm run check`
- `npm run build`
- `npm run check:repo-hygiene`

## Browser Verification Targets
- Routes:
  - `/`
  - `/project-gallery`
  - `/about`
  - `/contact`
  - `/blog`
- Viewports:
  - `390x844`
  - `430x932`
  - `1100x760`
  - `1280x800`
  - `1440x900`
  - `1728x1117`
