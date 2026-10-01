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

# Tangent space: turn a map normal

> **The job:** Combine a normal-map sample with a surface basis.

## Task

Write `normalFromMap(sample, tangent, bitangent, normal)`. `sample` is 0–1 RGB from a normal map; the other vectors are world directions for the surface’s tangent, bitangent, and normal axes. Return a unit normal in the world. Leave all four inputs unchanged.

Save your code and inspect the scene; compare the blue result with the green reference.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `sample` | RGB values in tangent space |
| `tangent, bitangent, normal` | Directions in the world |
| Answer | Unit normal direction in the world |

## Your code

Write it in `drills/2/geometry/tangent-space/implement-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/geometry/tangent-space/implement-1

## The check

Samples along each texture axis follow the matching world basis direction and the result has unit length.

<details><summary>Hint</summary>

First recenter each color component from 0–1 to −1–+1. Each resulting component weighs one surface axis.

</details>

## Where else?

Where else must a surface-space direction enter the world?

<details><summary>A few answers</summary>

Orient decals or compare a normal-map bump with world lighting.

</details>
