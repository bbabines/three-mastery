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

> **In short:** Scene statistics are counts you gather by walking a scene: how many meshes and triangles, and how many different geometries, materials, and textures, each counted once however many meshes share it.
>
> **Used for:** Checking an artist's model before it ships; proving an optimization helped, with numbers from before and after; picking the cheaper of two versions of a product; and a debug panel that shows what a page is drawing.

## A · The basics

### What to count, and what each count tells you

| Count | What it tells you |
| --- | --- |
| Meshes | Each one the camera draws costs at least one **draw call**: one request from the CPU to the GPU to draw one thing. CPU work every frame. |
| Triangles | How much shape the GPU processes on every draw |
| Unique geometries | The vertex data held in GPU memory (the runtime memory math page) |
| Unique materials | How many different surface setups the GPU switches between |
| Unique textures | Often the biggest share of GPU memory |

"Unique" means counted once, however many meshes share it. Every geometry, material, and texture gets a `uuid`, an ID made when it's created, so a `Set` of uuids counts each one once.

**Analogy: a stack of flyers.** A hundred flyers printed from one design are still a hundred flyers to hand out, one at a time. The design was only stored once. Meshes are the flyers; a shared geometry and material are the design.

### Sharing a material doesn't share the draw

Sharing a geometry and a material saves memory: the GPU holds them once. It doesn't save draw calls: three.js still draws every mesh on its own. Add bolts that all share the rack's own bolt geometry and material, and compare the counts with the draw calls the renderer reports.

<div data-scene="audit"></div>

## B · Working knowledge

### The counting code

```js
let meshes = 0;
let triangles = 0;
const geometries = new Set();
const materials = new Set();
const textures = new Set();
model.traverse((object) => {
  if (!object.isMesh) return;
  meshes += 1;
  const { index, attributes } = object.geometry;
  triangles += (index ? index.count : attributes.position.count) / 3;
  geometries.add(object.geometry.uuid);
  for (const material of [object.material].flat()) {
    materials.add(material.uuid);
    for (const value of Object.values(material)) if (value?.isTexture) textures.add(value.uuid);
  }
});
```

- An indexed geometry reuses corners, so its triangle count comes from the index, as on the indexed vs non-indexed page. Dividing the vertex count by 3 comes out too low: about half, on the rack.
- `[object.material].flat()` also handles an array of materials (the groups and multi-material page). An `InstancedMesh` is one draw call for all its copies, so multiply its triangles by `count` (the InstancedMesh page).

### What the renderer reports

```js
renderer.info.render.calls;       // draw calls in the last render
renderer.info.render.triangles;   // triangles drawn in the last render
renderer.info.memory.geometries;  // geometries held on the GPU right now
renderer.info.memory.textures;    // textures held on the GPU right now
```

- They count what the last `render()` really drew, reset at the start of each one. Meshes outside the camera's view aren't drawn (the frustum page), so they don't count; helpers, labels, and the floor grid do. The scene above hides the grid and axes so the numbers match the model.
- A transparent material with `side: DoubleSide` is drawn twice, back faces then front faces: two draw calls for one Mesh, unless you set `forceSinglePass = true`.
- Cutting draw calls, by merging meshes or instancing, belongs to the optimization domain.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
