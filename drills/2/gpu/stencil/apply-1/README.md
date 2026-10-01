---
id: 2.gpu.stencil.apply.1
loop: 2
tier: light
concepts: [gpu.stencil, gpu.multisampling]
mode: apply
context: gpu.stencil/masks-portals
lenses: [cost]
misconceptions: []
---

# Stencil and MSAA: configure an offscreen pass

> **The job:** Write a stencil reference and request multisampling for a render target.

## Task

Configure a material so passing fragments write a stencil reference. Create an offscreen WebGLRenderTarget with an explicit MSAA sample count; canvas antialiasing does not carry into targets.

| Function | Return |
| --- | --- |
| `stencilWriter(material: THREE.Material, reference: number)` | The material configured to write a stencil reference. |
| `msaaTarget(width: number, height: number, samples: number)` | The multisampled offscreen target. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/gpu/stencil/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/gpu/stencil/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

The renderer must have a stencil buffer at construction, and each render target needs its own samples.

</details>

## Where else?

Where else would the same code help? The concept card lists Outlines, Clipping caps.
