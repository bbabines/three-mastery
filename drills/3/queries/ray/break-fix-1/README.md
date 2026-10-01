---
id: 3.queries.ray.break-and-fix.1
loop: 3
tier: light
concepts: [queries.ray, queries.ray-sphere]
mode: break-and-fix
context: queries.ray-sphere/coarse-hit
lenses: []
misconceptions: []
---

# Ray: find the faulty result

> **The job:** A coarse pointer hit returns the ray origin instead of the sphere surface, especially when the ray starts inside the sphere.

## Task

A coarse pointer hit returns the ray origin instead of the sphere surface, especially when the ray starts inside the sphere. Return the nearest surface hit in the ray’s forward direction.

Fix `sphereEntry` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/queries/ray/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

What point does an intersection test return, and how does it differ from a yes-or-no test?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Pointer picking; Placing on the ground.

</details>
