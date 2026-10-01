---
id: 2.optimization.render-on-demand.apply.1
loop: 2
tier: light
concepts: [optimization.render-on-demand, optimization.adaptive-quality]
mode: apply
context: optimization.render-on-demand/battery-life
lenses: [cost]
misconceptions: []
---

# Render only when needed, then adapt quality

> **The job:** Skip unchanged frames and use measured frame time to adjust quality.

## Task

A static viewer renders on a change or a newly visible tab. Return whether it should draw. Given a frame-time target and hysteresis band, step a quality level down only above the slow band and up only below the fast band.

| Function | Return |
| --- | --- |
| `shouldDraw(changed: boolean, tabVisible: boolean)` | Whether this frame needs rendering. |
| `qualityStep(level: number, frameMs: number, targetMs: number, bandMs: number)` | The next quality level from measured frame time. |

The preview shows one draw decision and quality step; the test covers other states.

<div data-scene="practice"></div>

## Measure

With updates paused, record frame time and `renderer.info.render.calls` before and after skipping unchanged frames. For quality changes, compare several frames on the same scene; frame time is measured, not graded.

## Your code

Write it in `drills/2/optimization/render-on-demand/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/optimization/render-on-demand/apply-1
```

## The check

The test checks both draw conditions and a quality dead band around the frame target.

<details><summary>Hint</summary>

A dirty flag is enough for a static scene. Hysteresis avoids changing quality every frame.

</details>

## Where else?

Which events should wake a static viewer?

<details><summary>A few answers</summary> A camera drag, variant change, resize, or newly visible tab should request a frame. </details>
