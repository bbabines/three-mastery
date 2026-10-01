---
id: 4.shaders.built-in-matrices.ai-review.1
loop: 4
tier: core
concepts: [shaders.built-in-matrices]
mode: ai-review
context: shaders.built-in-matrices/world-height
lenses: []
misconceptions: [shaders.built-in-matrices/world-normals]
---
# AI review: a world normal follows the camera

> **The job:** Prepare the normal matrix for a shader that shades in world space.

## Task

The generated uniform prep uses the combined model-view matrix. The effect changes when the camera moves, although the light is fixed in the world. Return the model matrix’s inverse-transpose 3×3 for world-space normals, including nonuniform scale.

Review the proposed code in `drill.ts`. State the faulty assumption and its effect in `cause.md`, then repair the code. Run the acceptance check to prove the behavior.

## Your code

Edit `drills/4/shaders/built-in-matrices/ai-review-1/drill.ts` and `cause.md`. Check it with:

    npm run drill -- drills/4/shaders/built-in-matrices/ai-review-1

## The check

Change the view rotation without changing the model; the transformed world normal must stay the same. The acceptance check fails on the proposal and passes after the repair.

<details><summary>Hint</summary> Look for a case the proposed helper handles differently from the job's contract. </details>

## Where else?

Which lighting symptom reveals a view-space normal used as a world normal?

<details><summary>A few answers</summary> A fixed world light appears to move across the surface as the camera orbits; build the normal matrix from `modelMatrix`. </details>
