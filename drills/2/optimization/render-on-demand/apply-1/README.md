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

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Run the Domain 10 skip-render experiment while updates continue. Record average frame time and render calls while static, then after a change. For adaptive quality, compare at least 30 frame-time samples on the same scene before and after a level change; no fixed timing threshold is a pass bar.

## Your code

Write it in `drills/2/optimization/render-on-demand/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/optimization/render-on-demand/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

A dirty flag is enough for a static scene. Hysteresis avoids changing quality every frame.

</details>

## Where else?

Where else would the same code help? The concept card lists Static viewer, Background tabs.
