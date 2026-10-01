---
id: 3.optimization.render-on-demand.break-and-fix.1
loop: 3
tier: light
concepts: [optimization.render-on-demand, optimization.adaptive-quality]
mode: break-and-fix
context: optimization.adaptive-quality/thermal-throttling
lenses: [cost]
misconceptions:
  - optimization.render-on-demand/continuous-required
---

# Render on demand: a static viewer keeps drawing

> **The job:** request only frames that can change the image while responding to sustained slow frames.

## Task

`planFrame` receives a dirty flag, tab visibility, the current DPR, and consecutive slow/fast frame counts. A phone begins to throttle during a long viewing session; its quality step responds after three slow frames or eight fast ones, with DPR kept from 1 to 2. The starter changes quality, but an untouched product still redraws every refresh while its tab is visible. Fix the frame request, explain why in `cause.md`, and write the regression check.

<div data-scene="idlePlan"></div>

## Measure

Count requested renders over 120 idle animation callbacks before and after the repair. Toggle dirty and sustained-slow inputs; a quality change still needs one new frame. Compare frame time and battery behavior in Chrome's Performance panel, not in a timing assertion.

## Your code

Edit `drills/3/optimization/render-on-demand/break-fix-1/drill.ts`, `cause.md`, and `check.ts`.

    npm run drill -- drills/3/optimization/render-on-demand/break-fix-1

## The check

No image change means no render. A visible dirty image and a new DPR both request a frame; a hidden tab does not.

<details><summary>Hint</summary> Visibility grants permission to render, but it is not itself a reason. </details>

## Where else?

Which events should wake a static product viewer?

<details><summary>A few answers</summary> Camera movement and a new swatch wake a static viewer. A background tab can sleep; sustained slow frames on a thermally throttled device may request a quality step. </details>
