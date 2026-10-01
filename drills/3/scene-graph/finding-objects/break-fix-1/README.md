---
id: 3.scene-graph.finding-objects.break-and-fix.1
loop: 3
tier: light
concepts: [scene-graph.finding-objects, scene-graph.user-data]
mode: break-and-fix
context: scene-graph.finding-objects/find-node
lenses: []
misconceptions: [scene-graph.finding-objects/names-unique]
---

# Finding objects: find the faulty result

> **The job:** A part lookup fails after a glTF import renames its nodes.

## Task

A part lookup fails after a glTF import renames its nodes. Find a nested object by its stable SKU metadata rather than its display name.

Fix `findSku` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/scene-graph/finding-objects/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

What happens if a Group and a Mesh carry the same name?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Grouping by material; Locating lights.

</details>
