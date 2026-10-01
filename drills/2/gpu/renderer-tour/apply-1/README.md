---
id: 2.gpu.renderer-tour.apply.1
loop: 2
tier: light
concepts: [gpu.renderer-tour, gpu.state-sorting]
mode: apply
context: gpu.renderer-tour/phone-configurator
lenses: [cost]
misconceptions: []
---

# Renderer: pixel ratio and ordering

> **The job:** Cap drawing resolution and set an explicit overlay order.

## Task

Set the renderer pixel ratio to the lesser of device DPR and a cap. Put an overlay after ordinary objects by setting its renderOrder. Return the applied values.

| Function | Return |
| --- | --- |
| `capRendererDpr(renderer: Pick<THREE.WebGLRenderer, "setPixelRatio">, deviceDpr: number, cap: number)` | The pixel ratio passed to WebGLRenderer. |
| `putOverlayLast(overlay: THREE.Object3D, order: number)` | The overlay renderOrder after setting it. |

Raise device DPR above the cap, then lower it. The overlay should remain last in drawing order.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/gpu/renderer-tour/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/gpu/renderer-tour/apply-1
```

## The check

The check verifies that the code caps a high DPR but keeps a lower DPR; sets explicit order independently of scene insertion order. It also rejects an unanswered function.

<details><summary>Hint</summary>

Antialias is chosen in the renderer constructor; setPixelRatio is a later setting.

</details>

## Where else?

Which renderer settings belong at creation, and which can change later?
