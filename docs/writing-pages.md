# Writing a Loop 1 page

Every concept gets one page: a short opening block, then three parts, **A · The basics**, **B · Working knowledge**, and **Drill · Read the code**. The Domain 1 pages are the reference, so copy their layout rather than inventing a new one. Point vs direction is the page Brad reviewed and approved. The other Domain 1 pages follow the same recipe but haven't had a page-by-page review, so treat their tone and length as a guide, not a rule.

## Who it's for

The reader needs three things from every concept: what it is, what it's used for, and enough to talk about it at a high level. Not the math.

- **A** is for someone meeting the idea for the first time.
- **B** is what a working senior developer knows and uses day to day.
- Nothing theoretical or abstract anywhere: no homogeneous coordinates, no proofs, no formula walkthroughs.
- Plain words. Define each term the first time it appears (origin, normal, unit vector). If a word is jargon, say what it means in the same sentence.
- No hand calculation. The code does the arithmetic. The reader needs to know what an operation gives back, what it's for, and what it looks like when it goes wrong.
- At most one formula, inside a collapsed note: `<details><summary>The math, if you're curious</summary>…</details>`. The note is optional. Its main job is to name the technical term the reader will meet in docs and forums (the w component, the inverse transpose), so they recognize it later. It may show the formula and one small worked example, but a page never asks the reader to calculate.

## When the inventory's idea is theory

Some core ideas in the inventory are stated as theory, like "points use w=1 and directions use w=0", "matrixWorld = parent.matrixWorld × matrix", or "the inverse transpose of the upper 3×3". Teach what the reader can see and do instead:

- **Say what happens.** Moving an object shifts the points attached to it; turning it turns both points and directions; neither changes a direction's length.
- **Name the method that does it.** `applyMatrix4` treats a Vector3 as a point and includes the shift. `transformDirection` treats it as a direction: it only turns, and it also normalizes.
- **Show the bug** when the wrong one is used.

The theory can appear once, in the collapsed "The math" note, or not at all. Describe matrices by what they hold and when three.js updates them, never as 16 numbers; reading the numbers is its own concept in the debugging domain.

When two domains cover related ideas, say how they differ. `math.point-vs-direction` is "a place versus a move". `transforms.points-vs-directions` is "what happens to each when an object moves, turns, or scales". Link back to the earlier page instead of re-teaching it.

The same goes for the inventory's use contexts. Some are written as theory, like "Transforming with w=1 vs w=0" on the Point vs direction card. Keep the card's wording, but pages and drills that use the context teach its behavior: what `applyMatrix4` and `transformDirection` do to a Vector3.

## Wording by domain

- **Coordinate spaces and transforms (2):** "local" means two things in three.js. An object's `position` is measured from its parent, but the point you pass to `object.localToWorld(v)` is measured from the object itself. Say "measured from its parent" or "measured from the object itself", and don't use "local" on its own.
- **Matrices (2 onward):** a matrix is "a saved transform: a move, a turn, and a resize packed into one value that three.js can apply to any point in one step." The matrix vs matrixWorld page introduces it; later pages reuse that wording. Say what a matrix holds and when three.js refreshes it, never its 16 numbers.
- **Quaternions before the rotation domain:** call a quaternion "three.js's way of storing a turn" and point ahead to the quaternions page.

Add a line here whenever a domain needs a wording decision, so later pages stay consistent.

## Files

```
drills/1/<domain>/<concept>/read-the-code-1/
  README.md       frontmatter, then the page
  scenes.ts       interactive scenes, exported by name
  questions.ts    the read-the-code questions
concepts/<domain>/<concept>.md   the concept card
```

The concept must also be listed in `scripts/lib/domains.ts`, which sets the teaching order. Every inventory concept already is. The page's `# Title` is the concept's `name` from `domains.ts`.

### The card

```yaml
---
id: transforms.local-vs-world
name: Local vs world space
domain: transforms
tier: core
prerequisites: [math.point-vs-direction]
misconceptions:
  position-is-world: '"object.position is the world position."'
contexts:
  world-position: A part's world position
  light-on-part: Attaching a light to a part
  nested-compare: Comparing nested objects
---

## Definition

<One plain sentence.>
```

- Add `## Space lens` or `## Cost lens` only where they matter, in plain words.
- **Prerequisites** are the concepts the page actually relies on. They can be in another domain; `pick.ts` enforces them across domains.
- **Contexts** are the inventory's use contexts, each with a short kebab-case key.
- **Misconceptions** use the inventory's wording word for word, each with a short kebab-case key. When the wording contains double quotes or a colon, wrap it in single quotes and double any apostrophe inside (`'"Order doesn''t matter."'`). Plain wording needs no quotes (`Parallel inputs give zero.`).
- An inventory cell can mix wrong ideas with the facts that correct them. Each wrong idea, like "Every matrix decomposes cleanly.", is an entry. A surprising fact that stands alone, like "Parallel inputs give zero.", is an entry too. A sentence that only qualifies the one before it, like "Shear is lost.", stays in that same entry: `'"Every matrix decomposes cleanly." Shear is lost.'`

### Frontmatter for the page

```yaml
---
id: 1.<domain>.<concept>.read-the-code.1
loop: 1
tier: core            # or light
concepts: [<domain>.<concept>]
mode: read-the-code
context: <domain>.<concept>/<context key>   # the use context the page's main example uses
lenses: []
misconceptions:
  - <domain>.<concept>/<misconception key>  # every one on the card
---
```

`lenses` stays empty on Loop 1 pages. The lens requirements (a `## Spaces` section, a measurement step) apply to code drills from Loop 2 on. Loop 1 pages still use the lenses in plain words:

- **Space**, the whole point of the transforms domain: say which space every value is in, like "measured from its parent" or "in the world". Every Domain 2 page has a "Which space is it in?" table in B, listing the values the page uses and the space each is in. Pages in other domains add one when they deal with several spaces.
- **Cost**, in the GPU and optimization domains: say what something costs in plain words, like "CPU time every frame" or "GPU work for every pixel". Measuring it comes in Loop 2.

## Page structure

```md
# <Concept name>

> **In short:** <The concept in one plain sentence, the way you'd say it out loud.>
>
> **Used for:** <Three or four unrelated places it shows up.>

## A · The basics

### <One idea per step, as a plain question or statement>

<Explanation, then **Analogy: …**, then a scene.>

<div data-scene="name"></div>

## B · Working knowledge

### <Something a developer is trying to do>

<The code, the common mistakes, and which kind of value each method wants.>

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
```

- **The opening block** stays visible above the collapsible sections, so it doubles as a quick refresher. "Used for" lists uses from different areas, like lighting, gameplay, and cameras for the dot product, so no single example becomes the meaning of the concept. Brad once thought the dot product was only for cameras because every example used one; this block exists to prevent that.
- **A** builds on earlier pages and names them: "the dot product page", never "the last page", because the order can change. Every A has an everyday analogy and at least one scene.
- **B** is organized by task: "Aim, then move at a speed", "Sliding along a wall". Point ahead to a later page in one line when it's relevant ("add vs attach comes later in this domain"). Don't teach the later page early.
- **Size:** a core page has about two scenes and four or five questions. A light page has one scene and two or three questions.
- **Exact syntax in B.** Show the line a developer actually types, not a description of it. The inventory's "Blank-file drills go last" table lists the setup lines that must appear on the pages that teach them, such as `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`, because no drill has Brad type them from an empty file until after Loop 4.
- **Use three.js, don't re-implement it.** When three.js has a method for something (`Triangle.getNormal`, `ray.intersectBox`, `closestPointToPoint`), B teaches what the method returns, which space the result is in, and when to reach for it. How it works inside is at most a collapsed note.

## Tour pages

A tour covers a family of classes or an API surface, like the materials or the Object3D API, instead of one idea. It's a light concept, it's the first page in its domain, and its title starts with "Tour:" to match `domains.ts`. It uses the same files, frontmatter, and opening block as any page. What changes is the body:

```md
# Tour: <family>

> **In short:** <The family in one plain sentence.>
>
> **Used for:** <Three or four unrelated places it shows up.>

## A · The basics

### <What the family has in common>

<A table of members: what each one is, when you'd pick it, and what it costs in plain words.>

<div data-scene="name"></div>   <- a scene with a switcher between members

## B · Working knowledge

### <Member or task>

<The constructor and the three or four properties you actually set, with the mistake people make.>

## Drill · Read the code
```

- **Name, don't teach.** A tour is a map. For each member, say what it's for and name the page that teaches it in depth ("the add vs attach page"). Don't teach that page early; a tour of the Object3D API names `attach` without explaining when it keeps the world transform.
- **The table** has a row per member and plain-word columns: what it is, when to pick it, and its cost ("free", "CPU time on every call", "one more draw call"). Keep each cell to a line.
- **The scene** shows the members side by side or behind a row of `choiceButtons`, and the readout shows the line of code for the one selected.
- **B** is organized by member or by task. For each: the constructor, the few properties you set, and one mistake. Setup quirks belong here, like RectAreaLight's `RectAreaLightUniformsLib.init()`.
- **Size:** one scene and three questions, like a light page. The drill spreads its questions across different members.

## Questions (`questions.ts`)

```ts
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const move = b.sub(a);
marker.position.copy(b);`,
    ask: 'Where does the marker end up?',
    choices: ["At b's original position, unchanged", "At the spot matching the move's numbers", 'At a, because sub moves b onto a'],
    answer: 1,
    why: '`sub` changed `b` itself, so …',
  },
];
```

- The code is 2–6 lines of real three.js or GLSL.
- The question is a real question a reader can answer from the snippet. Asking about a variable in the snippet ("What is `dir`?") is fine. What's banned is an unexplained name standing in for the question, like asking for `velocityChangesInDock` without saying what it means.
- There are always three choices. The wrong ones start with the card's misconceptions, written as believable answers. Most cards have only one to three misconceptions, so fill the rest with other mistakes people really make: expecting an error, a default value, the opposite sign, or the answer to a different question.
- **Don't let the right answer give itself away.** Keep all three choices about the same length and in the same style: if one has a short reason after a colon, they all do. Put the full explanation in `why`. `npm run coverage` fails if the right answer is the longest choice in more than 40% of questions, or if a question mixes choices with and without a colon reason.
- `why` teaches: what actually happens, and the fix.
- Cover both halves: roughly half the questions from A, half from B.
- Every misconception on the card needs a question, or a clear B section, that really exposes it. `npm run coverage` only checks that it's listed in the frontmatter.
- Choices are shuffled on the page, so `answer: 0` is fine.

## Scenes (`scenes.ts`)

```ts
import { arrow, COLORS, overlay, setArrow, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';

export const agree: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  // …
};
```

- Export each scene under the same name its `data-scene` uses.
- Build from `harness/lesson.ts`: `label` and `LABEL_LIFT`, `ball`, `pointer` (a cone that aims with `lookAt`), `arrow` and `setArrow`, `line` and `setLine`, `outline` (a shape's edges as lines), `cornerAngle` (90° unless a stretched parent skews the object), `overlay('readout' | 'controls')`, `slider`, `choiceButtons`, `formatNumber`, `formatVector`, and `COLORS`.
- Keep the readout short, about four lines, with no blank lines. It sits over the top of the scene and hides labels behind it.
- A scene that moves something and then reads `matrixWorld`, raycasts, or uses `applyMatrix4(object.matrixWorld)` in the same step calls `updateMatrixWorld()` first, as the update timing page teaches.
- The harness hands each scene its `controls` (the OrbitControls). A scene that drags objects with the pointer sets `controls.enabled = false` while dragging.
- The harness adds a hemisphere light at intensity 2. Turn it down in a scene that needs its own lights to show. Plain three.js objects (cones, planes, a `ShaderMaterial`) are fine too. When two or more scenes need the same new helper, add it to `lesson.ts` and to this list.
- Each scene shows one idea and is interactive: sliders change the input, or buttons compare right code with wrong code, like `lookAt(target.position)` against `lookAt(dir)`.
- The readout shows the line of code and the live values it produces.
- Use the scene's own numbers, not the questions' numbers.
- Set the camera in each scene so the action fills the frame.
- Keep everything off the floor grid. Anything that lies on the floor sits just above it (y = 0.05), or its lines hide in the grid lines they run along.

## Before you call it done

1. Check every claim against three.js r186. Don't state three.js behavior from memory.
   - Run numbers and results in Node. That covers the prose, the snippets, and the `why` text; question code lives in strings, so typecheck never sees it.
     `node --input-type=module -e 'import { Vector3 } from "three"; …'`
     This is how Domain 1 confirmed that normalizing (0, 0, 0) returns (0, 0, 0), that `Math.acos(u.dot(u))` can be NaN, and the exact float32 gaps.
   - For behavior, like "does this method update the matrices first?", read the source in `node_modules/three/src`.
2. Check that each misconception on the card is a mistake people really make, not a true fact or a strawman. Loop 3 turns each one into a bug to fix, so a fake one becomes a fake drill.
3. Run `npm run typecheck` and `npm run coverage`. In `COVERAGE.md`, check that every misconception is exposed, the frontmatter matches the cards, and the answers don't give themselves away.
4. Open the page in the viewer. Every scene mounts, the quiz renders, there are no console errors, and each scene's controls do what the text says.
