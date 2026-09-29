---
id: 1.geometry.bounding-volumes.read-the-code.1
loop: 1
tier: light
concepts: [geometry.bounding-volumes]
mode: read-the-code
context: geometry.bounding-volumes/raycast-early-out
lenses: []
misconceptions:
  - geometry.bounding-volumes/world-space
---

# Bounding box and sphere

> **In short:** A geometry's bounding box and bounding sphere are the smallest box and ball that fit around its vertices, measured from the object itself, and three.js uses them to skip work in a hurry.
>
> **Used for:** Not drawing things outside the camera's view; skipping raycast tests against objects a ray can't touch; framing the camera around a model; and quick overlap checks, like whether a dragged crate bumps into a shelf.

## A · The basics

### The smallest box and ball around a shape

Checking every triangle of a mesh is slow. Checking one box or one ball first is fast, and if the ray, or the camera's view, misses the box, it misses everything inside it. So every geometry can store two simple shapes that fit around all its vertices:

- `geometry.boundingBox`: a `Box3`, stored as its `min` and `max` corners, with its sides lined up with the X, Y, and Z axes.
- `geometry.boundingSphere`: a `Sphere`, a `center` and a `radius`.

```js
geometry.computeBoundingBox();
geometry.computeBoundingSphere();
```

Both are `null` until something computes them. three.js computes them itself the first time it needs them, for culling or raycasting.

### Measured from the object itself

The bounds are worked out from the vertex positions, so, like the positions, they're measured from the object itself (the BufferAttribute and itemSize page). Move, turn, or grow the mesh and its geometry's bounds stay exactly where they were: the same numbers, around the spot the shape would be if the mesh sat at the center of the scene, unturned.

**Analogy: the size printed on a shipping box.** "60 × 40 × 30 cm" tells you how big the box is, and it's the same in the warehouse or on a truck. It doesn't tell you where the box is. For that you need the truck's position too.

Move and turn the nut, then switch between the three boxes.

<div data-scene="worldBox"></div>

## B · Working knowledge

### Reading them

```js
geometry.computeBoundingBox();
const size = geometry.boundingBox.getSize(new Vector3()); // width, height, depth
const middle = geometry.boundingBox.getCenter(new Vector3()); // measured from the object itself
```

### Getting a box in the world

```js
mesh.updateMatrixWorld(); // if it just moved, as the update timing page shows
const worldBox = mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld);
const box = new Box3().setFromObject(mesh); // the mesh and everything under it, in the world
```

A `Box3` always stays lined up with the axes, so the box around a turned mesh is a level box around the turned shape: bigger than it needs to be. `setFromObject(mesh, true)` works from every vertex instead, which fits tighter and costs more. The world-space bounds page, in the scene graph domain, goes further, and the fit to bounds page, in the camera domain, uses the result to frame a camera.

### When they go stale

- `geometry.translate`, `rotateX`, `scale`, `applyMatrix4`, and `center` move the vertices and recompute any bounds already stored.
- **Editing the attribute directly doesn't.** After `position.setXYZ(...)`, the bounds still fit the old shape. Culling can then skip the mesh while its new part is on screen, and raycasts can miss it. Call `computeBoundingBox()` and `computeBoundingSphere()` after the edit. The updating buffers page covers edits.
- An `InstancedMesh` keeps bounds of its own, around all its copies; the InstancedMesh page covers them.

### What reads them

- **Culling:** before drawing, three.js tests each object's bounding sphere, moved into the world, against the camera's view (the frustum page, in the camera domain). Outside means not drawn.
- **Raycasting:** a raycast tests the sphere first, then the box if one has been computed, and only then the triangles. Most objects in a big scene are ruled out in the first step.

### Which space is it in?

| Value | Space |
| --- | --- |
| `geometry.boundingBox`, `geometry.boundingSphere` | Measured from the object itself |
| `geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld)` | The world |
| `new Box3().setFromObject(mesh)` | The world |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
