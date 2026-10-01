---
id: 3.scene-graph.clone-semantics.break-and-fix.1
loop: 3
tier: core
concepts: [scene-graph.clone-semantics]
mode: break-and-fix
context: scene-graph.clone-semantics/per-instance-color
lenses: []
misconceptions: [scene-graph.clone-semantics/clone-color-only]
---

# Clone semantics: find the faulty result

> **The job:** Changing a cloned variant’s material color also changes the original part.

## Task

Changing a cloned variant’s material color also changes the original part. Return a variant whose material can be edited independently.

Fix `variant` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/scene-graph/clone-semantics/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

After cloning, which objects still share their material, and which should own a separate one?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Variant duplication; Memory audit.

</details>
