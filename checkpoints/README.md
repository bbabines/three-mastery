# Checkpoints

One timed, no-docs set per loop, sampling every domain. A loop ends when its checkpoint passes, and `pick.ts` won't move to the next loop until then.

None are built yet. Loop 1's checkpoint comes after Loop 1 exists for every domain.

**Loop 1's checkpoint is a read-the-code quiz,** like the Loop 1 pages, not a code test. Its design is still open: how many questions per domain, the time limit, and the pass bar. The tooling doesn't support it yet:

- `pick.ts` (`finishTimedCheck`) runs Vitest for placement checks and checkpoints.
- `coverage.ts` (`missingSolutions`) expects `solutions/checkpoints/<loop>/check.ts`.
- The drill viewer only loads pages from `/drills` and `/cross`.
- The quiz has no timer and doesn't report its score to `pick.ts`, which needs per-domain results to log which domains missed.

**Loops 2–4 checkpoints** can be code tests: `checkpoints/<loop>/README.md` (frontmatter `id: <loop>.checkpoint`, `loop`, `minutes`), plus `check.ts` and `check.test.ts` with one `describe` block per domain slug, so `pick.ts` can log which domains missed. Reference answers go in `solutions/checkpoints/<loop>/check.ts`.
