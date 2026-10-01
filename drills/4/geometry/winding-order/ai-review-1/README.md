---
id: 4.geometry.winding-order.ai-review.1
loop: 4
tier: core
concepts: [geometry.winding-order]
mode: ai-review
context: geometry.winding-order/mirrored
lenses: []
misconceptions: [geometry.winding-order/normals-flip-culling]
---
# AI review: a mirrored part rendered inside-out

> **The job:** Bake a mirror transform into indexed geometry while retaining its outward-facing triangles.

## Task

The generated code transforms the positions and normals, yet front-face culling hides the mirrored part. Return a clone of an indexed triangle geometry. Preserve its outward winding under a negative-determinant transform.

Review the proposed code in `drill.ts`. State the faulty assumption and its effect in `cause.md`, then repair the code. Run the acceptance check to prove the behavior.

## Your code

Edit `drills/4/geometry/winding-order/ai-review-1/drill.ts` and `cause.md`. Check it with:

    npm run drill -- drills/4/geometry/winding-order/ai-review-1

## The check

Compare the transformed face direction with the geometry’s transformed normal under ordinary and mirrored scales. The acceptance check fails on the proposal and passes after the repair.

<details><summary>Hint</summary> Look for a case the proposed helper handles differently from the job's contract. </details>

## Where else?

What else must follow a mirrored triangle when geometry is baked?

<details><summary>A few answers</summary> Keep each corner’s UV and normal with its vertex when reversing winding, then verify the front face by raycasting. </details>
