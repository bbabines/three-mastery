---
id: 3.queries.intersection-anatomy.break-and-fix.1
loop: 3
tier: core
concepts: [queries.intersection-anatomy]
mode: break-and-fix
context: queries.intersection-anatomy/orient-marker
lenses: [space]
misconceptions: [queries.intersection-anatomy/face-normal-world]
---

# Hit normal: a marker tilts on scaled geometry

> **The job:** A marker follows a raycast hit but tilts on a scaled part.

## Task

A marker should point away from a stretched, turned panel. A hit's `face.normal` is in the object's local space. Return its world-space direction, without changing the stored normal.

Fix `hitNormalWorld` in `drill.ts`. The yellow arrow is perpendicular to the panel; your arrow is red.

<div data-scene="demo"></div>

## Spaces

| Value | Space |
| --- | --- |
| Hit face normal | The part's own space |
| Part transform | Maps the part into world space |
| Returned normal | World direction |

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/queries/intersection-anatomy/break-fix-1

## The check

The test uses uneven scale and a sloped face normal. Your check should reject a direction transformed like an ordinary vector.

<details><summary>Hint</summary>

Where is a face normal stored, and what does uneven scale do to it?

</details>

## Where else?

Where else does a local surface normal need to face the world correctly?

<details><summary>A few answers</summary>

Surface markers, decals on scaled parts, or a light aligned with a hit face.

</details>
