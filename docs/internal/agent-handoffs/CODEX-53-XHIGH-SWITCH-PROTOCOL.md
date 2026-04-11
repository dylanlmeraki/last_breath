# Codex 5.3 xHigh Switch Protocol

## Purpose
- Preserve the current Pacific Engineering marketing-site context before switching from GPT-5.4 to Codex 5.3 xhigh.
- Keep the next model aligned to the locked Step 4 design direction, repo truths, and validation standards.

## Current MCP Reality
- `.vscode/mcp.json` is configured with `filesystem`, `fetch`, `figma`, `github`, `playwright`, `context7`, and `anima`.
- In this session, `filesystem` MCP did **not** complete handshake within 10 seconds, so it should not be treated as the primary preservation mechanism for the switch itself.
- Use the chat thread as the first preservation layer if the host UI supports an in-place model switch.
- Use this file plus [CODEX-53-XHIGH-TRACE.json](/d:/last_breath/docs/internal/agent-handoffs/CODEX-53-XHIGH-TRACE.json) as the fallback preservation layer if the host opens a fresh panel or loses in-memory continuity.

## Preferred Switch Sequence
1. Switch the host model to `Codex 5.3 xhigh` in the **same thread/panel** if possible.
2. After the switch, re-open this file and [CODEX-53-XHIGH-TRACE.json](/d:/last_breath/docs/internal/agent-handoffs/CODEX-53-XHIGH-TRACE.json) before starting edits.
3. If the host forces a new thread, paste the prompt capsule below into the new session and continue from the listed next actions.

## Prompt Capsule
```text
You are Codex 5.3 xhigh. Continue this task using the provided evidence and trace. Do not reinvent requirements.

PROJECT SUMMARY
- Repo: d:\last_breath
- Current focus: Pacific Engineering marketing-site Step 4 visual recovery
- Step 3 is effectively closed; Step 4 is active but still needs shell contrast correction, Home evidence rebuild, Gallery convergence, and a mobile catch-up pass
- Filesystem MCP is configured in .vscode/mcp.json but timed out on handshake from the prior session, so rely on repo-local handoff files first
- Preserve public routes, current palette authority in marketing.css, mobile sticky CTA behavior, and backend seams

EVIDENCE (paths)
- d:\last_breath\.vscode\mcp.json
- d:\last_breath\MCP-FILESYSTEM-SETUP.md
- d:\last_breath\client\.sixth\MCP-SKILLS.md
- d:\last_breath\client\src\portals\marketing\layout\MarketingLayout.tsx
- d:\last_breath\client\src\portals\marketing\pages\HomeRecovered.tsx
- d:\last_breath\client\src\portals\marketing\components\HomeProjectEvidence.tsx
- d:\last_breath\client\src\portals\marketing\components\ProjectSnippetRotator.tsx
- d:\last_breath\client\src\portals\marketing\components\ProjectGalleryMap.tsx
- d:\last_breath\client\src\portals\marketing\pages\ProjectGalleryRecovered.tsx
- d:\last_breath\client\src\portals\marketing\pages\About.tsx
- d:\last_breath\client\src\portals\marketing\components\AboutTeamGrid.tsx
- d:\last_breath\client\src\portals\marketing\data\aboutTeamProfiles.ts
- d:\last_breath\client\src\portals\marketing\marketing.css
- d:\last_breath\artifacts\step4-team-mobile-pass\summary.json
- d:\last_breath\artifacts\step4-team-mobile-pass\home-mobile.png
- d:\last_breath\artifacts\step4-team-mobile-pass\about-desktop.png
- d:\last_breath\artifacts\step4-team-mobile-pass\gallery-compact.png
- d:\last_breath\docs\internal\agent-handoffs\CODEX-53-XHIGH-TRACE.json

CURRENT TRACE SNAPSHOT (JSON)
- Open d:\last_breath\docs\internal\agent-handoffs\CODEX-53-XHIGH-TRACE.json and use it as the working trace.

WHAT YOU MUST DO NEXT
1) Execute Pass 1 from the locked Step 4 recovery runbook: reset shell/header contrast, make dropdowns opaque and readable, keep the hero but reduce technical-overlay noise, and make the mobile sticky CTA fully opaque with the same background family as its chevron toggle.
2) Execute Pass 2: rebuild the Home evidence block toward the Figma property-listing composition using the locked nodes, with a smaller, real-map-style panel and tighter project record cards.
3) Execute Pass 3: bring Gallery into the same record/map language without changing its behavior.
4) Execute Pass 4: do the mobile catch-up pass only after desktop and compact desktop are correct.

CONSTRAINTS
- Preserve the brand palette authority in `client/src/portals/marketing/marketing.css`
- No backend seam changes
- No API URL changes
- Keep the homepage order unchanged
- Keep the mobile sticky CTA in place and unchanged functionally
- Make only minimal changes to the bottom CTA sections
- Use `Pacific Engineering` or `Pacific Engineering & Construction Inc.` depending on context; do not use bare `Pacific` as the primary brand label
- Reduce SaaS/startup gloss; increase construction-professional clarity, restraint, and credibility

SUCCESS CRITERIA
- Header lockup and nav are readable at first glance
- Dropdowns are opaque and legible
- Mobile sticky CTA remains mobile-only and fully opaque
- Home evidence block reads like the Figma property-listing pattern adapted to Pacific Engineering
- Home and Gallery share a calmer record/map language
- Mobile reads shorter, clearer, and less translucent
- No overflow, no console errors, no chatbot/header/sticky CTA conflicts

VALIDATION COMMANDS
- npm run check
- npm run build
- npm run check:repo-hygiene

OUTPUT EXPECTATIONS
- Provide a short plan
- Apply minimal-drift code changes
- Report results of each validation command
```

## Locked Figma References
- `35:15`: restrained hero tone
- `35:2363`: Home property-listing style evidence composition
- `41:142` and `41:143`: map tone, marker restraint, relevant-work framing
- Reserved for later pass:
  - `35:3`: team/About card refinement
  - `38:688`: resource/document-card refinement

## Current Repo Truths
- `.vscode/mcp.json` now includes `filesystem` and `fetch`.
- `git status --short` currently shows local MCP-related work in progress:
  - modified: `.vscode/mcp.json`, `mcp-client.ts`, `tsconfig.json`
  - untracked: `MCP-FILESYSTEM-SETUP.md`, `client/.sixth/MCP-SKILLS.md`, `client/.sixth/skills/config-management/`, `client/.sixth/skills/filesystem/`, `client/.sixth/skills/project-scaffold/`, `mcp-examples.ts`
- The custom `postcss-from-patch.cjs` file is no longer present.
- `build.ts` runs Vite directly without the old warning-suppression preload.
- `tsconfig.json` no longer contains the invalid `ignoreDeprecations: "6.0"` setting.

## Last Thread-Validated Product State
- `npm run check`, `npm run build`, and `npm run check:repo-hygiene` were green after the latest About/team and mobile-tightening pass.
- The known technical caveat remains the visible PostCSS warning:
  - `A PostCSS plugin did not pass the from option to postcss.parse...`
- Verified artifacts from the latest major pass exist under:
  - `artifacts/step4-team-mobile-pass/`

## Visual Problems Still Open
- Header contrast and dropdown readability are still not acceptable.
- Home spacing and composition still feel off, especially in the evidence/map region.
- Home map and snippet area do not yet feel close enough to the Figma property-listing frame.
- Mobile still reads too tall, too soft, and too translucent.

## Next Pass Order
1. Shell contrast and readability reset
2. Home evidence rebuild using listing-style project records + smaller real-map presentation
3. Gallery convergence to the same evidence language
4. Mobile catch-up pass after desktop is right

## Notes On Tools
- Use `sequential-workbench` discipline for a concise decision trace and durable handoff updates.
- Use Figma MCP/context as the visual source of truth if available from the active session.
- Prefer Playwright for verification when the embedded browser is free; use Puppeteer fallback if Playwright is occupied.
