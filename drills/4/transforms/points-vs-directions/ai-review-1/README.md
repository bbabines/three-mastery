---
id: 4.transforms.points-vs-directions.ai-review.1
loop: 4
tier: core
concepts: [transforms.points-vs-directions]
mode: ai-review
context: transforms.points-vs-directions/ray-direction
lenses: []
misconceptions: [transforms.points-vs-directions/apply-matrix-directions]
---
# AI review: a ray direction that follows the parent’s position

> **The job:** Convert a local ray direction to the direction it travels in the world.

## Task

The generated ray helper works while the parent is at the origin. Moving the parent changes the ray direction even though its orientation is unchanged. Return a unit world direction. The input direction and object belong to the caller and must not change.

Review the proposed code in `drill.ts`. State the faulty assumption and its effect in `cause.md`, then repair the code. Run the acceptance check to prove the behavior.

## Your code

Edit `drills/4/transforms/points-vs-directions/ai-review-1/drill.ts` and `cause.md`. Check it with:

    npm run drill -- drills/4/transforms/points-vs-directions/ai-review-1

## The check

A translated and rotated parent must give the same direction as its rotation and scale alone. The acceptance check fails on the proposal and passes after the repair.

<details><summary>Hint</summary> Look for a case the proposed helper handles differently from the job's contract. </details>

## Where else?

When should a world conversion include the parent’s translation?

<details><summary>A few answers</summary> A local point needs translation, but velocity and forward directions do not; normals under uneven scale also need the normal matrix. </details>
