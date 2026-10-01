# three.js foundations

Brad's repo for learning three.js and 3D graphics in plain language, then keeping the skills fresh with short drills. three.js is pinned to exactly r186 (`three@0.186.0`).

## Read first

- `docs/concept-inventory.md` is the source of truth. The copy on Brad's Desktop is older. If you want to add a concept, flag it to Brad instead of adding it.
- `docs/writing-pages.md` is the recipe for a Loop 1 page, including "Size and voice" (the Domain 1 standard) and the VFX elective's page format. Follow it for every new page.
- `docs/loop1-build-notes.md` lists the calls waiting on Brad from the Domain 3–14 build, what couldn't be verified, and the facts cut in the tightening pass, which are raw material for Loop 2–3 drills.
- `docs/addendum-write-the-check.md` has the rules and examples for writing the automated check at the end of a break-and-fix drill. It's adopted; its status line records one change to it.
- `README.md` has the commands and repo layout.
- `docs/brief-interview-review.md` records the changes from the interview-readiness review and why. Its status line says which are applied. `docs/r186-check/` is the r186 check's report and evidence.

## Status

Update this section whenever it changes.

- **Built:** the drill viewer (`/harness/`), `pick.ts`, `coverage.ts`, `verify.ts`, all 159 Loop 1 pages and cards (including seven tours), and the Loop 1 checkpoint. Loops 2–4, their placement checks and checkpoints, and the cross-domain drills are built. Domain 15's VFX elective has all 13 concept pages and six effects, each effect guided and from memory. The sidebar shows the whole plan; `progress/log.jsonl` has what Brad has finished. TSL and Gaussian splats also have sandboxes in `/experiments`.
- **Reviewed:** Brad approved the page format on Point vs direction, the wording on Local vs world space, Domain 2 as a whole, and on Sep 30, 2026 the tightened Domain 3 as the model for the tightening pass. On Oct 1, 2026 Brad approved the VFX sample, the 95% pixel-match bar, and logging a concept exercise on its first pass. The other Domain 1 pages and Domains 4–14 have not had page-by-page review; Loops 2–4 received a blind-agent review and fixes.
- **r186 check:** done, and its fixes applied Sep 29, 2026 (`docs/r186-check/`). The Pivots page now teaches `Object3D.pivot` and what it changes; that addition hasn't been reviewed.
- **Tightening pass:** done Sep 30, 2026. After the blind review, Domains 3–14 were brought to Domain 1's size and voice; Brad approved the Domain 3 sample first. Every page in Domains 1 and 3–14 passes `coverage`'s "Size and voice" check; Domain 2's 12 pages are still over, by Brad's choice. The facts cut along the way are kept in `docs/loop1-build-notes.md` for later loops.
- **Checked:** every Loop 1 page mounts its scenes and quiz without console errors; their builders checked claims against r186. Loops 2–4 passed blind-agent review and the repo gates. Domain 15's concept references self-score at 100%, and all elective pages mount in a headless browser; five new effect references were also inspected visually. Many earlier Loop 1 scenes were checked through DOM or offscreen renders rather than by eye.
- **Not built:** the Blank-file scenes elective.
- **Next:** Brad's review of the Loop 1 pages (tours first) and the calls in `docs/loop1-build-notes.md` (possible new concepts, `three-mesh-bvh`, inventory wording); then the Blank-file scenes elective. Keep Loops 2–4 and VFX current as practice reveals gaps.

## Decisions already made

Don't reopen these without Brad.

**What a page teaches**

| Decision | Why |
| --- | --- |
| Loop 1 teaches: an A/B page plus a read-the-code drill for every concept | Brad is learning much of this for the first time. The original Loop 1 tested what you already knew and wasn't teachable. |
| Domain 1 is the standard for every Loop 1 page's size and voice. `writing-pages.md` ("Size and voice") has its numbers, and `npm run coverage` measures them | Brad chose this on Sep 30, 2026, after a blind review found the later domains about twice as long and dense as Domain 1, with talk about the course itself. Domain 2 stays as Brad approved it unless he asks. |
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
| The VFX elective has no four-loop pass. Stage 1: a page per concept (plain language and a live visual, then going deeper) ending in a coding exercise scored against a reference on the page. Stage 2: six effects built into an existing scene, guided and then from memory | Brad picked this design (option 3 of three) on Sep 29, 2026. Concepts are taught on their own first, so no concept becomes "the thing from the dissolve effect". The inventory's Domain 15 section has the effect list. |

## Open needs

Settle these before, or while, building the parts that need them.


- **Gaps between loops.** Brad moves on when a page feels comfortable, so a thin Loop 1 page can leave a gap a later drill trips on. A drill never relies on something its Loop 1 page doesn't teach: it states what it needs in its task, or the page gains the line. The Loop 1 checkpoint's per-domain misses point at thin topics.
- **Browser checks** are set up (Sep 30, 2026, with Brad's OK): Vitest's `browser` project runs every `*.browser.test.ts` in headless Chromium through Playwright, and WebGL works there (draw counts, pixel readback). Other tests stay in the `node` project. How far automated checks reach, by domain:
  - **In Node today:** 1–5, 7, 8 (math, transforms, rotation, camera, geometry, scene graph, raycasting).
  - **Mostly in Node:** 6 (memory math and disposal yes; upload and compile timing need a browser), 9 (the math yes; how a drag feels needs eyes), 13 (NaN guards and matrix checks yes; frame capture is manual).
  - **Partly:** 11 (settings like texture color space yes; whether it looks right needs eyes or a screenshot comparison).
  - **In a browser:** 10, 12, 14 (draw counts, shader compiles, pixel readback, memory back to baseline). Frame time is too noisy to pass or fail on, so those drills measure instead.
  - Where no check is possible, the drill asks what a person has to look at (the addendum's rule 6).
- **Models:** two of Brad's `.glb` files (rack parts and J-cups, Draco-compressed) are in `assets/models/`, loaded through `harness/models.ts`. His other rack models on the Desktop (`WFH/Rogue Models/`, 212 KB to 639 KB) are fine to use and to commit; they aren't confidential. Neither model has glTF extras, so the userData page tags parts in code.
- **GPU and optimization domains (10, 14):** Loop 1 describes costs in plain words; Loops 2–3 include frame-time and `renderer.info` readouts. Frame time is for observation, not a brittle pass/fail check.
- **BVH drills (Loops 2–3):** The built drills use a teaching tree of `Box3`s, as the Loop 1 page does. `three-mesh-bvh` is not installed; adding a production library exercise remains Brad's call.
- **Domain 15 (VFX elective):** The 13 concept pages, six effects, and TSL viewer are built. Concept exercises score against their `/solutions` reference at the approved 95% pixel-match bar and log the first pass once. Effects are checked by eye; after all six from-memory effects are done, `pick` includes them in maintenance. `coverage` remains scoped to the four core loops. Run `node scripts/verify-vfx.mjs http://localhost:5181` against a dev server to smoke-check every elective page and self-check each reference mask.

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
- Brad reviews in the Claude desktop app's browser pane. `.claude/launch.json` starts the dev server on port 5173 (`dev`), or on 5180 (`dev-5180`) when 5173 is taken.

## Gotchas

- `import.meta.glob` options must be an inline object literal, not a variable.
- Vitest hides the output of passing tests when it detects an AI agent. Pass `--silent=false` if you need to see it.
- The browser pane may be hidden, and a screenshot taken right after a scripted scroll can come back stale. Take a throwaway screenshot at scale 0.1 first. DOM checks through JavaScript are always reliable.
- A collapsed page section gives its scenes zero size. `harness/scene.ts` skips resizing at zero, so the camera's aspect ratio doesn't become NaN.
- `THREE.Clock` is deprecated as of r183. Use `THREE.Timer`.
- `three/webgpu` and `three` share `three.core.js`, so addons such as `OrbitControls` work on TSL pages.
- A line whose end points move needs `frustumCulled = false`, or `geometry.computeBoundingSphere()` after each move; `line()` in `harness/lesson.ts` sets the first.
- In a `ShaderMaterial`, add `#include <colorspace_fragment>` at the end of the fragment shader for correct output color. The exception is a debug view that shows raw values (normals, UVs, depth as color): leave it out, as r186's `MeshNormalMaterial` does, or 0.5 shows as 188/255 instead of 128.
- `sub`, `add`, `cross`, `normalize`, and `multiplyScalar` change the vector they're called on. Clone first in scene code.
- `COVERAGE.md` counts a misconception as exposed when a page lists it in its frontmatter. Whether a question really exposes it is for you to check.
- `pick.ts` only suggests a page once its concept's prerequisites are logged as done, even across domains. A new Domain 2 page won't show up in `pick` until Point vs direction is done.
- Scene code that moves an object and then reads `matrixWorld`, raycasts, or calls `applyMatrix4(object.matrixWorld)` in the same step gets the old transform. Call `updateMatrixWorld()` first. `getWorldPosition`, `localToWorld`, and `lookAt` refresh on their own.
- r186 has `Object3D.pivot`, a point that `rotation` and `scale` work around. `attach` and `applyMatrix4` don't allow for it, so an object with a `pivot` jumps when you use them. Saving a turned object that has a `pivot` with `toJSON` and loading it with `ObjectLoader` also puts it in the wrong place.
- The harness's hemisphere light isn't handed to scenes. Find it with `scene.children.find((c) => c instanceof THREE.HemisphereLight)` to turn it down.
- Every scene's renderer is created with `stencil: true` (`harness/scene.ts`), since three.js leaves the stencil buffer off and the stencil page needs one.
- Turning on `renderer.shadowMap.enabled`, or switching a material to `transparent`, after the material's first draw has no effect until `material.needsUpdate = true`.
- The first Standard or Physical material drawn uploads a small lookup texture (`DFG_LUT`), so `renderer.info.memory.textures` never returns to 0 after that. Take a "before" count after the first render.
- `PCFSoftShadowMap` is removed in r186: three.js warns and uses `PCFShadowMap`. `renderer.useLegacyLights` no longer exists.
- A scene that renders through an EffectComposer or its own render targets calls `drawYourself(harness)` from `lesson.ts`; otherwise the harness's render draws over it. With a composer, `renderer.info.render` counts only the last pass.
- Raycasting a `Sprite` with a raycaster set up by `raycaster.set(...)` (so `raycaster.camera` is null) logs an error and throws. The harness's labels are sprites, so raycast a target list, never `scene.children`.
- `Box3.setFromObject(mesh)` boxes the mesh's children too, so an outline or label added as a child makes the box bigger.
- `harness/main.ts` globs every drill file, so saving any page or harness file makes Vite reload every open viewer page. A long scripted browser check can be cut off mid-run; check one page per call.
- A background tab in the browser pane screenshots blank, and a hidden pane doesn't animate, so readouts filled each frame stay empty. Front the tab (`tabs_select`) before a screenshot. When the pane is too small to show a scene, render it offscreen with `createHarness` and look at the pixels instead.
- When checking a page in the viewer, never answer its last quiz question: that logs the page as done in `progress/log.jsonl`, which is Brad's real progress.
- Keep every file LF. A README with CRLF endings loses its frontmatter and the page vanishes from the viewer; Python's text-mode writes on Windows cause it.
- The app can stop a dev server started with `preview_start` between sessions. If a page won't load, check `preview_list` and start the launch entry again.
- Building many pages at once with subagents worked well with one subagent per domain: each edits only its domain's folders, opens its own browser tab, appends to `lesson.ts` only at the end, and never runs git; the main session checks, commits, and pushes each domain.
- On Brad's Windows machine, port 5173 can be taken by another project's dev server (his portfolio). Use the `dev-5180` launch entry, or `npm run dev -- --port 5180`.
