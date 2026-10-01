---
id: 2.geometry.tangent-space.apply.1
loop: 2
tier: core
concepts: [geometry.tangent-space]
mode: apply
context: geometry.tangent-space/import-maps
lenses: []
misconceptions: [geometry.tangent-space/world-directions]
---

# Tangent space: convert a directx-style −y normal-map sample to the +y convention used by three

> **The job:** Convert a DirectX-style −Y normal-map sample to the +Y convention used by three.

## Task

Convert a DirectX-style −Y normal-map sample to the +Y convention used by three.js and glTF.

Write `flipNormalGreen(sample)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/geometry/tangent-space/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/geometry/tangent-space/apply-1

## The check

It passes when `flipNormalGreen` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the tangent space page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Surface detail on low-poly meshes. Mirrored UVs breaking lighting.

</details>
