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

> **In short:** Every mesh raycast ends by testing single triangles, and the hit's mix of the three corners blends the UV, normal, and colors there.
>
> **Used for:** Picking exactly what was clicked, painting at a brush's spot, reading the terrain color underfoot, and back-face clicks.

## A · The basics

### The exact test

Bounding spheres and boxes only say "maybe". The final answer comes from the triangles themselves: `ray.intersectTriangle(a, b, c, backfaceCulling, spot)` takes a triangle's three corners and returns where the ray crosses it, or `null`. `raycaster.intersectObject(mesh)` runs it on every triangle of the mesh, and each triangle it crosses becomes a hit.

The fourth argument, `backfaceCulling`, says whether to skip a triangle whose back faces the ray. The front is the side from which the corners run counter-clockwise.

### How much of each corner

A spot on a triangle can be described by how much of each corner it's made of: three weights that add up to 1. At corner `a` they're (1, 0, 0), and in the middle they're about a third each. These are **barycentric coordinates**, and a hit carries them as `hit.barycoord`.

They matter after the hit too. Everything stored at the corners, like UVs, normals, and vertex colors, is blended at the spot with those same weights. That's where `hit.uv` and `hit.normal` come from.

**Analogy: mixing paint from three pots.** Put red, green, and blue paint at the three corners. Any spot on the triangle is a mix of the three, and the same recipe mixes anything else kept at the corners.

Aim the ray around the triangle. The ball at the hit takes the blend `hit.barycoord` gives.

<div data-scene="paintPots"></div>

<details>
<summary>The math, if you're curious</summary>

With weights u, v, and w for corners a, b, and c, adding up to 1, the spot is u·a + v·b + w·c, and any value stored at the corners is blended the same way.

</details>

## B · Working knowledge

### Blending any vertex value at the hit

`hit.uv` and `hit.normal` are blended for you. For any other value stored at the corners, like a vertex color, use the same weights:

```js
const { a, b, c } = hit.face; // the triangle's vertex numbers
const colors = mesh.geometry.attributes.color;
const tint = Triangle.getInterpolatedAttribute(colors, a, b, c, hit.barycoord, new Vector3());
```

That's how you read the paint under a brush or the ground type under a character's feet.

### Back faces

The material's `side` sets the culling flag: `FrontSide`, the default, skips back faces, `DoubleSide` tests both, and `BackSide` tests only backs. A one-sided panel seen from behind can't be clicked. Try each side from both directions:

<div data-scene="backFaces"></div>

### Testing a triangle yourself

When you hold triangles of your own, like a walkable area, test them directly. The corners and the ray must be in the same space:

```js
const tri = new Triangle().setFromAttributeAndIndices(position, a, b, c); // from the mesh
const toMesh = mesh.matrixWorld.clone().invert();
const localRay = raycaster.ray.clone().applyMatrix4(toMesh); // measured from the mesh
const spot = localRay.intersectTriangle(tri.a, tri.b, tri.c, false, new Vector3());
```

`spot` comes back measured from the mesh, and `mesh.localToWorld(spot)` puts it in the world.

### What it costs

A mesh raycast tests every triangle of every mesh whose bounding sphere the ray touches, all CPU time, before the call returns. The BVH page covers skipping most of them.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
