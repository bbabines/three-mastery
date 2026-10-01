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

# Traverse: a hidden branch gets counted

> **The job:** A visible-part counter includes meshes under a hidden group.

## Task

A product root holds one visible mesh and a hidden group with two more. `visibleMeshCount` should count only meshes reached through visible branches. A hidden parent hides all its descendants.

Fix `visibleMeshCount` in `drill.ts`. The scene shows one blue box, so the count should be one.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/scene-graph/traverse/break-fix-1

## The check

The test includes meshes under a hidden group. Your check should fail if the count includes any child of that group.

<details><summary>Hint</summary>

Does traverse visit descendants of a hidden parent?

</details>

## Where else?

Where else should a hidden branch be left out of a scene walk?

<details><summary>A few answers</summary>

Collecting visible meshes for an override, auditing a product view, or listing selectable parts.

</details>
