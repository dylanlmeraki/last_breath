# PostCSS `from` Warning (Resolved)

## Warning Text
`A PostCSS plugin did not pass the \`from\` option to \`postcss.parse\`. This may cause imported assets to be incorrectly transformed. If you've recently added a PostCSS plugin that raised this warning, please contact the package author to fix the issue.`

## Root Cause (2026-04-12)
- `npm run build` previously emitted the warning after a successful bundle.
- The warning is raised by Vite's CSS URL rewrite plugin when it sees declarations with missing `declaration.source.input.file`.
- Tailwind-generated declarations (notably pseudo-element/content utility output) can arrive without `source.input.file` metadata, which triggers the warning path even when declaration values do not contain URLs.

## Ownership Classification
- `rootCause`: missing declaration source-file metadata during PostCSS pipeline handoff to Vite URL rewrite.
- `owner`: `integration` (Tailwind-generated AST metadata + Vite URL rewrite assumption).
- `risk`: low.
- `proposed fix`: populate missing declaration `source.input.file` metadata in the local PostCSS pipeline before Vite URL rewrite executes.

## Exact Fix
- Updated [postcss.config.cjs](/d:/last_breath/postcss.config.cjs):
  - Removed temporary parse monkeypatch experiment.
  - Added `ensure-declaration-source-file` PostCSS plugin after `tailwindcss()` and `autoprefixer()`.
  - Plugin behavior:
    - Reads `root.source.input.file` once.
    - For each declaration lacking `source` or `source.input.file`, injects the root input metadata.
    - Does **not** alter selectors, declarations, values, or ordering.

## Why This Is Safe
- Metadata-only patch: no CSS token/value/selector transforms are performed.
- No API/server/shared contract files touched.
- CSS output parity verified by SHA256 hashes (before vs after) for key built assets:
  - `dist/public/assets/index-dl0nvYH1.css`
  - `dist/public/assets/MarketingApp-WMDnX4Fj.css`
  - `dist/public/assets/mapFoundation-Dgihpmma.css`
  - All hashes unchanged.

## Validation
- `npm run build`:
  - before: warning present.
  - after: warning no longer emitted.
- `npm run check`: pass.
- `npm run check:repo-hygiene`: pass.
- Focused visual smoke (Playwright MCP) on `/`, `/project-gallery`, `/contact`, `/blog`:
  - zero console errors
  - zero page errors
  - zero horizontal overflow flags.

## Remaining Risk
- Low residual risk: if a future pipeline change produces a root without `source.input.file`, warning behavior could reappear and should be re-evaluated.
