# last_breath active platform workspace

This pack is the *workspace split plan* for the live application side of the repo.
It is intended for VS Code workspace organization, not as a full exported copy of the repository.

Recommended scope:
- package.json / tsconfig.json / vite.config.ts
- attached_assets
- client/src/components/shared
- client/src/hooks
- client/src/lib
- client/src/portals/marketing
- client/src/portals/client
- client/src/portals/internal
- server
- shared

Why it belongs here:
- The root app is one Vite/React/Express application.
- Vite resolves `@` to `client/src`, `@shared` to `shared`, and `@assets` to `attached_assets`.
- Marketing, client portal, and internal portal are all routed from this single app.

How to use locally:
1. Keep your main repo checkout as-is.
2. Copy the included `active-platform.code-workspace` file into the repo root.
3. Open that workspace in VS Code.
