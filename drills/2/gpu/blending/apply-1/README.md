---
id: 2.gpu.blending.apply.1
loop: 2
tier: core
concepts: [gpu.blending]
mode: apply
context: gpu.blending/overlays
lenses: [cost]
misconceptions: []
---

# Blending: fade a selected part

> **The job:** Fade a highlighted Mesh without making it mask other transparent parts.

## Task

Set a material opacity for a fade, enable blending only when alpha is below one, and disable depth writes during the fade. Return the material.

| Function | Return |
| --- | --- |
| `fadeMaterial(material: THREE.MeshBasicMaterial, alpha: number)` | The material configured for the current fade alpha. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/gpu/blending/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/gpu/blending/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Transparent objects sort per object, so depth-writing glass often hides another surface.

</details>

## Where else?

Where else would the same code help? The concept card lists Glass, Fades.
