---
id: 4.rotation.euler-order.ai-review.1
loop: 4
tier: core
concepts: [rotation.euler-order]
mode: ai-review
context: rotation.euler-order/yaw-pitch-camera
lenses: []
misconceptions: [rotation.euler-order/order-irrelevant]
---
# AI review: a camera that rolls as it pitches

> **The job:** Turn a camera by yaw around its parent’s up axis, then pitch around its own side axis.

## Task

The proposal passes a yaw-only demo but a camera with both yaw and pitch points in the wrong direction. Return a quaternion for yaw first, then local pitch. Both inputs are radians.

Review the proposed code in `drill.ts`. State the faulty assumption and its effect in `cause.md`, then repair the code. Run the acceptance check to prove the behavior.

## Your code

Edit `drills/4/rotation/euler-order/ai-review-1/drill.ts` and `cause.md`. Check it with:

    npm run drill -- drills/4/rotation/euler-order/ai-review-1

## The check

Compare a combined yaw and pitch with the order three.js applies for yaw then local pitch. The acceptance check fails on the proposal and passes after the repair.

<details><summary>Hint</summary> Look for a case the proposed helper handles differently from the job's contract. </details>

## Where else?

Where else could this flaw appear when the scene grows beyond one simple example?

<details><summary>A few answers</summary> A second product variant, a mobile viewport, or a scene with nested parts can expose a hidden assumption. </details>
