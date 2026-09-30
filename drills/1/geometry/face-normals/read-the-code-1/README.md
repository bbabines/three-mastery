---
id: 1.geometry.face-normals.read-the-code.1
loop: 1
tier: core
concepts: [geometry.face-normals]
mode: read-the-code
context: geometry.face-normals/raycast-normal
lenses: []
misconceptions:
  - geometry.face-normals/average-of-vertex
---

# Face normals

> **In short:** A triangle is flat, so it points one way, straight out of its front, and three.js works that out from its three corners.
>
> **Used for:** Placing decals, the faceted low-poly look, checking what a surface faces, and snapping parts flush.

## A · The basics

### One direction per triangle

A **normal** is a direction of length 1 pointing straight out of a surface. A triangle is flat, so it has exactly one, its **face normal**, pointing out of the side its corner order makes the front. three.js works it out from the three corners:

```js
const n = Triangle.getNormal(a, b, c, new Vector3()); // a, b, c: the corners, in order
```

It depends only on where the corners are and the order they're listed in: list them as `(a, c, b)` and the normal points the other way. The corners come from the geometry, so the normal is measured from the object itself.

**Analogy: a thumbtack in a tilted board.** The pin points straight out of the board. Paint arrows on the board pointing anywhere you like; only the board's tilt sets which way the pin points.

### It isn't the vertex normals' average

A mesh also stores a normal at every vertex, in its `normal` attribute: the painted arrows. Lighting reads those, and they can point anywhere, since smoothing, hand edits, and bad exports all lean them. The face normal never reads them.

Bend the vertex normals. The lighting and their orange average lean with them, while the green face normal stays put. Then switch to `flatShading: true`, and the bending stops mattering.

<div data-scene="faceVsVertex"></div>

<details>
<summary>The math, if you're curious</summary>

`Triangle.getNormal` takes the **cross product** of two of the triangle's edges and normalizes it. The cross product's direction depends on the order of its inputs, which is why swapping two corners flips the normal.

</details>

## B · Working knowledge

### A face normal from a raycast

```js
const hit = raycaster.intersectObject(mesh)[0];
hit.face.normal; // the hit triangle's face normal
hit.normal;      // the vertex normals, blended at the hit point
```

Both are measured from the object itself. On a `DoubleSide` mesh hit from behind, `hit.face.normal` still points out of the front, while `hit.normal` turns to face the ray.

### Placing a decal in the world

To set a decal flat on the hit, turn the normal into the world first. It's a normal, so it takes the normal matrix:

```js
const normalMatrix = new Matrix3().getNormalMatrix(hit.object.matrixWorld);
const n = hit.face.normal.clone().applyNormalMatrix(normalMatrix); // in the world
decal.position.copy(hit.point); // hit.point is already in the world
decal.lookAt(hit.point.clone().add(n));
```

Not `hit.object.normalMatrix`: three.js fills that in while rendering, from the object and the camera, so it turns normals into camera space. Try all three buttons, and turn the rock.

<div data-scene="decal"></div>

### Facing checks and flat shading

With `n` in the world, the dot product tells you whether the front faces a direction, like a solar panel toward the sun: `n.dot(toSun) > 0`, with `toSun` in the world too. `new MeshStandardMaterial({ flatShading: true })` makes the shader work out each triangle's face normal as it draws and ignore the `normal` attribute, so the model looks faceted.

### Which space is it in?

| Value | Space |
| --- | --- |
| `hit.face.normal` and `hit.normal` | Measured from the object itself |
| `n` after `getNormalMatrix(mesh.matrixWorld)` | The world |
| `n` after `mesh.normalMatrix` | Measured from the camera |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
