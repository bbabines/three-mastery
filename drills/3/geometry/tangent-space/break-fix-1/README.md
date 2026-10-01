---
id: 3.geometry.tangent-space.break-and-fix.1
loop: 3
tier: core
concepts: [geometry.tangent-space]
mode: break-and-fix
context: geometry.tangent-space/low-poly-detail
lenses: []
misconceptions: [geometry.tangent-space/world-directions]
---

# Tangent space: the lighting stays behind

> **The job:** Turn a normal-map sample into a direction on the surface.

## Task

`normalFromMap(sample, tangent, bitangent, normal)` returns a unit direction in the same space as its three basis vectors. `sample` holds normal-map RGB values from 0 to 1; the basis is the surface's tangent, bitangent, and normal. The starter treats RGB as a direction already in the world, so the lighting does not turn with the part. Leave all four vectors unchanged.

The blue light-direction arrow should match the green reference when the surface basis turns.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/geometry/tangent-space/break-fix-1

## The check

The acceptance test checks a flat sample and a tilted sample under a turned basis. Your check should reject an answer that ignores the basis or changes an input.

<details><summary>Hint</summary>

The tangent-space page shows what `(0.5, 0.5, 1)` means and how the TBN basis turns that map direction with the surface.

</details>

## Where else?

Where else must a local surface direction turn with its face?

<details><summary>A few answers</summary>

Scratched metal, brushed wood, or a normal-mapped character turning under a light.

</details>
