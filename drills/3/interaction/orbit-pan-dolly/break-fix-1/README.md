---
id: 3.interaction.orbit-pan-dolly.break-and-fix.1
loop: 3
tier: light
concepts: [interaction.orbit-pan-dolly, interaction.focus-on-object]
mode: break-and-fix
context: interaction.orbit-pan-dolly/top-down-planner
lenses: []
misconceptions: []
---

# Orbit pan dolly: focus the camera and its orbit point together

> **The job:** Focus the camera and its orbit point together.

## Task

After focusing a part, the next orbit swings around the old target.

Fix the function in `drill.ts`. The red orbit target should land on the green part; the blue camera should meet the yellow reference.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/interaction/orbit-pan-dolly/break-fix-1

## The check

The orbit target must land on the focus point and the camera must stay on its original view line at the requested distance. Write a short assertion in `check.ts` with a different input. It must reject the starter and accept the repair.

<details><summary>Hint</summary>

Which point will OrbitControls use as its center after focus?

</details>

## Where else?

What else should move with the camera when focus changes?

<details><summary>A few answers</summary>

Product viewer; Inspecting detail.

</details>
