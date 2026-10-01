---
id: 3.scene-graph.safe-mutation.break-and-fix.1
loop: 3
tier: light
concepts: [scene-graph.safe-mutation, scene-graph.material-override]
mode: break-and-fix
context: scene-graph.safe-mutation/replace-meshes
lenses: []
misconceptions: []
---

# Safe mutation: skipped highlight helpers

> **The job:** Clearing temporary highlight helpers skips every other helper in a group.

## Task

Four highlighted parts have a red helper ring each. Every helper points to its mesh through `userData.target`; the original material is in `target.userData.originalMaterial`. Restore each material, remove every helper, and return the number cleared.

Fix `clearMarked` in `drill.ts`. All four boxes should turn blue, and every red ring should disappear.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/scene-graph/safe-mutation/break-fix-1

## The check

The test puts several helpers next to one another and checks the count, parent links, and restored materials. Your check should catch a helper left behind.

<details><summary>Hint</summary>

What can happen to the next sibling when a traversal removes the current child?

</details>

## Where else?

Where else can changing children during a walk skip work?

<details><summary>A few answers</summary>

Replacing imported meshes, clearing selection outlines, or removing temporary labels.

</details>
