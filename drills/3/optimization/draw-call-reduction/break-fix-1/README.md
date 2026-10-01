---
id: 3.optimization.draw-call-reduction.break-and-fix.1
loop: 3
tier: core
concepts: [optimization.draw-call-reduction, optimization.overdraw]
mode: break-and-fix
context: optimization.overdraw/cutout-panels
lenses: [cost]
misconceptions:
  - optimization.draw-call-reduction/instancing-fill-rate
  - optimization.overdraw/hidden-free
---

# Draw calls and overdraw: a cutout rack still runs slowly

> **The job:** draw repeated panels in one call without blending their hidden pixels.

## Task

`buildCutoutRack` already places repeated panels in one `InstancedMesh`. The panels have binary alpha: a pixel is either fully present or fully absent. The frame has few draw calls, yet stacking more panels still raises fragment work sharply. Fix the material mode in `drill.ts`, name the wrong assumption in `cause.md`, and write a regression assertion in `check.ts`.

<div data-scene="cutoutRack"></div>

## Measure

Record `renderer.info.render.calls` and a frame-time sample in Chrome's Performance panel before and after the fix. Increase the visible stack depth without increasing instance count; draw calls alone cannot prove fragment cost.

## Your code

Edit `drills/3/optimization/draw-call-reduction/break-fix-1/drill.ts`, `cause.md`, and `check.ts`.

    npm run drill -- drills/3/optimization/draw-call-reduction/break-fix-1

## The check

The rack must keep all transforms in one instance draw and use an alpha-tested, depth-writing cutout material. The regression check catches a return to blending.

<details><summary>Hint</summary> Opaque surviving pixels can write depth; blended pixels usually cannot. </details>

## Where else?

Which part would you inspect first if draw calls dropped but a glass-heavy scene stayed slow?

<details><summary>A few answers</summary> A static environment or many same-material parts may benefit from fewer calls; glass layers and full-screen overlays need a separate overdraw check. </details>
