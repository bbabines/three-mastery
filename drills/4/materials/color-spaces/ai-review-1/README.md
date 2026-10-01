---
id: 4.materials.color-spaces.ai-review.1
loop: 4
tier: core
concepts: [materials.color-spaces]
mode: ai-review
context: materials.color-spaces/normal-maps
lenses: []
misconceptions: [materials.color-spaces/all-srgb]
---
# AI review: a normal map marked as color

> **The job:** Mark a color map as sRGB while keeping the normal map as linear data.

## Task

The generated loader treats every image as display color. The surface then shades differently from the same model loaded from glTF. Set the color map to SRGBColorSpace and the normal map to NoColorSpace.

Review the proposed code in `drill.ts`. State the faulty assumption and its effect in `cause.md`, then repair the code. Run the acceptance check to prove the behavior.

## Your code

Edit `drills/4/materials/color-spaces/ai-review-1/drill.ts` and `cause.md`. Check it with:

    npm run drill -- drills/4/materials/color-spaces/ai-review-1

## The check

Use separate textures and assert each colorSpace after configuration. The acceptance check fails on the proposal and passes after the repair.

<details><summary>Hint</summary> Look for a case the proposed helper handles differently from the job's contract. </details>

## Where else?

Where else could this flaw appear when the scene grows beyond one simple example?

<details><summary>A few answers</summary> A second product variant, a mobile viewport, or a scene with nested parts can expose a hidden assumption. </details>
