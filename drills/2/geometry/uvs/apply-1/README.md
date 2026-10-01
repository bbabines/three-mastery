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

# UVs: retile one triangle

> **The job:** Shift only the first face’s UVs on a copy.

## Task

Write `assignFaceUv(geometry, uv)`. Return a copy whose first triangle’s UVs are shifted by `uv`, while later triangles and the input remain unchanged. An indexed mesh may share corners, so separate them before editing this one face. Give the first triangle material slot 1 and all remaining triangles slot 0.

Save your code and inspect the scene; compare the blue result with the green reference.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `geometry positions` | Measured from object itself |
| `geometry UVs, uv` | Texture coordinates |
| Answer | New BufferGeometry with UVs and groups |

## Your code

Write it in `drills/2/geometry/uvs/apply-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/geometry/uvs/apply-1

## The check

Every first-face corner shifts, later UVs do not, both material groups cover the triangles, and the source remains unchanged.

<details><summary>Hint</summary>

Shared vertices cannot hold two UV values at once. How can this face get its own three UV entries?

</details>

## Where else?

Where else must a mesh split shared corners?

<details><summary>A few answers</summary>

Place a texture seam or give adjacent faces different flat colors.

</details>
