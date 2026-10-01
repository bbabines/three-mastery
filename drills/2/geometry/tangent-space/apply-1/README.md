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

# Normal maps: flip the green channel

> **The job:** Convert a −Y normal-map sample to +Y.

## Task

Write `flipNormalGreen(sample)`. The input is RGB values in the 0–1 range using the −Y convention. Return a new Vector3 for the +Y convention used by three.js and glTF. Keep red and blue as they are, reflect green around 0.5, and leave the sample unchanged.

Save your code and inspect the scene; compare the blue result with the green reference.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `sample` | RGB components from 0 to 1 |
| Answer | Converted RGB components from 0 to 1 |

## Your code

Write it in `drills/2/geometry/tangent-space/apply-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/geometry/tangent-space/apply-1

## The check

Only the green component changes, and applying the conversion twice recovers the sample.

<details><summary>Hint</summary>

The midpoint 0.5 represents no sideways tilt. Values equally far above and below it trade places.

</details>

## Where else?

Where else does map convention matter?

<details><summary>A few answers</summary>

Import a normal map from a different tool or diagnose inside-out bumps.

</details>
