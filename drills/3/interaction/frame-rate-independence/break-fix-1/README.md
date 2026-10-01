---
id: 3.interaction.frame-rate-independence.break-and-fix.1
loop: 3
tier: core
concepts: [interaction.frame-rate-independence]
mode: break-and-fix
context: interaction.frame-rate-independence/camera-smoothing
lenses: []
misconceptions: [interaction.frame-rate-independence/lerp-per-frame]
---

# Frame rate independence: smooth a camera move consistently across refresh rates

> **The job:** Smooth a camera move consistently across refresh rates.

## Task

A camera catch-up feels faster on a 120 Hz screen than on a 60 Hz screen.

Fix the function in `drill.ts`. The blue one-step marker should meet the yellow two-half-step marker.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/interaction/frame-rate-independence/break-fix-1

## The check

One elapsed-time step and two shorter steps with the same total time must end at the same value. Write a short assertion in `check.ts` with a different input. It must reject the starter and accept the repair.

<details><summary>Hint</summary>

Should two half-length updates equal one full-length update?

</details>

## Where else?

Where else must a transition behave the same at 60 Hz and 120 Hz?

<details><summary>A few answers</summary>

Hover scale; Drag smoothing.

</details>
