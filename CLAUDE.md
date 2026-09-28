# three.js foundations

Brad's repo for learning three.js and 3D graphics in plain language, then keeping the skills fresh with short drills. three.js is pinned to exactly r186 (`three@0.186.0`).

## Read first

- `docs/concept-inventory.md` is the source of truth. The copy on Brad's Desktop is older. If you want to add a concept, flag it to Brad instead of adding it.
- `docs/writing-pages.md` is the recipe for a Loop 1 page. Follow it for every new page.
- `docs/addendum-write-the-check.md` is Brad's proposal for Loops 3–4: some fix-the-bug drills also ask you to write the automated check that would have caught the bug. It isn't adopted. Don't build from it until Brad folds it into the inventory.
- `README.md` has the commands and repo layout.

## Status

Update this section whenever it changes.

- **Built:** the drill viewer (`/harness/`), `pick.ts`, `coverage.ts`, `verify.ts`, and Loop 1 for Domain 1 (12 pages). The sidebar shows the whole plan, with unbuilt pages greyed out. There are also sandboxes for TSL and Gaussian splats in `/experiments`.
- **Reviewed:** Brad approved the page format on Point vs direction. The other 11 Domain 1 pages haven't had a page-by-page review.
- **Next:** Loop 1 for Domains 2–14, in the order in `scripts/lib/domains.ts`. This is the inventory's build order: Loop 1 for every domain comes before any later loop. For each new domain, build its first page and show Brad before building the rest, because a new domain raises new questions. Show Brad each finished domain before starting the next.
- **Not built:** the Loop 1 checkpoint, Loops 2–4, Domain 15, the cross-domain drills, and placement checks for Loops 2–4.

## Decisions already made

Don't reopen these without Brad.

| Decision | Why |
| --- | --- |
| Loop 1 teaches: an A/B page plus a read-the-code drill for every concept | Brad is learning much of this for the first time. The original Loop 1 tested what you already knew and wasn't teachable. |
| No predictions anywhere | Brad didn't find them useful. A guess made before you understand the question teaches nothing. |
| Read the code replaces hand calculation | The goal is reading, debugging, and judging code. Nobody hand-computes a dot product. |
| No equations on pages, except one collapsed "The math, if you're curious" note | Formulas all over the page got in the way; seeing one once can help. |
| Light concepts get a Loop 1 page too, just shorter | They're building blocks: normalize is needed for dot product. |
| Pacing: all of Loop 1, then its checkpoint, then Loop 2 | Brad chose this over opening each domain's Loop 2 early. |
| No placement check in Loop 1 | Loop 1 teaches. To skip a known page, collapse A and B and do the drill. |
| Loop 2's "build it" means writing the real code where that's the practical skill, never re-implementing math three.js provides | Same reason as dropping hand calculation. |
| The concept list and teaching order live in `scripts/lib/domains.ts` | One source for the sidebar and for `pick.ts`. |
| TSL and Gaussian splats are sandboxes in `/experiments` only | The inventory keeps them out of the curriculum. |

These are current working rules that Brad hasn't explicitly confirmed. Follow them, and mention them if they cause trouble:

- **Theory becomes behavior.** Where the inventory states an idea as theory (w = 1 vs 0, the normal matrix as an inverse transpose), the page teaches what happens and which method does it. See "When the inventory's idea is theory" in `docs/writing-pages.md`.
- **Lenses on Loop 1 pages.** `lenses: []`, with spaces and costs described in plain words. The formal lens sections start with code drills in Loop 2.
- **Consecutive contexts.** The inventory's "no two consecutive drills in a domain share a use context" is checked per concept, since each concept has its own contexts.

## Open needs

Settle these before, or while, building the domains that need them.

- **The Loop 1 checkpoint** has no design yet (question count, time limit, pass bar), and the tooling expects a code test. See `checkpoints/README.md`.
- **Scores aren't logged.** A Loop 1 page is finished with `npm run pick -- done --pass`, which is self-reported. The quiz score never reaches `pick.ts`.
- **Assets and scene graph domains (6–7)** want real loaded models. The repo has none and no loader helpers; check model licenses before adding any.
- **Interaction domain (9):** drag scenes need pointer helpers, and a way to pause the `OrbitControls` the harness always turns on (`harness/scene.ts`).
- **GPU and optimization domains (10, 14):** Loop 1 describes costs in plain words. Measuring them in Loop 2 needs harness support, such as frame time and `renderer.info` readouts.
- **No version history.** The folder isn't a git repository yet.

## How Brad likes to work

- Plain language, on pages and in chat. Explain jargon or leave it out.
- Give a recommendation, not a menu. When Brad asks "does that make sense?", answer it directly.
- Build a small version, let Brad review it, then scale up.
- Brad likes seeing what's ahead; the sidebar shows the full plan for that reason.
- Brad reviews in the Claude desktop app's browser pane. `.claude/launch.json` starts the dev server on port 5173.

## Gotchas

- `import.meta.glob` options must be an inline object literal, not a variable.
- Vitest hides the output of passing tests when it detects an AI agent. Pass `--silent=false` if you need to see it.
- The browser pane may be hidden, and a screenshot taken right after a scripted scroll can come back stale. Take a throwaway screenshot at scale 0.1 first. DOM checks through JavaScript are always reliable.
- A collapsed page section gives its scenes zero size. `harness/scene.ts` skips resizing at zero, so the camera's aspect ratio doesn't become NaN.
- `THREE.Clock` is deprecated as of r183. Use `THREE.Timer`.
- `three/webgpu` and `three` share `three.core.js`, so addons such as `OrbitControls` work on TSL pages.
- A line whose end points move needs `frustumCulled = false`; `line()` in `harness/lesson.ts` sets it.
- In a `ShaderMaterial`, add `#include <colorspace_fragment>` at the end of the fragment shader for correct output color.
- `sub`, `add`, `cross`, `normalize`, and `multiplyScalar` change the vector they're called on. Clone first in scene code.
- `COVERAGE.md` counts a misconception as exposed when a page lists it in its frontmatter. Whether a question really exposes it is for you to check.
