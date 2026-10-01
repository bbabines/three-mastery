---
id: 2.gpu.depth-early-z.apply.1
loop: 2
tier: core
concepts: [gpu.depth-early-z]
mode: apply
context: gpu.depth-early-z/depth-prepass
lenses: [cost]
misconceptions: []
---

# Depth: cut a panel with alpha test

> **The job:** Make transparent holes in a panel while keeping solid parts in depth.

## Task

Configure an alpha-tested material with a cutoff. Keep it depth-tested and depth-writing, and turn off blending transparency. Return the material.

| Function | Return |
| --- | --- |
| `alphaCutout(material: THREE.MeshBasicMaterial, cutoff: number)` | The alpha-tested, depth-writing material. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/gpu/depth-early-z/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/gpu/depth-early-z/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Alpha test discards below a threshold; it does not require transparent blending.

</details>

## Where else?

Where else would the same code help? The concept card lists Overdraw, Alpha-tested mesh panels.
