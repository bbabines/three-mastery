# Addendum: write the check that would have caught it

Sep 28, 2026 · Brad

**Status: adopted Sep 28, 2026,** in `concept-inventory.md` under "Code drill format", with one change: the check step goes on every break-and-fix drill where the bug can be checked automatically, not only about one per core concept. Nothing is timed, so rule 5 is about size rather than minutes. This file keeps the reasoning, rules, and examples.

## What

Some break-and-fix drills get a second step. After you find and fix the bug, you write a small automated check that fails on the broken code and passes on the fixed code. The question changes from "what's wrong?" to "what's wrong, and how would the repo catch it next time without me?"

The check is the kind a real repo would keep: a Vitest test, an invariant assertion, or a budget. It isn't a test of the drill.

## Why

More and more 3D code will be written or edited by AI. What a person adds is judgment about what "correct" means, and that judgment is worth the most once it's written into checks that run on every change, whoever or whatever made it.

- **3D is hard to check automatically.** Most "correct" in 3D is visual or depends on the device, which is why AI code generation lags TypeScript here. Each check you write turns one piece of "I'd notice that" into something a machine notices.
- **It fits a stable repo.** In code that rarely changes, bugs arrive with a three.js upgrade, a browser update, a new device, or an edit that looked fine. Checks are the memory that stays when you haven't touched the code in months.
- **It deepens diagnosis.** To write the check, you have to name the invariant that broke: "the world normal is perpendicular to the surface," not "the marker looked sideways." Naming it is the real understanding.
- **Knowing when a check isn't possible counts too.** Some bugs can only be caught by looking. Saying why, and what a person has to look at, is part of the skill.

## How it fits the loops

- **Loop 3 (diagnosis):** the main home. A share of break-and-fix drills, roughly one per core concept, gets the check step. Not every drill, so the loop stays quick.
- **Loop 4 (judgment):** an AI-review drill can end the same way. You find the flaw in generated code, then write the check that would have rejected it.
- **Loops 1–2:** unchanged.

## Rules for the check

1. **It fails on the broken version and passes on the fixed one.** This is the same invariant `verify.ts` already proves for starters and solutions, applied to the bug.
2. **Test behavior, not the implementation.** Assert what must be true, like "hit point is on the surface" or "memory returns to baseline," not which lines the fix changed. A good check also catches a *different* wrong fix.
3. **Compute expected values with three.js,** as code drills already do. No hardcoded magic numbers, no re-implemented math.
4. **Test the general case, not the one input from the drill.** If the bug appears under non-uniform scale, the check uses non-uniform scale on purpose.
5. **Keep it small.** The check is a short second step, not a project. If a drill gets big, split it into a fix drill and a check drill.
6. **If it can't be automated, write down why.** Give one or two sentences on what a person must look at and why a test can't see it. That's a valid answer.

## Kinds of checks

| Kind | What it asserts | Example |
| --- | --- | --- |
| Value | A result matches what three.js computes | The signed angle has the right sign for a left turn |
| Invariant | Something that must always be true | A world-space normal stays perpendicular to the world-space surface edges |
| Guard | Bad input gives a safe result, not NaN or a crash | The angle between two nearly identical unit vectors is a finite number |
| Timing | A value is current when it's read | A raycast right after a move hits the object in its new position |
| Budget | A number stays under a limit | Geometry and texture counts go back to baseline after 20 variant swaps |
| Visual | Needs eyes, or a screenshot comparison | Colors look washed out from a wrong texture color space |

## Examples from the inventory

**Marker flush on a clicked surface** (cross-domain: 2, 5, 8). The bug: `face.normal` is transformed like a direction, so the marker tilts on a non-uniformly scaled part. The check scales the parent `(3, 1, 1)`, rotates it, raycasts a face that slopes relative to the stretch (a cone's side, or a part turned inside the stretched parent; a face lined up with the parent's axes keeps a correct normal either way), then asserts the marker's world-space up is perpendicular to two world-space edges of the hit triangle. It fails with `transformDirection` and passes with the normal matrix.

**acos of an unclamped dot** (Domain 1). The bug: `Math.acos(a.dot(b))` returns NaN when rounding pushes the dot a hair above 1. The check feeds in two unit vectors that differ only by float noise and asserts the angle is finite. It guards against any future edit that drops the clamp.

**Raycast right after a move** (Domain 2, update timing). The bug: reading `matrixWorld` before it's updated. The check moves an object, raycasts at its new position in the same tick, and asserts a hit. It fails without `updateMatrixWorld()`.

**Memory climbs after 20 variant swaps** (cross-domain: 6, 7, 14). The bug: swapped-out materials and textures are never disposed. The check records `renderer.info.memory`, swaps variants 20 times, and asserts the geometry and texture counts return to baseline. `renderer.info.memory` doesn't count materials, so for those it also checks `renderer.info.programs.length` or counts `dispose` events. This needs a real WebGL context; see open questions.

**Chrome finish looks black on mobile** (cross-domain: 6, 11, 13). This is partly visual. A check can assert that the environment map is set and its texture format is supported. Whether it *looks* right needs a person or a screenshot comparison, and the answer should say so.

## Open questions

- **Where browser checks run.** Vitest runs in Node without WebGL. Value, invariant, guard and timing checks work today. Budget and visual checks need a browser: Vitest browser mode, Playwright, or a check page in `/harness`. Decide when the first Loop 3 drill needs one.
- **Frontmatter.** One option is a `check: true` field, so `coverage.ts` can report which concepts have a check drill and `verify.ts` can prove each check fails on the broken code. Another is a sub-mode of break-and-fix.
- **How many.** The proposal is about one per core concept in Loop 3, plus the cross-domain drills where it fits naturally. Adjust once a few have been tried.
