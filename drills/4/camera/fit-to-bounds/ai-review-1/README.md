---
id: 4.camera.fit-to-bounds.ai-review.1
loop: 4
tier: light
concepts: [camera.fit-to-bounds]
mode: ai-review
context: camera.fit-to-bounds/focus-part
lenses: []
misconceptions: [camera.fit-to-bounds/vertical-enough]
---
# AI review: a narrow viewport clips the product

> **The job:** Choose a camera distance that fits a sphere in either viewport dimension.

## Task

The generated formula fits the model vertically on a wide viewport, but clips its sides in a narrow one. The arguments are sphere radius, vertical field of view in degrees, and width divided by height. Return the smallest safe center distance.

Review the proposed code in `drill.ts`. State the faulty assumption and its effect in `cause.md`, then repair the code. Run the acceptance check to prove the behavior.

## Your code

Edit `drills/4/camera/fit-to-bounds/ai-review-1/drill.ts` and `cause.md`. Check it with:

    npm run drill -- drills/4/camera/fit-to-bounds/ai-review-1

## The check

A narrow aspect must use the horizontal half-angle; a wide aspect must still fit vertically. The acceptance check fails on the proposal and passes after the repair.

<details><summary>Hint</summary> Look for a case the proposed helper handles differently from the job's contract. </details>

## Where else?

Where else could this flaw appear when the scene grows beyond one simple example?

<details><summary>A few answers</summary> A second product variant, a mobile viewport, or a scene with nested parts can expose a hidden assumption. </details>
