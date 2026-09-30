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

> **In short:** Skip whole objects that are out of view and draw far ones simpler, so the work matches what can be seen.
>
> **Used for:** Whole warehouses, machines of hundreds of parts, forests drawn with instancing, and overviews of many products.

## A · The basics

### Culling skips whole objects

Before drawing, three.js tests each object's bounding sphere against the camera's view and skips the object if the sphere is completely outside. That's **frustum culling**, and it works on whole objects, never on triangles: an object with one corner in view is drawn whole. So a whole aisle merged into one mesh is one draw call, but it's never skipped.

### Simpler versions far away

Far away, a rack covers a few pixels and its detail can't show. A `LOD` (level of detail) object holds several versions of a model and shows one, picked every frame by its distance from the camera:

```js
const lod = new LOD();
lod.addLevel(detailedRack, 0); // from 0 units away
lod.addLevel(simpleRack, 8);   // from 8 units away
scene.add(lod);
```

**Analogy: a map app.** It only draws the part of the world on your screen, which is culling. Zoomed out, it shows highways and hides street names, which is LOD.

Walk down the aisle and turn, with each version of the code, and watch how many racks are drawn and which versions show.

<div data-scene="aisle"></div>

## B · Working knowledge

### Helping culling

Merge within an aisle or a room, not across the whole scene, so what's out of view can be skipped. An InstancedMesh is culled as one object, by one sphere around all its copies, so refresh that sphere after moving copies, or a stale one can hide them all:

```js
trees.setMatrixAt(7, farEastMatrix);
trees.instanceMatrix.needsUpdate = true;
trees.computeBoundingSphere();
```

`mesh.frustumCulled = false` draws an object every frame, whatever its bounds.

### Choosing LOD distances

```js
lod.addLevel(simpleRack, 8, 0.1); // back to detailed only below 8 − 10%, at 7.2
```

The third number is **hysteresis**: once the far version shows, it switches back only when the camera is that fraction closer. Without it, a camera hovering at the switching distance swaps versions back and forth, with a visible pop each time. Every version is a full model in memory.

### Which space is it in?

| Value | Space |
| --- | --- |
| `geometry.boundingSphere` | Measured from the object itself |
| The sphere culling tests | The world, moved there by `matrixWorld` |
| The distances in `addLevel` | World units, from the camera to the LOD |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
