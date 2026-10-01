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

# Intersection anatomy: find the faulty result

> **The job:** A marker follows a raycast hit but tilts on a scaled part.

## Task

A marker follows a raycast hit but tilts on a scaled part. Turn the hit face normal from the object’s local space into world space.

Fix `hitNormalWorld` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs | The named camera, world, or screen space in the task |
| Answer | The space stated in the task |

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/queries/intersection-anatomy/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Where is a face normal stored, and what does uneven scale do to it?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Painting at a UV; Picking an instance.

</details>
