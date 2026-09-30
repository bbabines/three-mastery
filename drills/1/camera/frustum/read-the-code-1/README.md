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

> **In short:** The pyramid-shaped space a camera sees, which three.js checks object by object, not triangle by triangle, to skip what's outside.
>
> **Used for:** Skipping what nobody can see, pausing things out of view, fitting a sun's shadow, and choosing what to load first.

## A · The basics

### The shape of what a camera sees

The space a camera can see is a pyramid lying on its side, with its tip at the camera and cut off at `near`. That shape is the **frustum**, bounded by six flat planes: left, right, top, bottom, near, and far.

**Analogy: looking through a window.** From your seat, you see only what's inside the window frame. Things off to the side are hidden by the wall, however close they are.

### Culling: skipping what's outside

Every frame, three.js skips any object that lies completely outside the frustum. That's **frustum culling**, and it's on unless you set `frustumCulled = false`. It doesn't check triangles: it checks each object's **bounding sphere**, the smallest ball around its shape. If any part of the ball touches the frustum, every triangle of the object is drawn, so split a big mesh into pieces for culling to skip.

Turn the camera in the scene. Blue boxes touch its frustum and would be drawn; gray ones are skipped. The orange plank never shows in the picture in the corner, but its bounding sphere reaches in, so it's drawn anyway.

<div data-scene="culling"></div>

## B · Working knowledge

### Checking visibility yourself

The same test can pause animations or skip label updates for things out of view:

```js
const frustum = new Frustum().setFromProjectionMatrix(
  new Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
if (frustum.intersectsObject(mesh)) { /* its bounding sphere is in view */ }
```

In view isn't visible: an object behind a wall is still inside the frustum. Seeing past the wall takes a raycast.

### When an object vanishes while in view

three.js computes a shape's bounding sphere once and keeps it. If you move the vertices yourself, the sphere stays where the shape used to be, and the object can be culled in plain view. Call `geometry.computeBoundingSphere()` after the change; `needsUpdate` only sends the new positions to the GPU.

### Fitting a shadow camera

A directional light casts shadows from an orthographic camera, and only things inside its box cast them. Fit the box around what matters, and show it while you tune it:

```js
light.shadow.camera.left = -8; // and right, top, bottom
light.shadow.camera.updateProjectionMatrix();
scene.add(new CameraHelper(light.shadow.camera));
```

### Which space is it in?

This page works between **the world** and **NDC**: the frustum is the part of the world that lands inside −1 to 1.

| Value | Space |
| --- | --- |
| `frustum.planes` | The world |
| `mesh.geometry.boundingSphere` | Measured from the mesh itself |
| The sphere `intersectsObject` tests | The world, moved by the mesh's saved `matrixWorld` |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
