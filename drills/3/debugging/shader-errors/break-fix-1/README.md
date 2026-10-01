---
id: 3.debugging.shader-errors.break-and-fix.1
loop: 3
tier: light
concepts: [debugging.shader-errors, debugging.debug-views]
mode: break-and-fix
context: debugging.shader-errors/on-before-compile
lenses: []
misconceptions:
  - debugging.shader-errors/line-number
---

# Shader errors: the wrong source line is highlighted

> **The job:** map a compiler line to the user's shader edit and show a normal debug view.

## Task

three.js adds shader source before an `onBeforeCompile` edit. `explainShaderError(log, injectedLines)` receives the compiler log and the count of lines added before the user's code. It returns the user's line number and a `MeshNormalMaterial` for checking whether geometry and normals still draw.

The starter creates the useful debug material, but highlights the compiler's raw line in the user's editor. Fix the mapping, name the mistake in `cause.md`, and write a regression assertion in `check.ts`.

<div data-scene="shaderLog"></div>

## Your code

Edit `drills/3/debugging/shader-errors/break-fix-1/drill.ts`, `cause.md`, and `check.ts`.

    npm run drill -- drills/3/debugging/shader-errors/break-fix-1

## The check

The acceptance test uses different injected-prefix lengths and checks the debug material type. The regression assertion rejects a raw compiler line presented as a user line.

<details><summary>Hint</summary> The compiler sees the final generated shader, not only the lines in the user's edit. </details>

## Where else?

What can a normal-color debug view reveal before revisiting the shader?

<details><summary>A few answers</summary> Missing normals, reversed faces, or a transform-space mismatch. </details>
