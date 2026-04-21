# .ops

This folder holds machine-adjacent operational artifacts for `last_breath`.

Rules:

- `prompts/` = reusable model instructions
- `packets/active/` = current execution packets
- `packets/archive/` = completed packets
- `reviews/` = critique and acceptance notes
- `route-inventories/` = route-specific implementation and QA summaries
- `release-gates/` = final readiness and go/no-go docs
- `artifacts/` = local screenshots, exports, and working notes

Conventions:

- Packet IDs use `PHASE-NNN-short-name`
- Every packet must define:
  - objective
  - constraints
  - in-scope routes/files
  - out-of-scope
  - acceptance criteria
  - deliverables
  - stop conditions
- No packet should assume contract changes unless explicitly authorized.
