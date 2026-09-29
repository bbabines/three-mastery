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

> **In short:** Before changing any code, sort the symptom into one of five buckets, transform, geometry, material, camera, or pipeline, with a first check that takes a line or two, because the same symptom can come from any of them.
>
> **Used for:** A blank canvas the first time a new scene runs; a part missing from a loaded model; a product color that doesn't match the brand swatch; and reading a teammate's bug report without guessing.

## A · The basics

### Five buckets

Every picture three.js draws depends on the same five things, and a rendering bug lives in one of them:

| Bucket | What it covers | Typical symptoms |
| --- | --- | --- |
| **Transform** | Where each object is, how it's turned, how big it is | In the wrong place, far too big or too small, mirrored |
| **Geometry** | The shape's own data: its corners, triangles, normals, and UVs | Holes, inside out, spikes, faceted or blotchy shading |
| **Material** | How the surface is colored and lit, lights included | Black, washed out, too shiny, see-through |
| **Camera** | Where the camera looks, and how near and far it sees | Nothing at all, or objects sliced open |
| **Pipeline** | How the frame is put together: render targets, extra passes, the final color output | Wrong everywhere at once, black after post-processing |

**Triage** is sorting a bug into its bucket before you change anything. Each bucket has a **first check**: a line or two that proves the bug is in that bucket or rules it out. The word comes from hospitals, where patients are sorted by what's wrong before anyone is treated.

**Analogy: a car that won't start.** A mechanic doesn't open the engine first. Does the starter turn over? Do the dashboard lights come on? Is there fuel? Each question takes seconds and rules a whole system in or out: electrical, fuel, or engine. Only then do the tools come out.

### One symptom, five causes

The renderer clears the canvas to black before every frame; black is its default clear color. So anything that keeps an object off the screen leaves a black screen, whatever the cause.

Each button below is a different bug, and all five give the same black screen with a clean console. Pick one, then run the first check for its bucket.

<div data-scene="blackScreen"></div>

### Black doesn't mean the shader

Only one of those five is about the material, and none is a broken shader. A shader that fails to compile doesn't paint the screen black: three.js prints `THREE.WebGLProgram: Shader Error` in the console and that material doesn't draw, so whatever is behind it shows through. The shader errors page, later in this domain, reads that message. A black screen with a clean console is almost never a shader.

## B · Working knowledge

### Write the symptom down first

One line: "black screen", "one part missing", "wrong color", "flickers", "in the wrong place". Then run checks until one of them lands. Changing code before you know the bucket is how a one-line bug turns into a rewritten shader.

### The first check for each bucket

```js
// Transform: is it where I think, and as big as I think?
console.log(part.getWorldPosition(new Vector3()), new Box3().setFromObject(part).getSize(new Vector3()));
// Geometry: does it show from both sides?
part.material.side = DoubleSide;
// Material: does it show with a material that ignores lights?
part.material = new MeshBasicMaterial({ color: 'orange' });
// Camera: is it between near and far?
console.log(camera.near, camera.far, camera.position.distanceTo(part.getWorldPosition(new Vector3())));
// Pipeline: does it show without the extra passes?
renderer.render(scene, camera); // in place of composer.render()
```

Two of them only print numbers. The other three change one thing, which you undo afterwards. If the numbers are off, or the picture comes back, the bug is in that bucket; if not, that bucket is ruled out. The isolation page, later in this domain, has more ways to narrow a bug down.

### A part is missing

Start with transform, because it's the cheapest check: is the part there at all, where is it, and how big is it? A model exported in millimeters is a thousand times too big, so the camera sits inside it; one scaled down twice is a speck. The fit to bounds page frames a model from its `Box3`. If the part is there and a sensible size, move on to the camera, the geometry, and the material. The nothing-renders checklist page, later in this domain, runs the whole list.

### A color is wrong

One check splits the buckets: give the part a `MeshBasicMaterial` with the color it's meant to have. That material ignores lights, so if the part now matches the swatch, the lighting or the material's settings changed it: the material bucket. If it still doesn't match, something after the material changed it, like the output color space or tone mapping: the pipeline bucket. The color spaces and tone mapping pages cover both.

Pick a bug and run the check. The readout reads the pixel at the middle of the canvas and compares it with the brand color, `#f97316`.

<div data-scene="wrongColor"></div>

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
