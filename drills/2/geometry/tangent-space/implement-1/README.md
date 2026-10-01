---
id: 2.geometry.tangent-space.implement.1
loop: 2
tier: core
concepts: [geometry.tangent-space]
mode: implement
context: geometry.tangent-space/mirrored-uvs
lenses: []
misconceptions: [geometry.tangent-space/world-directions]
---

# Tangent space: turn a tangent-space normal-map sample from 0–1 colors into a world-space unit normal using the surface tbn basis

> **The job:** Turn a tangent-space normal-map sample from 0–1 colors into a world-space unit normal using the surface TBN basis.

## Task

Turn a tangent-space normal-map sample from 0–1 colors into a world-space unit normal using the surface TBN basis.

Write `normalFromMap(sample, tangent, bitangent, normal)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/geometry/tangent-space/implement-1/drill.ts`. Check it with:

    npm run drill -- drills/2/geometry/tangent-space/implement-1

## The check

It passes when `normalFromMap` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the tangent space page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Surface detail on low-poly meshes. Importing maps from Substance or Unreal.

</details>
