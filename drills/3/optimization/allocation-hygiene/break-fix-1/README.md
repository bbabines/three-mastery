---
id: 3.optimization.allocation-hygiene.break-and-fix.1
loop: 3
tier: core
concepts: [optimization.allocation-hygiene, optimization.leak-detection]
mode: break-and-fix
context: optimization.allocation-hygiene/per-frame-updates
lenses: [cost]
misconceptions:
  - optimization.allocation-hygiene/gc-too-small
  - optimization.leak-detection/slow-growth-fine
---

# Allocation and leaks: a swatch slowly fills GPU memory

> **The job:** recolor one live texture across repeated variant changes.

## Task

`updateVariant` receives a material whose `map` is already a one-pixel `DataTexture`, a color, and reusable four-byte scratch storage. Switching colors works at first, but a long session steadily raises the GPU texture count. Repair the variant update, name the cause in `cause.md`, and write a regression assertion in `check.ts`.

<div data-scene="variantCycle"></div>

## Measure

Record `renderer.info.memory.textures` after the first render and after 20 color changes; record heap allocations in Chrome's Performance panel. After the fix, the count should stay at baseline while the tile still changes color.

## Your code

Edit `drills/3/optimization/allocation-hygiene/break-fix-1/drill.ts`, `cause.md`, and `check.ts`.

    npm run drill -- drills/3/optimization/allocation-hygiene/break-fix-1

## The check

The texture and its pixel buffer must keep their identity across colors. The check repeats a variant cycle so a slowly growing leak is visible.

<details><summary>Hint</summary> A `DataTexture` can upload changed bytes without replacing its object. </details>

## Where else?

Where might this allocation pattern hide in an interactive viewer?

<details><summary>A few answers</summary> Raycast loops and bounds checks can reuse scratch objects; repeated SPA route changes and long sessions reveal GPU resources that were never released. </details>
