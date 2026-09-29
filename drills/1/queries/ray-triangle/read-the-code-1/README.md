---
id: 1.queries.ray-triangle.read-the-code.1
loop: 1
tier: core
concepts: [queries.ray-triangle]
mode: read-the-code
context: queries.ray-triangle/uv-at-hit
lenses: []
misconceptions:
  - queries.ray-triangle/barycentric-hit-only
---

# Ray–triangle

> **In short:** Every mesh raycast ends with one test per triangle, `ray.intersectTriangle`, which finds the exact spot on the surface; three.js then says how much of each corner that spot is made of, and uses those three weights to blend the UV, the normal, and anything else stored at the corners.
>
> **Used for:** Picking exactly the part of a model the user clicked, painting on a texture at the brush's spot, reading the terrain color or height under a character's feet, and deciding whether a click on the back of a one-sided surface counts.

## A · The basics

### The exact test

Bounding spheres and boxes only say "maybe". The final answer comes from the triangles themselves: `ray.intersectTriangle(a, b, c, backfaceCulling, spot)` takes a triangle's three corners and returns where the ray crosses it, or `null`. `raycaster.intersectObject(mesh)` runs it on every triangle of the mesh, and each triangle it crosses becomes a hit.

The fourth argument, `backfaceCulling`, says whether to skip a triangle whose back faces the ray. The front is the side from which the corners run counter-clockwise, as on the winding order page.

### How much of each corner

A spot on a triangle can be described by how close it is to each corner: three weights that add up to 1. At corner `a` they're (1, 0, 0). In the middle they're about a third each. These are **barycentric coordinates**, and a hit carries them as `hit.barycoord`.

They matter after the hit, too. Everything stored at the corners, like UVs, normals, and vertex colors, is blended at the spot with those same weights. That's where `hit.uv` and `hit.normal` come from.

**Analogy: mixing paint from three pots.** Put a pot of red, green, and blue paint at the three corners. Any spot on the triangle is a mix: close to the red pot it's mostly red, in the middle it's an even mix. The weights are the recipe, and the same recipe mixes any other ingredient kept at the corners.

Aim the ray around the triangle. Its corners are pure red, green, and blue, and the ball at the hit takes the blend `hit.barycoord` gives.

<div data-scene="paintPots"></div>

<details>
<summary>The math, if you're curious</summary>

With weights u, v, and w for corners a, b, and c, where u + v + w = 1, the spot is u·a + v·b + w·c, and any value stored at the corners is blended the same way. The classic ray–triangle test is **Möller–Trumbore**. three.js r186 uses a **watertight** method instead, so a ray through the edge two triangles share can't slip between them; it reports both.

</details>

## B · Working knowledge

### Blending any vertex value at the hit

`hit.uv` and `hit.normal` are done for you. For any other attribute, like a color or a custom value, blend it with the same weights:

```js
const { a, b, c } = hit.face; // the triangle's vertex numbers
const color = Triangle.getInterpolatedAttribute(mesh.geometry.attributes.color, a, b, c, hit.barycoord, new Vector3());
```

That's how you read the paint under a brush, the ground type under a character's feet, or a value a scan stored at each vertex.

### Back faces

For a mesh, the material's `side` sets the culling flag: `FrontSide`, the default, skips back faces; `DoubleSide` tests both; `BackSide` tests only backs. A one-sided panel seen from behind can't be clicked, which is right for a closed model and a surprise for a flat sign. Try each side from both directions:

<div data-scene="backFaces"></div>

`hit.face.normal` still points out of the front when a `DoubleSide` mesh is hit from behind, as on the intersection anatomy page.

### Testing a triangle yourself

Mostly you let the raycaster do this. When you hold triangles of your own, like a walkable area or a few picked faces, test them directly. The corners and the ray must be in the same space:

```js
const tri = new Triangle().setFromAttributeAndIndices(geometry.attributes.position, a, b, c); // measured from the mesh
const localRay = raycaster.ray.clone().applyMatrix4(mesh.matrixWorld.clone().invert());     // the ray, measured from the mesh
const spot = localRay.intersectTriangle(tri.a, tri.b, tri.c, false, new Vector3());
if (spot) mesh.localToWorld(spot);                                                           // back into the world
```

That's what the raycaster does for each mesh, using the inverse from the inverse matrices page. `intersectTriangle` returns only the spot; `tri.getBarycoord(spot, new Vector3())` gives the weights.

### What it costs

After the bounding-sphere check, a mesh raycast tests every triangle: a detailed scan of a million triangles is a million tests per raycast, all CPU time, before the call returns. The BVH page covers skipping most of them.

### Which space is it in?

| Value | Space |
| --- | --- |
| Corners read from `geometry.attributes.position` | Measured from the mesh itself |
| `raycaster.ray` | The world |
| `raycaster.ray.clone().applyMatrix4(mesh.matrixWorld.clone().invert())` | Measured from the mesh itself |
| `hit.point` | The world, turned back by three.js |
| `hit.barycoord` | No space: three weights for corners a, b, and c |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
