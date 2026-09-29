---
id: 1.camera.frustum.read-the-code.1
loop: 1
tier: light
concepts: [camera.frustum]
mode: read-the-code
context: camera.frustum/culling
lenses: []
misconceptions:
  - camera.frustum/tests-triangles
---

# Frustum

> **In short:** The frustum is the region a camera can see, a pyramid with its tip cut off, and three.js skips drawing any object whose bounding sphere lies completely outside it.
>
> **Used for:** Keeping big scenes fast by skipping what nobody can see; pausing animations and labels for things out of view; aiming a sun's shadow so it covers what matters; and deciding what to load first.

## A · The basics

### The shape of what a camera sees

The projection matrix page described the space a camera can see as a pyramid lying on its side, with its tip at the camera and cut off at `near`. That shape is the **frustum**. It's bounded by six flat planes: left, right, top, bottom, near, and far. three.js builds them from the projection matrix and the view matrix together.

**Analogy: looking through a window.** From your seat, you see only what's inside the window frame. Things off to the side, above, or below are hidden by the wall, however close they are. The frustum is the window's view, with a near and a far limit added.

### Culling: skipping what's outside

Every frame, before drawing, three.js checks each mesh against the frustum and skips any that lie completely outside it. That's **frustum culling**, and it's on for every object unless you set `frustumCulled = false`.

It doesn't check triangles. It checks each object's **bounding sphere**, the smallest ball around its shape (the bounding box and sphere page covers it). If any part of the ball touches the frustum, the whole object is drawn, every triangle of it.

Turn the camera. Boxes whose bounding spheres touch its frustum turn blue: three.js would draw them. The rest turn gray: skipped. The orange plank floats above the view, and the picture in the corner never shows it, but its bounding sphere pokes into the frustum, so it's drawn every frame anyway.

<div data-scene="culling"></div>

## B · Working knowledge

### Checking visibility yourself

The same test is available to your code, to pause animations or skip label updates for things out of view:

```js
const viewProjection = new Matrix4()
  .multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
const frustum = new Frustum().setFromProjectionMatrix(viewProjection);
if (frustum.intersectsObject(mesh)) { /* at least its bounding sphere is in view */ }
```

- `frustum.containsPoint(point)` tests a single spot; `intersectsBox` and `intersectsSphere` test a `Box3` or `Sphere`.
- `intersectsObject` needs an object with a shape, like a mesh. For a group, test a box around it: `frustum.intersectsBox(new Box3().setFromObject(group))`.
- It reads each object's saved `matrixWorld`, so refresh first if something just moved, as on the update timing page.
- In view isn't visible. An object behind a wall is still inside the frustum; seeing past the wall takes a raycast, covered in the spatial queries domain.

### What culling costs and saves

- Checking a sphere against six planes costs a little CPU time per object, every frame.
- Every object it skips saves a draw call: CPU time to issue it, and GPU time to run it.
- An object partly in view is drawn whole. The GPU runs the vertex shader for every one of its vertices, then throws away the triangles outside the view. A whole city modeled as one mesh is never culled; split into blocks, the blocks out of view are skipped.

### When an object vanishes while in view

three.js computes an object's bounding sphere once, the first time it needs it, and keeps it. If you move the vertices of a shape yourself, the stored sphere stays where the shape used to be, and the object can be culled while it's in plain view. After changing the positions, call `geometry.computeBoundingSphere()`, or set `mesh.frustumCulled = false` for something that changes shape every frame. `needsUpdate = true` sends the new positions to the GPU but doesn't touch the sphere.

### Fitting a shadow camera

A directional light casts its shadows from an orthographic camera, `light.shadow.camera`, whose box starts 10 units wide. Only things inside that box cast shadows. Fit the box around what should cast them, and show it while you tune it:

```js
light.shadow.camera.left = -8; // and right, top, bottom
light.shadow.camera.updateProjectionMatrix();
scene.add(new CameraHelper(light.shadow.camera));
```

A tighter box spreads the shadow's pixels over a smaller area, so shadows come out sharper; the shadows page covers the rest.

### Which space is it in?

This page works between **the world** and **NDC**: the frustum is the part of the world that lands inside −1 to 1 in NDC.

| Value | Space |
| --- | --- |
| `viewProjection`, the projection matrix times the view matrix | Converts from the world, to clip space, in one step |
| `frustum.planes` | The world |
| `mesh.geometry.boundingSphere` | Measured from the mesh itself |
| The sphere `intersectsObject` tests | The world: the bounding sphere moved by the mesh's saved `matrixWorld` |
| A shadow camera's `left`, `right`, `top`, `bottom` | World units, measured from the shadow camera's center |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
