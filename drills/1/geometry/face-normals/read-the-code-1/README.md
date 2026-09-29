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

> **In short:** A triangle's face normal is the direction pointing straight out of its front, and three.js works it out from the triangle's three corners, measured from the object itself.
>
> **Used for:** Setting a decal, sticker, or bullet hole flat on the spot that was clicked or hit; the faceted, flat-shaded low-poly look; checking whether a surface faces something, like a solar panel facing the sun; and snapping one part flush against another.

## A · The basics

### One direction per triangle

The normal matrix page described a **normal** as a direction of length 1 that points straight out of a surface. A triangle is flat, so it has exactly one: its **face normal**, pointing straight out of its front, the side the winding order page calls the front.

three.js works it out for you from the triangle's three corners:

```js
const n = Triangle.getNormal(a, b, c, new Vector3()); // a, b, c: the corners, in order
```

It depends on two things only: where the corners are and the order they're listed in. List them the other way round, `(a, c, b)`, and the front flips, so the normal points the other way. The corners come from the geometry, so the normal is measured from the object itself, like they are.

**Analogy: a thumbtack in a tilted board.** Push a thumbtack into a board and its pin points straight out of the board. Paint arrows on the board pointing anywhere you like: the pin doesn't care. Only the board's tilt sets which way it points.

### It isn't the vertex normals' average

A mesh also stores a normal at every vertex, in its `normal` attribute: the painted arrows in the analogy. Those are what lighting uses, and they can point anywhere. Smoothing leans them toward their neighbors, artists edit them by hand, and exporters get them wrong (the vertex normals page). The face normal never reads them.

Bend the vertex normals, the white arrows at the corners. The lighting changes, because lighting reads them, and their average, in orange, leans with them. The face normal, in green, from `Triangle.getNormal`, stays put. Then switch to `flatShading`: the shader works out each triangle's facing direction itself, and the bending stops mattering.

<div data-scene="faceVsVertex"></div>

<details>
<summary>The math, if you're curious</summary>

`Triangle.getNormal` takes the **cross product** of two of the triangle's edges and normalizes it. The cross product page, in the math domain, covers what that gives: a direction at right angles to both edges, whose sign depends on their order. That's why swapping two corners flips the normal.

</details>

## B · Working knowledge

### A face normal from a raycast

```js
const hit = raycaster.intersectObject(mesh)[0];
hit.face.normal; // the hit triangle's face normal, measured from the object itself
hit.normal;      // the vertex normals blended at the hit point, also measured from the object itself
```

`hit.face.a`, `.b`, and `.c` are the triangle's vertex numbers. Given those, or any three vertex numbers, a `Triangle` gets you the same face normal from the geometry:

```js
const triangle = new Triangle().setFromAttributeAndIndices(geometry.attributes.position, a, b, c);
triangle.getNormal(n);
```

### Turning it into the world

To set a decal flat on the hit, bounce something off it, or compare it with anything else in the scene, turn the normal into the world first. It's a normal, so it takes the normal matrix, from the normal matrix page:

```js
const normalMatrix = new Matrix3().getNormalMatrix(hit.object.matrixWorld);
const n = hit.face.normal.clone().applyNormalMatrix(normalMatrix); // in the world, length 1
decal.position.copy(hit.point); // hit.point is already in the world
decal.lookAt(hit.point.clone().add(n));
```

Not `hit.object.normalMatrix`: three.js fills that in while rendering, from the object and the camera, so it turns normals into camera space. Try all three buttons on the rock.

<div data-scene="decal"></div>

### Does it face something?

With the face normal in the world, the dot product page's test tells you whether the front faces toward a direction: a solar panel toward the sun, a sign toward the viewer, a wall toward a light.

```js
const facesSun = n.dot(toSun) > 0; // both in the world
```

three.js also has it built in for a triangle whose corners are in the world: `triangle.isFrontFacing(lookDirection)` is `true` when the front faces back against the direction you're looking along, such as `camera.getWorldDirection(v)`.

### Flat shading

```js
const rock = new Mesh(rockGeometry, new MeshStandardMaterial({ flatShading: true }));
```

With `flatShading: true`, the shader works out every triangle's face normal on the GPU as it draws and ignores the `normal` attribute, so each triangle is lit evenly and the model looks faceted. The same look without the flag is geometry with no shared vertices, where every triangle's three vertices carry its face normal; the vertex normals page shows how.

### Hits from behind

On a `DoubleSide` mesh hit from behind, `hit.face.normal` still points out of the front, away from the ray. `hit.normal` is turned to face the ray. Use whichever one your code means: "the surface's front" or "the side that was hit."

### Which space is it in?

| Value | Space |
| --- | --- |
| `Triangle.getNormal(a, b, c, n)`, with corners read from the geometry | Measured from the object itself |
| `hit.face.normal` and `hit.normal` | Measured from the object itself |
| `hit.point` | The world |
| `n.applyNormalMatrix(new Matrix3().getNormalMatrix(mesh.matrixWorld))` | The world |
| A normal turned by `mesh.normalMatrix` | Camera space: measured from the camera |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
