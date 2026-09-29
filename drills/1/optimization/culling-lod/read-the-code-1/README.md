---
id: 1.optimization.culling-lod.read-the-code.1
loop: 1
tier: light
concepts: [optimization.culling-lod]
mode: read-the-code
context: optimization.culling-lod/large-scenes
lenses: []
misconceptions:
  - optimization.culling-lod/per-triangle
---

# Culling and LOD

> **In short:** three.js skips any object whose bounding sphere is out of the camera's view, one whole object at a time, and a LOD object swaps in simpler versions of a model as it gets farther away, so the work drawn matches what can be seen.
>
> **Used for:** A warehouse, a factory, or a city too big to draw all at once; a machine of hundreds of parts, most of them out of view at any moment; a forest or a crowd drawn with InstancedMesh; and an overview of many products, each only a few pixels tall.

## A · The basics

### Culling skips whole objects

The frustum page showed frustum culling: before drawing, three.js tests each object's bounding sphere against the camera's view and skips the object if the sphere is completely outside. It works on objects, never on triangles. An object with one corner in view is drawn whole, every vertex of it. So culling can only help when the scene is split into objects that can leave the view on their own. A whole aisle merged into one mesh (the draw call reduction page) is one draw call, but it's never skipped.

### Simpler versions far away

Far away, a rack covers a few pixels, and its detail can't show (the world size per pixel page). A `LOD` object holds several versions of a model and shows one, picked every frame by its distance from the camera:

```js
const lod = new LOD();
lod.addLevel(detailedRack, 0); // from 0 units away
lod.addLevel(simpleRack, 8);   // from 8 units away
lod.addLevel(boxRack, 20);
scene.add(lod);
```

**Analogy: a map app.** It only draws the part of the world on your screen, which is culling. Zoomed out, it shows highways and city names, and street names only once you zoom in, which is LOD.

Walk down the aisle and turn to look around, with each version of the code. The readout counts the racks drawn, the version each one shows, and the draw calls and triangles.

<div data-scene="aisle"></div>

## B · Working knowledge

### Helping culling

- **Split by area.** Merge within an aisle or a room, not across the whole scene, so what's out of view is skipped whole.
- **Keep bounds right.** After moving an InstancedMesh's copies, call `instances.computeBoundingSphere()`: it's culled as one object, by one sphere around all its copies, and a stale sphere can hide every copy while one of them is on screen (the InstancedMesh page). After editing vertices, `geometry.computeBoundingSphere()` (the frustum page).
- `mesh.frustumCulled = false` draws an object every frame whatever its bounds, for things that change shape too often to keep bounds right.
- A `BatchedMesh` culls each copy on its own, through `perObjectFrustumCulled`, which is on by default.
- Culling is about the view only. An object behind a wall is still drawn (the depth buffer and early-z page).

### Choosing LOD distances

```js
lod.addLevel(simpleRack, 8, 0.1); // switches back to detailed only below 8 − 10%, at 7.2
```

- The distance is a straight line in the world, from the camera to the LOD object's own position, divided by `camera.zoom`.
- The third number is **hysteresis**: once a far version shows, it switches back only when the camera is that fraction closer. Without it, a camera hovering at the switching distance swaps versions back and forth, a visible pop each time.
- Switch when the detail you drop would cover less than a pixel or two, which the world size per pixel page works out.
- Every version is a full model in memory. `lod.getCurrentLevel()` says which one is showing.

### Which space is it in?

| Value | Space |
| --- | --- |
| `mesh.geometry.boundingSphere` | Measured from the mesh itself |
| `instances.boundingSphere`, around all the copies | Measured from the InstancedMesh itself |
| The sphere culling tests against the view | The world: the stored sphere moved by `matrixWorld` |
| The distances passed to `addLevel` | World units, from the camera to the LOD object |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
