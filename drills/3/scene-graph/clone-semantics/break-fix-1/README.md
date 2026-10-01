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

# Clone: changing one finish changes both parts

> **The job:** Changing a cloned variant’s material color also changes the original part.

## Task

The viewer duplicates a part, then changes the copy's finish. Return a variant whose material can be edited without recoloring the source. Sharing its geometry is fine.

Fix `variant` in `drill.ts`. In the scene, the left box should stay blue when the right box turns yellow.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/scene-graph/clone-semantics/break-fix-1

## The check

The test changes the copy's material color and checks that the source keeps its original color. Your check should do the same with a different source color.

<details><summary>Hint</summary>

After cloning, which objects still share their material, and which should own a separate one?

</details>

## Where else?

Where else could a shared material make one edit change several parts?

<details><summary>A few answers</summary>

Recoloring one rack part, changing one sale swatch, or highlighting one selected instance.

</details>
