---
id: 4.camera.fit-to-bounds.cross.1
loop: 4
tier: core
concepts: [camera.fit-to-bounds, scene-graph.world-bounds, interaction.frame-rate-independence, interaction.interpolation-toolbox]
mode: cross-domain
context: interaction.interpolation-toolbox/focus-animation
lenses: [space]
misconceptions: []
---

# Focus on a clicked part with damped motion

> **The job:** combine ideas from several domains in one small piece of code.

## Task

Write `focusStep(camera, currentTarget, part, seconds)` to move the camera and its orbit target toward a fit of the clicked part. Use world bounds including children, fit its sphere to the narrower view angle, and use exponential damping so two half-steps match one full step. Return new camera position and target without changing the inputs.

<div data-scene="focus"></div>

## Spaces

| Value | Space |
| --- | --- |
| `part` bounds | World space |
| Camera position and `currentTarget` | World space |
| Return values | World space |

## Your code

Write it in `cross/4/damped-focus/drill.ts`. Save to update the scene. Check it with:

```
npm run drill -- cross/4/damped-focus
```

## The check

The check uses a nested, moved part and compares one long update with two half updates. It also checks a wider object needs a farther camera.

<details><summary>Hint</summary>

Use the relevant three.js methods shown on the concept pages. Make the result observable before trying to optimize it.

</details>

## Where else?

Where else would this choice appear in an interactive 3D tool?
