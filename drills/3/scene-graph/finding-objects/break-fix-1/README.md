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

# Finding objects: a name misses the part

> **The job:** A part lookup fails after a glTF import renames its nodes.

## Task

A loaded model has two parts with the same imported name. `findSku` receives the root and a SKU. Return the nested object whose `userData.sku` matches, or `null` when none does.

Fix `findSku` in `drill.ts`. The green outline marks SKU B-2; your returned part turns yellow.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/scene-graph/finding-objects/break-fix-1

## The check

The test uses duplicate names and nested parts, then asks for a SKU that is absent. Your check should catch a lookup that trusts names.

<details><summary>Hint</summary>

Which value survives imported name cleanup, and how do you visit children inside Groups?

</details>

## Where else?

Where else is a stable part ID safer than an imported name?

<details><summary>A few answers</summary>

Restoring a selected part, applying a finish to one item, or matching a saved cart choice.

</details>
