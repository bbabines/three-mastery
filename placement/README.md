# Placement checks

A timed, no-docs check of 2–3 minutes that opens a domain's Loop 2, 3, or 4. Passing every part skips that domain's drills for the loop; any miss means doing them. The first attempt counts.

Loop 1 has none, because it teaches rather than tests. To test out of a Loop 1 page, collapse A and B and go straight to the drill.

None are built yet. Layout when built: `placement/<loop>/<domain>/README.md` (frontmatter `id: <loop>.<domain>.placement`, `loop`, `domain`, `minutes`, `parts`), plus the check itself, with one part per concept so `pick.ts` can log which parts missed.
