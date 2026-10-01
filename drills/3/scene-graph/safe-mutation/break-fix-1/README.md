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

# Safe mutation: find the faulty result

> **The job:** Clearing temporary highlight helpers skips every other helper in a group.

## Task

Clearing temporary highlight helpers can skip one or crash while walking a group, leaving parts highlighted. Each helper points to a mesh whose original material is saved in `target.userData.originalMaterial`. Restore each material and remove every helper; report how many were cleared.

Fix `clearMarked` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/scene-graph/safe-mutation/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

What can happen to the next sibling when a traversal removes the current child?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Removing helpers; Splitting groups.

</details>
