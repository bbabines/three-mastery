---
id: 4.gpu.render-targets.ai-review.1
loop: 4
tier: core
concepts: [gpu.render-targets]
mode: ai-review
context: gpu.render-targets/thumbnails
lenses: []
misconceptions: [gpu.render-targets/always-screen]
---
# AI review: a thumbnail redirects the next frame

> **The job:** Render a thumbnail to a target and restore the renderer’s previous target.

## Task

The generated helper captures the thumbnail, but later draws silently go to that thumbnail instead of their former destination. Keep the target change scoped to this draw, including when rendering throws.

Review the proposed code in `drill.ts`. State the faulty assumption and its effect in `cause.md`, then repair the code. Write a regression assertion in `check.ts` that rejects the original bug.

## Your code

Edit `drills/4/gpu/render-targets/ai-review-1/drill.ts`, `cause.md`, and `check.ts`. Check it with:

    npm run drill -- drills/4/gpu/render-targets/ai-review-1

## The check

A fake renderer should see the old target restored after success and after an error. The acceptance check fails on the proposal and passes after the repair.

<details><summary>Hint</summary> Look for a case the proposed helper handles differently from the job's contract. </details>

## Where else?

What if the thumbnail is drawn while another off-screen pass is active?

<details><summary>A few answers</summary> Restore that pass’s target, not always `null`; a `finally` block also restores it after a render error. </details>
