# three.js foundations

Brad's repo for learning three.js and 3D graphics in plain language, then keeping the skills fresh with short drills. three.js is pinned to exactly r186 (`three@0.186.0`).

## Read first

- `docs/concept-inventory.md` is the source of truth. The copy on Brad's Desktop is older. If you want to add a concept, flag it to Brad instead of adding it.
- `docs/writing-pages.md` is the recipe for a Loop 1 page. Follow it for every new page.
- `docs/addendum-write-the-check.md` has the rules and examples for writing the automated check at the end of a break-and-fix drill. It's adopted; its status line records one change to it.
- `README.md` has the commands and repo layout.
- `docs/brief-interview-review.md` records the changes from the interview-readiness review and why. Its status line says which are applied. `docs/r186-check/` is the r186 check's report and evidence.

## Status

Update this section whenever it changes.

- **Built:** the drill viewer (`/harness/`), `pick.ts`, `coverage.ts`, `verify.ts`, and Loop 1 for Domains 1 and 2 (12 and 12 pages, counting the Object3D API tour). On Sep 29, 2026 Brad asked for every remaining domain to be built in one go, committed and pushed a domain at a time, without the usual per-domain review; built so far: Domain 4 (10 pages). The sidebar shows the whole plan, with unbuilt pages greyed out and finished pages ticked; `progress/log.jsonl` has what Brad has finished. There are also sandboxes for TSL and Gaussian splats in `/experiments`.
- **Reviewed:** Brad approved the page format on Point vs direction, the wording on Local vs world space, and Domain 2 as a whole. The other Domain 1 pages haven't had a page-by-page review; Brad was reminded when Domain 2 started. None of the Domain 3–14 pages has been reviewed yet.
- **r186 check:** done, and its fixes applied Sep 29, 2026 (`docs/r186-check/`). The Pivots page now teaches `Object3D.pivot` and what it changes; that addition hasn't been reviewed.
- **Next:** Brad reviews the Object3D API tour, the first tour page. The other six tours (object types, loaders and textures, controls, renderer settings, materials, lights) are built with their domains, as each domain's first page, once Brad approves the format. Domain 3 is on hold until Brad says to start it; then Loop 1 for Domains 3–14 in the order in `scripts/lib/domains.ts`. This is the inventory's build order: Loop 1 for every domain comes before any later loop. For each new domain, build its first page and show Brad before building the rest, because a new domain raises new questions. Show Brad each finished domain before starting the next.
- **Not built:** the Loop 1 checkpoint, Loops 2–4, the two electives (Domain 15 VFX and Blank-file scenes), the cross-domain drills, and placement checks for Loops 2–4.

## Decisions already made

Don't reopen these without Brad.

**What a page teaches**

| Decision | Why |
| --- | --- |
| Loop 1 teaches: an A/B page plus a read-the-code drill for every concept | Brad is learning much of this for the first time. The original Loop 1 tested what you already knew and wasn't teachable. |
| Every page opens with the concept in one sentence and several unrelated uses | Brad once thought the dot product was only for cameras, because every example Brad saw used one. The goal is to know what a concept is, what it's used for, and to talk about it at a high level. |
| Varied use contexts across drills are a nudge, not a rule | Same reason. `coverage.ts` checks repeats per concept, since each concept has its own contexts. |
| No predictions anywhere | Brad didn't find them useful. A guess made before you understand the question teaches nothing. |
| Read the code replaces hand calculation | The goal is reading, debugging, and judging code. Nobody hand-computes a dot product. |
| Theory becomes behavior: teach what happens and which method does it | Brad won't remember equations, and they make Brad's eyes glaze over. |
| At most one formula per page, in a collapsed "The math, if you're curious" note that names the technical term | Naming the term (w component, inverse transpose) means Brad recognizes it later in docs and forums. |
| Light concepts get a Loop 1 page too, just shorter | They're building blocks: normalize is needed for dot product. |
| Loop 1 pages use `lenses: []`, describing spaces and costs in plain words | The formal lens sections start with code drills in Loop 2. |
| Every Domain 2 page has a "Which space is it in?" table in B | Domain 2 is about spaces; the table makes the inventory's "every drill names its spaces" concrete. |
| Tour pages: a light page per family of classes (Object3D API, object types, loaders and textures, controls, renderer settings, materials, lights), first in its domain | Interviews often open with these basics before going deep. `writing-pages.md` has the variant. |
| B shows the exact syntax a developer types, including setup lines like `setPixelRatio` and `updateProjectionMatrix` | Blank-file drills (a scene from an empty file) are deferred to after Loop 4, so the syntax is learned on the pages that teach each piece. |
| Normals and raycasting use three.js's methods (`Triangle.getNormal`, `ray.intersectBox`, …), never hand-built math; the raycasting code around them is typed from memory | Same reason as dropping hand calculation. Writing the code that uses the methods is the practical skill. |

**How the loops work**

| Decision | Why |
| --- | --- |
| Nothing is timed: no time limits, no timers, no minutes logged, and no time estimates on pages | Brad switches contexts constantly at work, so time spent says nothing. `pick.ts` logs only the date a drill was finished, which it needs for spacing. |
| One exception: the sidebar's footer shows when the current Loop 1 domain and all of Loop 1 would be done at one page a day (`renderPace` in `harness/nav.ts`). It counts pages left, not time spent, and moves up when Brad does more than one a day | Brad's goal is one page a day and asked for something to aim for. An all-loops date was tried and removed: it pushed Brad toward getting done over learning. Don't add it back unless Brad asks. |
| Pacing: all of Loop 1, then its checkpoint, then Loop 2 | Brad chose this over opening each domain's Loop 2 early. A checkpoint is a self-check: taking it moves `pick.ts` to the next loop, whatever the score. |
| No placement check in Loop 1 | Loop 1 teaches. To skip a known page, collapse A and B and do the drill. |
| Code drills (Loops 2–4): you write the code in `drill.ts` in your editor, the page runs it live in a scene, and a test checks it wherever a test is possible | Real editor, visible results, automatic checks. |
| Light concepts share a drill with a concept they're really used with (Loops 2–3) | Pairing neighbors in the list would be arbitrary. |
| Loop 2's "build it" means writing the real code where that's the practical skill, never re-implementing math three.js provides | Same reason as dropping hand calculation. |
| Loop 3 break-and-fix: fix it, name the cause in a sentence, and write the check that would have caught it wherever that can be automated | Brad wants automated checks wherever they're possible. Misconception traps are break-and-fix drills where the bug is a wrong belief. |
| Proof experiments show frame time and draw counts on the page, and also use Chrome's performance tools | Brad wanted both. |
| Loop 3 is built before Loop 4 is polished, and every misconception must be a mistake people really make | Break-and-fix is the closest match to real debugging and interviews, and misconceptions become Loop 3's bugs. |
| Loop 4 AI review: stored snippets, regenerated periodically. Teach-back: a box on the page, then reveal the key points; ungraded | A retry is the same drill, and nothing needs grading. |
| Progress is one log, `progress/log.jsonl`. Loop 1 pages log themselves as done when the last quiz question is answered, through the dev server's `/api/progress` (`vite.config.ts`); the sidebar shows a ✓ | Brad expected the viewer to show what's finished. One log keeps the viewer and `pick.ts` in agreement. |
| The log is committed to carry progress between work and home; `.gitattributes` merges it with `merge=union` | Both machines only add lines, so keeping both sides never loses anything. |
| The concept list and teaching order live in `scripts/lib/domains.ts` | One source for the sidebar and for `pick.ts`. |
| TSL and Gaussian splats are sandboxes in `/experiments`, outside the core domains. The one exception: the Domain 15 VFX elective is written in TSL | Brad chose TSL for VFX on Sep 29, 2026. The core domains stay on WebGLRenderer and GLSL. |
| Two electives: Domain 15, Procedural & VFX (after core Loop 2), and Blank-file scenes (after Loop 4) | Brad wanted the from-an-empty-file drills visible in the plan like everything else. |
| The VFX elective has no four-loop pass: coding exercises that end with building each effect from memory into an existing scene | Brad's call. Its page and exercise design is still being settled. |

## Open needs

Settle these before, or while, building the parts that need them.

- **Answer lengths.** The right answer is the longest choice in only 6 of 89 questions, which is a small tell in the other direction. `coverage.ts` only checks the upper bound.

- **The Loop 1 checkpoint** has no design yet (question count, pass bar), and the tooling expects a code test. See `checkpoints/README.md`.
- **Browser checks.** Vitest runs in Node, without WebGL. Checks on rendering, shaders, draw counts, or GPU memory need Vitest's browser mode with Playwright (a one-time setup that downloads Chrome, about 150 MB). Add it when the first drill needs one. How far automated checks reach, by domain:
  - **In Node today:** 1–5, 7, 8 (math, transforms, rotation, camera, geometry, scene graph, raycasting).
  - **Mostly in Node:** 6 (memory math and disposal yes; upload and compile timing need a browser), 9 (the math yes; how a drag feels needs eyes), 13 (NaN guards and matrix checks yes; frame capture is manual).
  - **Partly:** 11 (settings like texture color space yes; whether it looks right needs eyes or a screenshot comparison).
  - **In a browser:** 10, 12, 14 (draw counts, shader compiles, pixel readback, memory back to baseline). Frame time is too noisy to pass or fail on, so those drills measure instead.
  - Where no check is possible, the drill asks what a person has to look at (the addendum's rule 6).
- **Assets and scene graph domains (6–7)** want real loaded models, and there are no loader helpers yet. Brad's `.glb` files on the Desktop (racks, shelves, hardware; 6 KB to 624 KB each) are fine to use and to commit; they aren't confidential. Copy the ones a page needs into the repo.
- **Interaction domain (9):** drag scenes need pointer helpers. Scenes already get `controls` and can set `controls.enabled = false` while dragging.
- **GPU and optimization domains (10, 14):** Loop 1 describes costs in plain words. Measuring them in Loop 2 needs frame-time and `renderer.info` readouts in the harness.
- **Domain 15 (VFX elective):** TSL is decided. The page and exercise format was proposed on Sep 29, 2026 and awaits Brad's pick. TSL pages need a `three/webgpu` version of the harness, since the drill harness uses `WebGLRenderer`.

## Git

- `origin` is `https://github.com/bbabines/three-mastery.git`, on branch `main`. The GitHub repo is named three-mastery; the folder is three-js-foundation.
- Commits in this repo use Brad's personal email, set in the repo's own git config. Don't change it.
- Commit and push only when Brad asks. Pushing needs Brad's GitHub login; if `git push` asks for credentials, Brad runs it. GitHub rejects account passwords there, so the password is a personal access token; the Mac keychain remembers it after the first success.
- Commit `progress/log.jsonl` along with the work, so progress follows Brad between work and home.

## How Brad likes to work

- Plain language, on pages and in chat. Explain jargon or leave it out.
- From each concept Brad needs what it is, what it's used for, and enough to talk about it at a high level. Not the math.
- Give a recommendation, not a menu. When Brad asks "does that make sense?", answer it directly.
- Build a small version, let Brad review it, then scale up.
- Brad moves on after understanding a page, not when a score says so. Treat `pick.ts`, placement checks, and checkpoints as helpers, not gates. Scores are recorded for reference only; don't add time pressure or enforcement unless Brad asks.
- Brad likes seeing what's ahead; the sidebar shows the full plan for that reason.
- Brad doesn't want to approve routine commands. `.claude/settings.json` allows the common ones, but a command chained with `&&`, `;` or `|` only skips the prompt when every part is allowed. Run commands one per call, use Grep/Read/Edit/Write instead of `grep`/`cat`/`sed -i`/`cat > file`, and never chain `rm` onto anything.
- Brad reviews in the Claude desktop app's browser pane. `.claude/launch.json` starts the dev server on port 5173.

## Gotchas

- `import.meta.glob` options must be an inline object literal, not a variable.
- Vitest hides the output of passing tests when it detects an AI agent. Pass `--silent=false` if you need to see it.
- The browser pane may be hidden, and a screenshot taken right after a scripted scroll can come back stale. Take a throwaway screenshot at scale 0.1 first. DOM checks through JavaScript are always reliable.
- A collapsed page section gives its scenes zero size. `harness/scene.ts` skips resizing at zero, so the camera's aspect ratio doesn't become NaN.
- `THREE.Clock` is deprecated as of r183. Use `THREE.Timer`.
- `three/webgpu` and `three` share `three.core.js`, so addons such as `OrbitControls` work on TSL pages.
- A line whose end points move needs `frustumCulled = false`, or `geometry.computeBoundingSphere()` after each move; `line()` in `harness/lesson.ts` sets the first.
- In a `ShaderMaterial`, add `#include <colorspace_fragment>` at the end of the fragment shader for correct output color.
- `sub`, `add`, `cross`, `normalize`, and `multiplyScalar` change the vector they're called on. Clone first in scene code.
- `COVERAGE.md` counts a misconception as exposed when a page lists it in its frontmatter. Whether a question really exposes it is for you to check.
- `pick.ts` only suggests a page once its concept's prerequisites are logged as done, even across domains. A new Domain 2 page won't show up in `pick` until Point vs direction is done.
- Scene code that moves an object and then reads `matrixWorld`, raycasts, or calls `applyMatrix4(object.matrixWorld)` in the same step gets the old transform. Call `updateMatrixWorld()` first. `getWorldPosition`, `localToWorld`, and `lookAt` refresh on their own.
- r186 has `Object3D.pivot`, a point that `rotation` and `scale` work around. `attach` and `applyMatrix4` don't allow for it, so an object with a `pivot` jumps when you use them. Saving a turned object that has a `pivot` with `toJSON` and loading it with `ObjectLoader` also puts it in the wrong place.
- The harness's hemisphere light isn't handed to scenes. Find it with `scene.children.find((c) => c instanceof THREE.HemisphereLight)` to turn it down.
- `harness/main.ts` globs every drill file, so saving any page or harness file makes Vite reload every open viewer page. A long scripted browser check can be cut off mid-run; check one page per call.
- A background tab in the browser pane screenshots blank, and a hidden pane doesn't animate, so readouts filled each frame stay empty. Front the tab (`tabs_select`) before a screenshot.
- On Brad's Windows machine, port 5173 can be taken by another project's dev server. `vite.config.ts` doesn't read a port, so start this one with `npm run dev -- --port 5180`.
