---
id: 3.optimization.hitch-avoidance.break-and-fix.1
loop: 3
tier: light
concepts: [optimization.hitch-avoidance]
mode: break-and-fix
context: optimization.hitch-avoidance/first-click
lenses: [cost]
misconceptions:
  - optimization.hitch-avoidance/load-only-delay
---

# Hitch avoidance: the first variant switch freezes

> **The job:** prepare a new variant's GPU resources before making it visible.

## Task

`revealVariant` receives a renderer, scene, camera, new texture, and `show` callback. Downloading assets finishes before the user clicks, but the first switch still stutters. The starter calls the callback before the new texture is uploaded and the shader compile finishes. Repair the order, explain the source of the hitch in `cause.md`, and write a regression check that waits on a controlled compile.

<div data-scene="variantReveal"></div>

## Measure

Use Chrome's Performance panel to record first-switch frame time before and after prewarming. The scene also lists upload, compile, and show events; order is checked, while frame time is measured rather than asserted.

## Your code

Edit `drills/3/optimization/hitch-avoidance/break-fix-1/drill.ts`, `cause.md`, and `check.ts`.

    npm run drill -- drills/3/optimization/hitch-avoidance/break-fix-1

## The check

The new variant stays hidden until texture upload and asynchronous shader compilation complete. A promise gate makes a premature reveal observable.

<details><summary>Hint</summary> A resolved network request does not mean the GPU has the variant ready. </details>

## Where else?

When else can a one-time GPU cost land inside an interactive frame?

<details><summary>A few answers</summary> Opening a route with new materials, switching a swatch to an unseen shader, and first use of a large texture. </details>
