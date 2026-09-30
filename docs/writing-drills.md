# Writing a code drill

From Loop 2 on, drills are code. Brad writes the code in his own editor, in the drill's `drill.ts`; the drill's page runs it in a live scene each time he saves; and a test checks it. Loops 2 and 3 share this recipe, and Loop 3 adds a step at the end (see "Loop 3" below). The Domain 1 drills in `drills/2/math/` are the reference, so copy their layout rather than inventing a new one.

## What a drill is

A drill practices writing what a Loop 1 page taught. It's small and covers one idea: a function or two, each a few lines once solved. The reader is the same as Loop 1's, so the prose follows `writing-pages.md` ("Size and voice"): plain words, no reader's name, no loop or domain numbers, no versions, no "this repo".

- **Build it** (`implement`) is for core concepts: write the working piece where building it is the practical skill, like a vision cone, a set of axes from a forward direction, a drag along a rail, or a dial. Use three.js's methods for the math (`dot`, `crossVectors`, `projectOnVector`, `angleTo`, `Line3`, `Plane`, `Triangle`); never re-implement one.
- **Use it** (`apply`) puts the concept to work in an assigned use context from the card, like hiding hotspots on the far side of a product or reading a compass heading.
- **Light concepts share a use-it drill in pairs**, chosen because real code uses the two together, not because they're neighbors in the list. The drill has a function, or at least a test, for each concept. Domain 1's pairs are length with normalize (fly toward a target at a speed), lerp with spherical coordinates (a flight across a globe), and reflection with the triple product (a mirror camera). When a domain has an odd number of light concepts, one gets a drill of its own; the plan in `domains.ts` counts half of them, rounded up.

## Files

```
drills/<loop>/<domain>/<concept>/<mode>-<n>/
  README.md            frontmatter, then the page
  drill.ts             the starter Brad edits
  drill.test.ts        the acceptance check; drill.browser.test.ts when it needs WebGL
  scenes.ts            optional: scenes that import ./drill and run Brad's code live
solutions/drills/<loop>/<domain>/<concept>/<mode>-<n>/drill.ts   the reference answer
```

A shared drill's folder goes under its first concept, listed first in teaching order (`drills/2/math/length/apply-1/` for length and normalize).

## Frontmatter

```yaml
---
id: 2.math.dot-product.implement.1       # loop.domain.concept.mode.n, matching the folder
loop: 2
tier: core                                # light for a shared drill
concepts: [math.dot-product]              # a shared drill lists both, first in teaching order
mode: implement                           # or apply; break-and-fix in Loop 3
context: math.dot-product/cone-check      # one key on one of the drill's cards
lenses: []                                # [space] or [cost] where they matter
misconceptions:
  - math.dot-product/always-unit-range    # only ones the test or scene really exposes; [] is fine
---
```

**Contexts rotate.** Take them from the cards. A concept's first drill in a loop doesn't reuse its Loop 1 page's context, and no two drills of a concept in a row share one; `coverage` orders them by loop, then read the code, build it, use it, fix the bug. Core concepts need three contexts across all their drills and light ones two, so giving build it and use it two new contexts puts a core concept at three by the end of Loop 2. When a card's context is written as theory ("Transforming with w=1 vs w=0"), the drill uses its behavior, as `writing-pages.md` says. A shared drill has room for one context, so pick the key the drill is really about; `coverage` counts it only for the concept it belongs to, and the other concept gets its contexts from its other drills.

## The README

```md
# <Concept, short>: <the job in a few words>

> **The job:** <One plain sentence: what the code does, not how.>

## Task

<The situation in a sentence or two. Then each function: its name, its inputs, and what it returns,
in behavior: which way is positive, what counts as "straight", the stand-in for an input with no
sensible answer. End with "Don't change the vectors it's handed." Anything the drill needs that its
Loop 1 page doesn't teach gets a line here.>

<A sentence or two on what to try in the scene and what right looks like.>

<div data-scene="name"></div>

## Spaces            <- space lens only
## Measure           <- cost lens only

## Your code

Write it in `<folder>/drill.ts`. Save, and the scene runs it. To check it as you go:

    npm run drill -- <folder>

## The check

<What the test checks, in plain words, in a sentence or two. Brad doesn't open drill.test.ts until
he's done, so this is where he learns what passing means.>

<details><summary>Hint</summary> <One to three sentences: which page has the idea, or the trap to
watch for. Never the answer.> </details>

## Where else?

<One question: where else does this concept apply?>

<details><summary>A few answers</summary> <Two or three uses from the card's other contexts.> </details>
```

- **The title** starts with the concept's name, shortened where it's long ("Projection", "Signed angle", "Tolerance"). The sidebar lists the drill under its concept's number, and a shared drill under both.
- **Size:** about 50–70 lines. Name functions and inputs in `code`; say everything else in plain words.
- **No gaps between loops.** A drill never relies on something its Loop 1 page doesn't teach. State it in the Task in a line (the turntable drill says what `applyMatrix4` and `transformDirection` do; the panel drill names `Plane`'s two methods), or flag the page for the missing line.

## `drill.ts`, the starter

```ts
// Dot product: a vision cone. Write canSee, then save: the page's scene runs it.
// Check it with: npm run drill -- drills/2/math/dot-product/implement-1
//
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import { Vector3 } from 'three';

// True when `target` is within `range` of `eye` and within `halfAngle` degrees of `facing`.
export function canSee(eye: Vector3, facing: Vector3, target: Vector3, halfAngle: number, range: number): Answer<boolean> {
  return null;
}
```

- One exported function per answer, returning `Answer<T>` and starting as `return null`, so every test fails until it's written. The comment above it says what it returns, in the Task's words.
- Import `Vector3` as a value, so `new Vector3()` works, plus any class the Task names. Don't import one that gives the answer away.
- Inputs are three.js values or small plain objects. Answers are a `Vector3`, a number, a boolean, a string union, or a small object of those.

## `drill.test.ts`, the acceptance check

- Import the functions from `./drill` only. With `DRILL_SOURCE=solutions`, `vite.config.ts` resolves `./drill` to the mirror in `/solutions`, which is how `verify` runs the same test against the reference.
- Use `@harness/check`: `answered` (fails "not answered yet" on `null` and hands back the answer), `expectNumber`, `expectExact`, `expectVector`, and `expectUnchanged` (an input the function changed, like `b.sub(a)` without a clone).
- **Compute expected values with three.js, never hardcode them.** Use a different method from the one the answer needs where there is one: `angleTo` for the cone, `Matrix4.lookAt` for the axes, `Line3` for the nearest point, `localToWorld` for a moved point, `Plane` for which side. Otherwise test behavior that pins the answer down: the part of a drag along a rail runs along the rail, and what's left is at right angles to it.
- **Test the general case**, so the card's misconceptions fail: directions that aren't length 1, a wall or pipe at an angle, a globe away from the origin, both signs, both sides. When a case only bites because of rounding, assert that first (`expect(area).toBeGreaterThan(0)`), so a later edit can't quietly defuse it.
- One `it` per behavior, named as a plain sentence, since the watch output reads like a checklist. Every drill with vector inputs has a "doesn't change ..." test.
- Anything that needs WebGL (draw counts, pixels, shader compiles, GPU memory) goes in `drill.browser.test.ts`, which runs in headless Chromium.

## `scenes.ts`

- Import the functions from `./drill` and call them through `attempt(name, () => fn(...))` from `lesson.ts`. While Brad's function returns `null`, the readout says "`<name>`: not answered yet"; if it throws, the readout shows the error; either way the scene keeps running.
- Hand the function copies (`.clone()`) of the scene's values, so an answer that changes its inputs can't knock the scene over. The test catches that instead.
- Show what right looks like where it's cheap: something placed by three.js that Brad's answer should land on (the red dot on the turntable, the city markers on the globe), and a verdict line worked out from behavior ("the bracket stays on the rail").
- Otherwise follow the scene rules in `writing-pages.md`: frame the action, keep it off the grid, lowercase slider labels, and a readout of two to four lines.

## Lenses

- **`space`**: add a `## Spaces` section, a two-column table of each input and the answer with the space it's in, in the wording `writing-pages.md` sets for the domain. Use it when a drill crosses spaces or measures from a center, not when everything is in the world.
- **`cost`**: add a `## Measure` section: what to measure, with which tool (`renderer.info`, `performance.now()` around CPU work, Chrome's performance panel), and the number to write down. Frame time is too noisy to pass or fail on, so it's measured, never tested.

## Placement checks

Each domain opens Loops 2–4 with one, in `placement/<loop>/<domain>/`:

- `README.md` with frontmatter `id: <loop>.<domain>.placement`, `loop`, `domain`, and `parts`, the concept ids in teaching order. The page says there are no docs, lists the functions in a table, and says to run `npm run pick -- done` once, when all of them are written.
- `check.ts`: one function per concept, starting as `null`, each one to three lines once solved, from memory.
- `check.test.ts`: one `describe` block per concept id, named exactly that, so `pick` can log which parts missed.
- The reference goes in `solutions/placement/<loop>/<domain>/check.ts`.

## How Brad works a drill

1. `npm run pick`, then `npm run pick -- start`, which prints the page to open.
2. Read the Task and write `drill.ts` in his editor. Saving reloads the page, and the scene runs the new code.
3. `npm run drill -- <folder>` keeps the test running as he saves.
4. `npm run pick -- done` runs the test once more and logs the date if it passes.

## Loop 3: fix the bug

A break-and-fix drill uses the same files and sections, with three changes:

- The starter is working code with one subtle bug that shows in the scene, so the acceptance test fails until it's fixed and `verify`'s check still holds. The bug is one of the card's misconceptions, or a fact cut from a Loop 1 page (`docs/loop1-build-notes.md` keeps them).
- The Task describes the symptom, never the cause.
- After the fix, Brad names the cause in one sentence and, wherever the bug can be caught automatically, writes the check that would have caught it, following `docs/addendum-write-the-check.md`. Where it can't be, he says what a person has to look at. Where the sentence and the check live, and how `verify` proves his check fails on the broken code, is for the first Loop 3 build to settle; the addendum's open questions list the options.

## Before you call it done

1. `npm run verify`: every starter fails and every reference passes.
2. `npm run typecheck`, then `npm run coverage`: the frontmatter matches the cards, no context repeats, every lens has its section, and every `drill.ts` has a mirror.
3. Make sure the test catches the real mistakes, not just `null`: put each likely wrong answer (each misconception on the drill's list, and a forgotten clone) into the reference for a moment and run the test against it. Each should fail at least one test.
4. Check every three.js claim in Node or in `node_modules/three/src`, as `writing-pages.md` says. The Domain 1 drills checked, for example, which unit vectors dot to a hair over 1, and how much area rounding leaves on a flat triangle.
5. Open the page in the viewer. With the starter, it loads with no console errors and the scene says "not answered yet". With the reference copied into `drill.ts` for a moment, the scene works and frames well. Copy back only `drill.ts`; `verify` catches a starter that wasn't put back.
6. Keep every file LF.
