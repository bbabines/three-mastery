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

> **In short:** A raycast gives back a list of hits, nearest first, and each hit tells you how far away it is, where it is in the world, and which object, triangle, texture spot, and copy it landed on.
>
> **Used for:** Setting a sticker or bullet hole flat against the surface that was clicked, painting onto a model's texture where the brush touches it, picking one shelf out of hundreds drawn as copies, and measuring the distance to whatever a sensor points at.

## A · The basics

### A list, nearest first

`raycaster.intersectObjects(list)` returns an array. Each entry is a **hit** (three.js's docs call it an intersection): one place where the ray crossed one triangle of one object. The array is sorted by distance, so `hits[0]` is the nearest. A ray that misses everything gives an empty array.

A ray can cross several objects, and several triangles of one object, so there are often several hits. A ray exactly along the edge between two triangles gets one hit from each, at the same distance.

**Analogy: an arrow through a row of paper targets.** It punches a hole in every target it passes through, and you can list the holes from nearest to farthest. Each hole says which target, how far along, and exactly where on the target's printed face.

### What one hit holds

| Field | What it is |
| --- | --- |
| `hit.distance` | How far along the ray, in world units |
| `hit.point` | Where the ray met the surface, in the world |
| `hit.object` | The mesh that was hit |
| `hit.face` | The triangle: its three vertex numbers `a`, `b`, `c`, and its face `normal` |
| `hit.faceIndex` | Which triangle of the mesh, counting from 0 |
| `hit.uv` | The spot on the texture, 0 to 1 across and up |
| `hit.normal` | The smoothed normal at the spot |
| `hit.instanceId` | Which copy, for an `InstancedMesh` |

Aim the scanner and turn the crate. Each hit paints a dot on the crate's texture at `hit.uv`, and the green arrow is the face normal turned into the world.

<div data-scene="readTheHit"></div>

### The nearest hit isn't always what you see

Raycasting tests triangles, not pixels. It doesn't know what's drawn: an object with `visible = false`, a pane of glass you can see through, and a helper line all count. So `hits[0]` is the nearest thing in the list, not the first thing you'd see. The filtering page covers keeping those out.

Hide the front box. The list of hits doesn't change, and `hits[0]` is still the box you can't see.

<div data-scene="notWhatYouSee"></div>

## B · Working knowledge

### Orienting a marker

`hit.point` is in the world. `hit.face.normal` isn't: it's measured from the hit object itself, because three.js moves the ray into each object's own space to test its triangles. Turn the normal into the world first, with a world normal matrix, as on the face normals page:

```js
const hit = hits[0];
const toWorld = new Matrix3().getNormalMatrix(hit.object.matrixWorld);
const n = hit.face.normal.clone().applyNormalMatrix(toWorld); // in the world, length 1
sticker.position.copy(hit.point);
sticker.lookAt(hit.point.clone().add(n));                   // faces out of the surface
```

On an object that isn't turned, the two happen to match, which is how this bug hides until something turns.

### `hit.face.normal` or `hit.normal`

- `hit.face.normal` is the triangle's own facing direction: length 1, and always out of its front, even when a `DoubleSide` mesh is hit from behind.
- `hit.normal` blends the vertex normals at the spot, so on a curved surface it follows the curve. It isn't quite length 1 between vertices, so normalize it, and it's flipped to face the ray.

Both are measured from the object itself.

### Painting at a UV

`hit.uv` says where on the texture the ray landed: 0 to 1 across, and 0 to 1 up. A canvas measures y down from its top, so flip it:

```js
const { x, y } = hit.uv;
ctx.fillRect(x * canvas.width, (1 - y) * canvas.height, 8, 8);
texture.needsUpdate = true; // send the redrawn canvas to the GPU
```

The mesh needs UVs, as on the UVs page; without a `uv` attribute there's no `hit.uv`.

### Picking an instance

An `InstancedMesh` draws many copies as one object, as on the InstancedMesh page, so `hit.object` is the whole set. `hit.instanceId` says which copy:

```js
const hit = raycaster.intersectObject(shelves)[0];
shelves.setColorAt(hit.instanceId, highlight);
shelves.instanceColor.needsUpdate = true;
```

### `hit.object` is a mesh, not a product

A loaded model is a tree of groups and meshes, and the ray hits one small mesh deep inside it: a screw, not the rack. Walking up from `hit.object` to the part you care about is on the filtering page.

### Which space is it in?

| Value | Space |
| --- | --- |
| `hit.point` | The world |
| `hit.distance` | World units along the ray, from its start |
| `hit.face.normal`, `hit.normal` | Measured from the hit object itself |
| `hit.face.normal.clone().applyNormalMatrix(new Matrix3().getNormalMatrix(hit.object.matrixWorld))` | The world |
| `hit.uv` | The texture: 0 to 1 across and up |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
