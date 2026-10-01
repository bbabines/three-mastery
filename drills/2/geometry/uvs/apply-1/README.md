---
id: 2.geometry.uvs.apply.1
loop: 2
tier: light
concepts: [geometry.uvs, geometry.groups]
mode: apply
context: geometry.uvs/lightmap
lenses: []
misconceptions: [geometry.uvs/zero-to-one]
---

# UVs and groups: copy a triangle mesh and shift its first uv island for a different material tile, preserving the original uvs

> **The job:** Copy a triangle mesh and shift its first UV island for a different material tile, preserving the original UVs.

## Task

Copy a triangle mesh and shift its first three UVs by `uv`, preserving the original. Put that triangle in material slot 1 with a geometry group; UV coordinates may extend beyond 0–1. Keep all other vertex data intact.

Write `assignFaceUv(geometry, uv)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/geometry/uvs/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/geometry/uvs/apply-1

## The check

It passes when `assignFaceUv` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the uvs and groups page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Texture mapping. Generating box UVs.

</details>
