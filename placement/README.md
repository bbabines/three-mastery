# Placement checks

A short, no-docs check that opens a domain's Loop 2, 3, or 4. It isn't timed. Passing every part suggests skipping that domain's drills for the loop; any miss suggests doing them. The first attempt counts.

Loop 1 has none, because it teaches rather than tests. To test out of a Loop 1 page, collapse A and B and go straight to the drill.

None are built yet. Layout when built: `placement/<loop>/<domain>/README.md` (frontmatter `id: <loop>.<domain>.placement`, `loop`, `domain`, `parts`), plus `check.ts` (the answers you fill in) and `check.test.ts` with one `describe` block per concept id, so `pick.ts` can log which parts missed. Reference answers go in `solutions/placement/<loop>/<domain>/check.ts`.
