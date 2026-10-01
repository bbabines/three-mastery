---
id: 2.assets.decode-upload-compile.apply.1
loop: 2
tier: core
concepts: [assets.decode-upload-compile]
mode: apply
context: assets.decode-upload-compile/variant-switch
lenses: [cost]
misconceptions: []
---

# First use: pre-compile a variant

> **The job:** Pre-compile shader programs for a configured scene and camera.

## Task

The lights and environment are already set. Return the Promise from `renderer.compileAsync(scene, camera)`, so the caller can wait before showing the variant.

| Function | Return |
| --- | --- |
| `precompileVariant(renderer: Pick<THREE.WebGLRenderer, "compileAsync">, scene: THREE.Scene, camera: THREE.Camera)` | The shader compilation Promise for that scene and camera. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/assets/decode-upload-compile/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/assets/decode-upload-compile/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Compile after setting the lighting and environment, or a new program may still compile on first draw.

</details>

## Where else?

Where else would the same code help? The concept card lists First-interaction hitch, Pre-warming with compileAsync.
