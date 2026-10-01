---
id: 4.interaction.pointer-events.ai-review.1
loop: 4
tier: light
concepts: [interaction.pointer-events]
mode: ai-review
context: interaction.pointer-events/touch-tap
lenses: []
misconceptions: [interaction.pointer-events/dpr-ndc]
---
# AI review: a high-DPR tap picks the wrong object

> **The job:** Convert a touch position to normalized device coordinates inside the canvas.

## Task

The generated picker seems right on a full-window canvas at DPR 1, but taps shift on a small high-DPR canvas. Use CSS-pixel client coordinates and the canvas rectangle. Return NDC in the range −1 to 1.

Review the proposed code in `drill.ts`. State the faulty assumption and its effect in `cause.md`, then repair the code. Run the acceptance check to prove the behavior.

## Your code

Edit `drills/4/interaction/pointer-events/ai-review-1/drill.ts` and `cause.md`. Check it with:

    npm run drill -- drills/4/interaction/pointer-events/ai-review-1

## The check

Use a canvas offset from the window edge and a device ratio above 1. The acceptance check fails on the proposal and passes after the repair.

<details><summary>Hint</summary> Look for a case the proposed helper handles differently from the job's contract. </details>

## Where else?

Where else could this flaw appear when the scene grows beyond one simple example?

<details><summary>A few answers</summary> A second product variant, a mobile viewport, or a scene with nested parts can expose a hidden assumption. </details>
