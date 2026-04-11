# Last Breath Agent Playbook

## Summary

This repo uses a fixed three-model operating stack:

- `GPT-5.4` with `high` reasoning
- `Codex 5.3` with `xhigh` reasoning
- `Claude Haiku 4.5` with `medium` reasoning

Default rule: `Codex 5.3 xhigh` is the technical closer for code work.

## Role Ownership

### GPT-5.4 high
- Owns orchestration, decomposition, architecture/risk judgment, and conflict resolution.
- Is used only when the task is ambiguous, cross-cutting, or needs strategic judgment.
- Does not replace Codex as the final technical verifier.

### Codex 5.3 xhigh
- Owns implementation, repair, integration, build/test/browser verification, and the final technical pass.
- Is the default owner for bugfixes, refactors, and long-running coding work.
- Keeps work local unless a narrow delegated slice clearly reduces noise.

### Claude Haiku 4.5 medium
- Owns repetitive bounded work only.
- Good for inventories, selector sweeps, copy cleanup, issue grooming, and narrow transforms.
- Must not own architecture, shared contracts, auth, schema, or final verification.

## Default Workflow

Primary rhythm for this repo:

`GitHub context -> Figma reference -> Haiku prep if needed -> Codex implementation/testing -> GPT-5.4 only if architecture or risk review is needed`

### Marketing
- Start from GitHub context or a direct task.
- Use Figma as design reference, not code-generation source of truth.
- Use Playwright to verify meaningful UI changes.
- Keep final implementation and verification in Codex.

### Backend and Shared Work
- Use the same model ownership split.
- Escalate to GPT-5.4 only when changes cross `server`, `shared`, auth, schema, or portal boundaries.
- Keep all technical validation in Codex.

## Visible Delegation Policy

Every real delegation must be logged in chat before it happens.

### Required log contents
- target model
- reasoning level
- exact task
- scope or owned files
- whether the task is advisory or implementation-owned

### Example log lines
- `Delegating to Claude Haiku 4.5 medium for repetitive selector cleanup in marketing TSX files; implementation ownership stays local.`
- `Delegating to GPT-5.4 high for architecture review across shared/server/client boundaries; no final technical ownership is being transferred.`
- `Keeping this task local in Codex 5.3 xhigh because it requires real fixing, integration, and final verification.`

### No hidden delegation rule
- If no sub-agent is spawned, say the task stayed local.
- If a sub-agent is spawned, announce it before the handoff.
- Final task summaries must state which models actually participated.

## Final-Pass Policy

`Codex 5.3 xhigh` is the default final technical authority.

Required closeout order for implementation tasks:
1. Codex makes the fix.
2. Codex runs the nearest relevant verification.
3. Codex summarizes residual risk.
4. GPT-5.4 may optionally review for architecture or product-risk only if needed.

`GPT-5.4 high` is not the default final pass owner for code work.

## Verification Rules

Before claiming code work is complete, Codex should run the nearest relevant verification step:

- `npm run build` for production build breakage
- `npm run check` for type-level verification
- browser or Playwright verification for meaningful marketing UI work

If verification cannot run, the final response must say exactly what was not verified and why.

## MCP Stack

Active MCP stack for this repo:

- `github`
- `figma`
- `playwright`
- `context7`
- `io.github.AnimaApp/anima`

These are supporting tools, not autonomous agents.

## Workspace Notes

The workspace is intentionally split for focus, but it is still one app:

- `client/src/portals/marketing`
- `client/src/portals/client`
- `client/src/portals/internal`
- `server`
- `shared`

This means cross-portal or shared-contract work should be treated as one technical surface.
