---
id: 4.camera.fit-to-bounds.ai-review.1
loop: 4
tier: light
concepts: [camera.fit-to-bounds]
mode: ai-review
context: camera.fit-to-bounds/thumbnails
lenses: []
misconceptions: [camera.fit-to-bounds/vertical-enough]
---
# AI review: a portrait thumbnail clips the product

> **The job:** Choose a camera distance that fits a sphere in either viewport dimension.

## Task

The generated formula fits the model vertically in a wide thumbnail, but clips its sides in a narrow portrait thumbnail. The arguments are sphere radius, vertical field of view in degrees, and width divided by height. Return the smallest safe center distance.

Review the proposed code in `drill.ts`. State the faulty assumption and its effect in `cause.md`, then repair the code. Run the acceptance check to prove the behavior.

## Your code

Edit `drills/4/camera/fit-to-bounds/ai-review-1/drill.ts` and `cause.md`. Check it with:

    npm run drill -- drills/4/camera/fit-to-bounds/ai-review-1

## The check

A narrow aspect must use the horizontal half-angle; a wide aspect must still fit vertically. The acceptance check fails on the proposal and passes after the repair.

<details><summary>Hint</summary> Look for a case the proposed helper handles differently from the job's contract. </details>

## Where else?

When does a vertical-only fit fail again?

<details><summary>A few answers</summary> A portrait canvas or a wide product can clip horizontally; recalculate after an aspect-ratio change. </details>
