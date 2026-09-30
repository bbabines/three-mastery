---
id: 1.scene-graph.scene-stats.read-the-code.1
loop: 1
tier: light
concepts: [scene-graph.scene-stats]
mode: read-the-code
context: scene-graph.scene-stats/asset-audit
lenses: []
misconceptions:
  - scene-graph.scene-stats/shared-material-one-call
---

# Scene statistics

> **In short:** Numbers you get by walking a scene, like how many meshes and triangles it has, that say what it costs to draw.
>
> **Used for:** Checking a model before it ships, proving an optimization helped, comparing two versions, and debug panels.

## A · The basics

### What to count

Walking a model tells you what it will cost. Count the meshes: each one the camera sees costs at least one **draw call**, one request from the CPU to the GPU to draw a geometry with a material, every frame. Count the triangles, the shape the GPU works through on every draw. And count the unique geometries, materials, and textures, which are what fill GPU memory.

"Unique" means counted once, however many meshes share it. Every geometry, material, and texture gets a `uuid`, an ID made when it's created, so a `Set` of uuids counts each one once.

**Analogy: a stack of flyers.** A hundred flyers printed from one design are still a hundred flyers to hand out, one at a time. The design was only stored once.

### Sharing a material doesn't share the draw

Sharing a geometry and a material saves memory, since the GPU holds them once. It doesn't save draw calls: three.js still draws every mesh on its own.

Try both models, then add bolts that share the rack's own bolt geometry and material. Watch the draw calls the renderer reports.

<div data-scene="audit"></div>

## B · Working knowledge

### Counting triangles

```js
const { index, attributes } = mesh.geometry;
triangles += (index ? index.count : attributes.position.count) / 3;
```

An indexed geometry reuses corners, so its triangle count comes from the index, as on the indexed vs non-indexed page. Dividing the vertex count by 3 comes out too low.

### Counting each material and texture once

```js
for (const material of [mesh.material].flat()) {
  materials.add(material.uuid);
  for (const value of Object.values(material)) if (value?.isTexture) textures.add(value.uuid);
}
```

`[mesh.material].flat()` also handles a mesh with an array of materials. Geometries work the same way, with `geometries.add(mesh.geometry.uuid)`.

### What the renderer reports

```js
renderer.info.render.calls;      // draw calls in the last render
renderer.info.render.triangles;  // triangles drawn in the last render
renderer.info.memory.geometries; // geometries held on the GPU right now
renderer.info.memory.textures;   // textures held on the GPU right now
```

These count what the last `render()` really drew. Meshes outside the camera's view aren't drawn, so they don't count, but helpers, labels, and the floor grid do.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
