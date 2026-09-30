---
id: 1.gpu.draw-call-anatomy.read-the-code.1
loop: 1
tier: core
concepts: [gpu.draw-call-anatomy]
mode: read-the-code
context: gpu.draw-call-anatomy/many-small-parts
lenses: []
misconceptions:
  - gpu.draw-call-anatomy/gpu-expensive
---

# Draw call anatomy

> **In short:** Each draw call costs about the same CPU time to set up and send, so how many there are matters more than how big.
>
> **Used for:** Models made of many small parts, the cost of shadows and material arrays, reading `renderer.info`, and deciding when to merge.

## A · The basics

### What one draw call does

A **draw call** is one request to the GPU: draw this geometry with this material. Every frame, `renderer.render` makes one for each mesh in view. Before each one, three.js switches to the material's shader program, sends the values the shaders read, like the mesh's matrices and the material's color, and binds the textures and vertex buffers. Anything unchanged since the last draw is skipped.

Each of those steps is a WebGL command, which the browser and then the graphics driver check before the GPU draws a single triangle. All of that is CPU time.

**Analogy: tickets at a deli counter.** Every ticket means setting up the slicer, wrapping, and labeling, however little gets sliced. Ten tickets for one slice each take far longer than one ticket for ten slices.

Try each button, and compare what each shape's draw call sends.

<div data-scene="anatomy"></div>

### The count matters more than the size

The GPU's share of a draw call grows with its vertices and pixels. The CPU's share is about the same for every call: a 12-triangle bolt takes about as long to submit as a 10,000-triangle housing. So 5,000 bolts can make a frame slow on the CPU while the GPU mostly waits. The overhead is usually CPU and driver time, not GPU time.

Change the number of parts, then try the material array and shadows.

<div data-scene="count"></div>

## B · Working knowledge

### Counting draw calls

```js
renderer.render(scene, camera);
renderer.info.render.calls;     // draw calls in that render() call
renderer.info.render.triangles; // and the triangles they drew
```

There's one for each visible mesh, line, points, or sprite. A Group draws nothing, and an InstancedMesh is one call for all its copies. Meshes outside the camera's view are skipped, but meshes merely hidden behind something aren't.

### Many small parts

A model from CAD or Blender often arrives as hundreds of meshes, one per bolt and bracket. Sharing one geometry and one material saves memory, not draw calls: 500 bolts are still 500 calls. The draw call reduction page covers merging and instancing.

### Shadows repeat the draw calls

```js
renderer.shadowMap.enabled = true;
sun.castShadow = true;
for (const part of parts) part.castShadow = true;
```

Each shadow-casting light draws every casting mesh in its view again, so 200 casting parts become 400 draw calls. A point light draws its casters six times. Set `castShadow` only where the shadow shows.

### Multi-material meshes

```js
const crate = new Mesh(new BoxGeometry(), [wood, wood, wood, wood, label, wood]);
```

A box has six groups, so that's six draw calls, though it uses only two materials.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
