---
id: 2.gpu.blending.implement.1
loop: 2
tier: core
concepts: [gpu.blending]
mode: implement
context: gpu.blending/fades
lenses: [cost]
misconceptions: []
---

# Blending: set up a glass layer

> **The job:** Let a translucent mesh blend without writing a solid depth block.

## Task

Configure a material for glass with the given opacity. Enable transparency, keep depth testing, and turn depth writes off so later transparent objects are not hidden by its depth.

| Function | Return |
| --- | --- |
| `glassMaterial(material: THREE.MeshBasicMaterial, opacity: number)` | The blended, depth-tested, non-depth-writing material. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/gpu/blending/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/gpu/blending/implement-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

three.js leaves depthWrite on unless you set it false for transparent layers.

</details>

## Where else?

Where else would the same code help? The concept card lists Glass, Overlays.
