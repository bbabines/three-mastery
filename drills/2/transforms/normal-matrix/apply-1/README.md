---
id: 2.transforms.normal-matrix.apply.1
loop: 2
tier: core
concepts: [transforms.normal-matrix]
mode: apply
context: transforms.normal-matrix/rim
lenses: [space]
misconceptions: [transforms.normal-matrix/normals-like-directions]
---

# Normal matrix: face the viewer

> **The job:** Decide if a stretched face points toward a viewer.

## Task

A part has unequal scale, so its face normal cannot be transformed like an ordinary direction. `faceToward(part, localNormal, worldView)` returns true when the corrected world normal points toward the viewer direction; zero dot counts as not facing. Leave both vectors unchanged.

Turn the stretched panel. The readout should say front when its corrected normal points toward the yellow viewer arrow.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `part` | Local frame under a parent |
| `localNormal` | Part local direction |
| `worldView` | World direction toward viewer |
| Answer | Boolean: front-facing or not |


## Your code

Write it in `drills/2/transforms/normal-matrix/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/normal-matrix/apply-1

## The check

The check uses a tilted, unequally scaled part and viewer directions on both sides. It checks input vectors are unchanged.

<details><summary>Hint</summary>

Use a normal matrix from the current world transform. The ordinary upper-left matrix bends a face normal incorrectly under uneven scale.

</details>

## Where else?

Where else do corrected face normals matter?

<details><summary>A few answers</summary>

Back-face picking. Lighting a stretched mesh. Rim effects.

</details>
