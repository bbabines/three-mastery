---
id: 1.debugging.triage.read-the-code.1
loop: 1
tier: core
concepts: [debugging.triage]
mode: read-the-code
context: debugging.triage/black-screen
lenses: []
misconceptions:
  - debugging.triage/black-screen-shader
---

# Triage

> **In short:** Before changing any code, find which of five buckets a bug lives in: transform, geometry, material (lights included), camera, or pipeline.
>
> **Used for:** A blank canvas, a part missing from a model, a color off the brand swatch, and reading bug reports.

## A · The basics

### Five buckets

Every picture three.js draws depends on the same five things, and a rendering bug lives in one of them. **Triage** is sorting a bug into its bucket before you change anything. Each bucket has a **first check**: a line or two that proves the bug is there or rules it out.

| Bucket | Typical symptoms |
| --- | --- |
| Transform: where it is, its turn, its size | In the wrong place, far too big or small, mirrored |
| Geometry: corners, triangles, normals, UVs | Holes, inside out, spikes, blotchy shading |
| Material, lights included | Black, washed out, too shiny, see-through |
| Camera: where it looks, near and far | Nothing at all, or objects sliced open |
| Pipeline: render targets, extra passes, output color | Wrong everywhere at once, black after post-processing |

**Analogy: a car that won't start.** A mechanic doesn't open the engine first: do the dashboard lights come on, and is there fuel? Each question takes seconds and rules a whole system in or out.

### One symptom, five causes

The renderer clears the canvas to black before every frame, so anything that keeps an object off the screen leaves a black screen, whatever the cause.

Each bug below gives the same black screen with a clean console. Pick one, then run the first check for its bucket.

<div data-scene="blackScreen"></div>

### Black doesn't mean the shader

Only one of those five is about the material, and none is a broken shader. A shader that fails to compile prints `THREE.WebGLProgram: Shader Error` in the console, and only that material stops drawing. A black screen with a clean console is almost never a shader.

## B · Working knowledge

### The first check for each bucket

Write the symptom down in one line first: "black screen", "one part missing", "wrong color". Two checks only print numbers:

```js
// Transform: where is it, and how big?
console.log(part.getWorldPosition(new Vector3()), new Box3().setFromObject(part).getSize(new Vector3()));
// Camera: is it between near and far?
console.log(camera.near, camera.far, camera.position.distanceTo(part.getWorldPosition(new Vector3())));
```

The other three change one thing, which you undo afterwards:

```js
part.material.side = DoubleSide;                            // geometry: does it show from both sides?
part.material = new MeshBasicMaterial({ color: 'orange' }); // material: does it show without lights?
renderer.render(scene, camera);                             // pipeline: in place of composer.render()
```

If the numbers are off, or the picture comes back, the bug is in that bucket; if not, that bucket is ruled out.

### A part is missing

Start with transform, the cheapest check. A model exported in millimeters is a thousand times too big, so the camera sits inside it; one scaled down twice is a speck. If the part is there and a sensible size, move on to the camera, the geometry, and the material. The nothing-renders checklist runs the whole list.

### A color is wrong

Give the part a `MeshBasicMaterial` in the color it's meant to have. That material ignores lights, so if the part now matches the swatch, the material or its lighting changed it. If it still doesn't match, something after the material did, like the output color space or tone mapping: the pipeline.

Pick a bug, run the check, and watch whether the pixel in the middle matches the swatch.

<div data-scene="wrongColor"></div>

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
