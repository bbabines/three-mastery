# three.js foundations

Short manual drills that keep foundational three.js and 3D graphics skills fresh. Pinned to three.js r186 (`three@0.186.0`, exact).

The source of truth is [docs/concept-inventory.md](docs/concept-inventory.md). Domains, concepts, tiers, misconceptions, use contexts, and the loop structure all come from it. Flag a concept you want to add there rather than adding it silently.

## How Loop 1 works

Each concept gets one page. It opens with the concept in one sentence and a list of unrelated places it's used, then has three parts:

- **A · The basics** for a first-time learner: the idea in plain words, an analogy, and a scene you can play with.
- **B · Working knowledge** for a working developer: the code you'd write, the mistakes people make, and which methods want which kind of value. No theory.
- **Drill · Read the code**: short snippets with multiple-choice questions, graded when you click.

Run `npm run dev` and open `/harness/` to read them. The sidebar shows the whole curriculum: every loop and domain, with built pages as links and the rest greyed out. Groups collapse, and the viewer remembers which ones you left open. Click a section heading on a page to collapse it too.

The concept list and its teaching order live in `scripts/lib/domains.ts`, copied from the inventory. The sidebar and `pick` both follow it.

## Rules

- Nothing is timed. Take breaks and switch tasks whenever you need to.
- Allowed during a drill: the three.js docs and the three.js source.
- Not allowed: AI tools, `/solutions`, or reading a drill's `drill.test.ts` before you finish.
- Placement checks and checkpoints are done without docs.

## Setup

```bash
npm install
```

## Practice loop

```bash
npm run pick
```

Suggests what to do next. Then:

1. `npm run pick -- start` marks the suggestion as what you're working on, or pass an id to pick something else. It prints the page to open.
2. Work through the page. For drills you solve in code, `npm run drill -- <drill folder>` runs the check in watch mode.
3. Loop 1 pages log themselves: answering a page's last question marks it done, with your score kept for reference. For code drills, `npm run pick -- done` runs the check first and logs the date if it passes.

`npm run pick -- status` shows where you are in the current loop.

How `pick` chooses:

- In Loops 2–4, each domain opens with its placement check. Passing every part suggests skipping that domain's drills for the loop. The first attempt counts. Loop 1 has no placement checks; to skip a page you already know, collapse A and B and do the drill.
- After that, drills are ranked by how long ago you practiced their domain, then their mode, so domains interleave.
- A drill waits until its concepts' prerequisites are covered in the current loop.
- A loop ends when its checkpoint passes. After Loop 4, `pick` rotates drills from every loop, weighted toward stale concepts and domains that missed checkpoint parts.

**Progress** lives in `progress/log.jsonl`, one line per finished drill with its date. The drill viewer writes to it through the dev server, so it needs `npm run dev` running, and the sidebar shows a ✓ next to finished pages. Commit the log to carry your progress between machines. `.gitattributes` tells git to keep both machines' lines when you merge, so it never conflicts.

## A drill folder

| File | Role |
| --- | --- |
| `README.md` | Frontmatter, then the page. `<div data-scene="name">` and `<div data-quiz>` mark where scenes and questions go. |
| `scenes.ts` | Interactive scenes, exported by name. |
| `questions.ts` | Read-the-code questions, graded on the page. |
| `drill.ts`, `drill.test.ts` | For drills solved in code: the file you edit, and the check that runs against it. |

## Commands

| Command | What it does |
| --- | --- |
| `npm run pick` | Suggest, start, and log drills |
| `npm run drill -- <folder>` | Vitest watch mode on one drill |
| `npm run dev` | Vite server for the drill harness and the experiments |
| `npm run coverage` | Regenerate `COVERAGE.md` from frontmatter |
| `npm run verify` | Prove every starter fails and every solution passes |
| `npm run typecheck` | Check every file against `@types/three` 0.186 |

## Layout

```
docs/          concept inventory (source of truth)
harness/       shared scene setup, test helpers, harness page
concepts/      one card per concept
drills/        <loop>/<domain>/<concept>/<mode>-<n>/
placement/     <loop>/<domain>/: one check per domain, Loops 2–4
checkpoints/   <loop>/: one set per loop
cross/         cross-domain drills
electives/     elective pages and builds (Procedural & VFX, in TSL)
assets/        Brad's models, loaded by harness/models.ts
solutions/     mirrored tree, never opened during a drill
scripts/       pick.ts, coverage.ts, verify.ts
experiments/   TSL and Gaussian splat sandboxes, outside the curriculum
COVERAGE.md    generated
```

## Build status

The harness and all four core loops are built, including their checkpoints, placement checks, and cross-domain drills. Each of the 159 core concepts has a card and Loop 1 page. The Procedural & VFX elective has all 13 concept pages and six effects; the Blank-file scenes elective is planned but unbuilt. After a blind review, every Loop 1 domain except Domain 2 (kept as Brad approved it) was brought to Domain 1's size and voice. [CLAUDE.md](CLAUDE.md) has the current status and open calls; [COVERAGE.md](COVERAGE.md) tracks the core loops.

## Authoring

Loop 1 pages follow [docs/writing-pages.md](docs/writing-pages.md), which also has the tour-page variant, the size and voice limits taken from Domain 1, and the VFX elective's page format. [CLAUDE.md](CLAUDE.md) holds the project's status, the decisions made so far and why, and known gotchas; Claude Code reads it at the start of every session.

Code drills, from Loop 2 on, follow [docs/writing-drills.md](docs/writing-drills.md); the Domain 1 drills in `drills/2/math/` are its reference. In short:

- Folder: `drills/<loop>/<domain>/<concept>/<mode>-<n>/`. Id: `<loop>.<domain>.<concept>.<mode>.<n>`.
- Frontmatter: `id`, `loop`, `tier`, `concepts`, `mode`, `context`, `lenses`, `misconceptions`. `concepts` holds card ids like `math.dot-product`. `context` and each `misconceptions` entry reference a key on that card: `math.dot-product/cone-check`.
- Starters use `Answer<T>` (`T | null`) from `@harness/drill`, so they fail until solved. Tests use `@harness/check` and compute expected values with three.js instead of hardcoding them.
- A drill with a `space` lens needs a `## Spaces` section. A `cost` lens needs a `## Measure` section.
- The reference solution goes at the mirrored path under `solutions/`.
- Before finishing: `npm run verify && npm run typecheck && npm run coverage`.
