---
id: 2.assets.decode-upload-compile.implement.1
loop: 2
tier: core
concepts: [assets.decode-upload-compile]
mode: implement
context: assets.decode-upload-compile/first-interaction-hitch
lenses: [cost]
misconceptions: []
---

# First use: pre-upload a texture

> **The job:** Ask the renderer to upload a ready texture before its first visible draw.

## Task

A loaded texture can still hitch on first use. Call `renderer.initTexture(texture)` once and return the texture so the caller can use it. A loading promise alone does not upload it.

| Function | Return |
| --- | --- |
| `preuploadTexture(renderer: Pick<THREE.WebGLRenderer, "initTexture">, texture: THREE.Texture)` | The same texture after requesting an early GPU upload. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/assets/decode-upload-compile/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/assets/decode-upload-compile/implement-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

initTexture uploads a texture; compileAsync handles shader programs.

</details>

## Where else?

Where else would the same code help? The concept card lists Variant switch, Pre-warming with compileAsync.
