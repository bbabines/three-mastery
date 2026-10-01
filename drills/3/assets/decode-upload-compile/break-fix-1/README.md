---
id: 3.assets.decode-upload-compile.break-and-fix.1
loop: 3
tier: core
concepts: [assets.decode-upload-compile]
mode: break-and-fix
context: assets.decode-upload-compile/variant-switch
lenses: [cost]
misconceptions:
  - assets.decode-upload-compile/renders-instantly
---

# Upload and compile: the first variant still hitches

> **The job:** prepare both a variant's shader and its texture before the customer selects it.

## Task

`prepareVariant(renderer, scene, camera, texture)` returns a promise. The starter appears to prepare the variant, yet its first visible frame still has texture upload work. Assume lights and environment have already been installed in `scene`.

Fix the preparation step, name the missing work in `cause.md`, and write a regression assertion in `check.ts`. The scene's controls compare what the starter prepared with what a first render still needs.

<div data-scene="variantWarmup"></div>

## Measure

In a real product view, record the first switch's frame time before and after warming. `compileAsync` covers shader programs; `initTexture` uploads the image. Frame time is measured, never a pass threshold.

## Your code

Edit `drills/3/assets/decode-upload-compile/break-fix-1/drill.ts`, `cause.md`, and `check.ts`.

    npm run drill -- drills/3/assets/decode-upload-compile/break-fix-1

## The check

The acceptance test verifies both preparation calls and waits for shader compilation to finish. The regression check must reject a compile-only warmup.

<details><summary>Hint</summary> Download and decode, GPU upload, and shader compile are separate costs. </details>

## Where else?

Where else can a loaded asset cause a first-use hitch?

<details><summary>A few answers</summary> A material feature first enabled on click, a route preview, or a high-resolution swatch. </details>
