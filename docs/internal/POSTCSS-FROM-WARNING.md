# PostCSS `from` Warning (Tracked Technical Debt)

## Warning Text
`A PostCSS plugin did not pass the \`from\` option to \`postcss.parse\`. This may cause imported assets to be incorrectly transformed. If you've recently added a PostCSS plugin that raised this warning, please contact the package author to fix the issue.`

## Repro Command
Run from repo root:

```bash
npm run build
```

This warning is still emitted after a successful production build.

## Likely Source Ownership
- Project PostCSS config is minimal and explicit (`tailwindcss` + `autoprefixer`) in [postcss.config.cjs](/d:/last_breath/postcss.config.cjs).
- Current build path does not include custom warning suppression patches (no `postcss-from-patch.cjs` preload in scripts).
- Strong candidate in dependency code:
  - [node_modules/tailwindcss/src/corePlugins.js](/d:/last_breath/node_modules/tailwindcss/src/corePlugins.js): `postcss.parse(...)` in `preflight` path without an explicit `from` option.
- Working assumption: this is upstream dependency behavior, not a repo-local warning-muffling issue.

## Risk Profile
- Severity: **Low** (build still succeeds, warning is visible and not suppressed).
- Potential impact: imported CSS asset transforms can be less deterministic in edge cases.
- Current exposure: limited/unknown in observed app behavior; no active runtime regressions linked to this warning in current QA matrix.

## Mitigation Window
- Target window: **Step 4+ hardening follow-up** (next technical debt pass after UI closure).
- Planned actions:
  1. Pinpoint exact emitting plugin/version via isolated CSS pipeline tracing.
  2. Check for upstream fixes in current `tailwindcss`/Vite/PostCSS stack.
  3. Upgrade/patch only if low-risk and reproducible.
  4. Keep warning visible until root-cause fix is confirmed.
