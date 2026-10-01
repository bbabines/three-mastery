---
id: 3.scene-graph.traverse.break-and-fix.1
loop: 3
tier: core
concepts: [scene-graph.traverse]
mode: break-and-fix
context: scene-graph.traverse/collect-meshes
lenses: []
misconceptions: [scene-graph.traverse/visible-children]
---

# Traverse: find the faulty result

> **The job:** A visible-part counter includes meshes under a hidden group.

## Task

A visible-part counter includes meshes under a hidden group. Return the number of meshes the scene can currently show.

Fix `visibleMeshCount` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/scene-graph/traverse/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Does traverse visit descendants of a hidden parent?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Finding the product root from a clicked mesh; Applying an override.

</details>
