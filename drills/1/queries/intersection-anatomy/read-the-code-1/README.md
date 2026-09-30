---
id: 1.queries.intersection-anatomy.read-the-code.1
loop: 1
tier: core
concepts: [queries.intersection-anatomy]
mode: read-the-code
context: queries.intersection-anatomy/paint-uv
lenses: []
misconceptions:
  - queries.intersection-anatomy/face-normal-world
  - queries.intersection-anatomy/first-visible
---

# Intersection anatomy

> **In short:** A raycast hands back its hits nearest first, and each one says how far away it is, where it landed, and what it touched.
>
> **Used for:** Setting stickers flat on a surface, painting on a texture, picking one copy out of hundreds, and measuring distances.

## A · The basics

### A list, nearest first

`raycaster.intersectObjects(list)` returns an array of **hits**, one for each place the ray crossed a triangle of an object in the list. It's sorted by distance, so `hits[0]` is the nearest, and a ray that misses everything gives an empty array.

**Analogy: an arrow through a row of paper targets.** It punches a hole in every target it passes, and you can list the holes from nearest to farthest. Each hole says which target, how far along, and where on its printed face.

### What one hit holds

The whole sequence, from the click to the hit:

```js
const rect = renderer.domElement.getBoundingClientRect();
pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
raycaster.setFromCamera(pointer, camera);
const hit = raycaster.intersectObjects(pickable)[0]; // the nearest, or undefined on a miss
hit.distance;   // how far along the ray, in world units
hit.point;      // where the ray met the surface, in the world
hit.object;     // the mesh that was hit
hit.face;       // the triangle: its vertex numbers a, b, c, and its normal
hit.faceIndex;  // which triangle of the mesh, counting from 0
hit.uv;         // the spot on the texture, 0 to 1 across and up
hit.instanceId; // which copy, for an InstancedMesh
```

Aim the scanner and turn the board. Each hit paints a dot at `hit.uv`, and the green arrow is the triangle's normal turned into the world.

<div data-scene="readTheHit"></div>

### The nearest hit isn't always what you see

Raycasting tests triangles, not pixels. A hidden object, a see-through pane, and a helper line all count, so `hits[0]` is the nearest thing in the list, not the first thing you'd see. The filtering page covers keeping those out.

Hide the front box. The hits don't change, and `hits[0]` is still the box you can't see.

<div data-scene="notWhatYouSee"></div>

## B · Working knowledge

### Orienting a marker

`hit.point` is in the world, but `hit.face.normal` is measured from the hit object itself. Turn it into the world before you use it:

```js
const toWorld = new Matrix3().getNormalMatrix(hit.object.matrixWorld);
const n = hit.face.normal.clone().applyNormalMatrix(toWorld); // in the world, length 1
sticker.position.copy(hit.point);
sticker.lookAt(hit.point.clone().add(n)); // faces out of the surface
```

On an object that isn't turned, the two happen to match, which is how this bug hides. `hit.normal`, the smoothed normal at the spot, is measured from the object too, and isn't quite length 1, so normalize it.

### Painting at a UV

`hit.uv` runs 0 to 1 across and up the texture, but a canvas measures y down from its top, so flip it:

```js
const { x, y } = hit.uv;
ctx.fillRect(x * canvas.width, (1 - y) * canvas.height, 8, 8);
texture.needsUpdate = true; // send the redrawn canvas to the GPU
```

### Picking an instance

An `InstancedMesh` draws many copies as one object, so `hit.object` is the whole set, and `hit.instanceId` says which copy:

```js
shelves.setColorAt(hit.instanceId, highlight);
shelves.instanceColor.needsUpdate = true;
```

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
