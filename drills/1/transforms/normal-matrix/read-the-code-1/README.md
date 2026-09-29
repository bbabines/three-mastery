---
id: 1.transforms.normal-matrix.read-the-code.1
loop: 1
tier: core
concepts: [transforms.normal-matrix]
mode: read-the-code
context: transforms.normal-matrix/squashed-lighting
lenses: []
misconceptions:
  - transforms.normal-matrix/normals-like-directions
---

# Normal matrix

> **In short:** When an object is stretched more one way than another, the directions its surface faces can't be turned like other directions, so three.js builds a separate matrix for them, the normal matrix, that keeps them pointing straight out.
>
> **Used for:** Lighting stretched or squashed models, setting a decal or bullet hole flat against the surface that was clicked or hit, bouncing a ball off a surface in a game, and rim glows in custom shaders.

## A · The basics

### A normal is the way a surface faces

A **normal** is a direction with length 1 that points straight out of a surface, at right angles to it. Most meshes store one for every vertex, in the geometry's `normal` attribute, measured from the object itself. Lighting depends on it: the dot product page showed that a surface is brightest where its normal points at the light.

### Stretching tilts normals the wrong way

The points vs directions page turns a direction with an object using `transformDirection`, and that's right for most directions. Normals are the exception. When an object is stretched more in one direction than another, called **non-uniform scale**, like `scale.set(2, 1, 1)`, turning its normals like any other direction leaves them tilted. They lean over and no longer point straight out of the surface, so the lighting comes out wrong.

**Analogy: a longer ramp.** Make a ramp twice as long but just as high, and it gets gentler: its surface faces more toward the sky. Now picture a signpost stuck straight out of the ramp. Stretch the post along with the ramp and it leans the other way, down toward the ramp's surface. A normal needs to follow the surface, not the stretch.

Stretch the ball. The red lines are its normals turned with `transformDirection`. The green lines are turned with the normal matrix, `new Matrix3().getNormalMatrix(ball.matrixWorld)`, and stay straight out. Then set the stretch back to 1 and grow it evenly: the two agree.

<div data-scene="stretch"></div>

### The normal matrix keeps them straight out

The **normal matrix** is the matrix three.js builds for normals from an object's `matrixWorld`. It turns a normal the same way as the object, but undoes the stretch instead of copying it, so the normal stays at right angles to the surface:

```js
const normalMatrix = new Matrix3().getNormalMatrix(ball.matrixWorld);
const n = normal.clone().applyNormalMatrix(normalMatrix); // in the world, straight out
```

It's a `Matrix3`, not a `Matrix4`, because a normal is a direction: it never needs the move part.

<details>
<summary>The math, if you're curious</summary>

The normal matrix is the **inverse transpose** of the part of the object's matrix that holds the turn and the resize, written (M⁻¹)ᵀ. You'll see that name in docs and forums. In plain words, it's the same turn with the opposite stretch: a stretch of 2 along X becomes a squeeze of 2 along X. For a pure turn it's just the turn, which is why treating normals like directions works as long as nothing is stretched.

</details>

### Why the bug hides

Turning an object, or growing it by the same amount on every axis, never tilts a normal. For those, `transformDirection` gives exactly the right answer. Flat faces that line up with the stretch don't tilt either: a box's sides still point straight out after `scale.set(2, 1, 1)`. So code that treats normals like directions can work for months, until someone squashes a curved or sloped model.

## B · Working knowledge

### A normal in the world

```js
const normalMatrix = new Matrix3().getNormalMatrix(mesh.matrixWorld);
const worldNormal = normal.clone().applyNormalMatrix(normalMatrix);
```

- `applyNormalMatrix` applies the matrix and then normalizes, so the result has length 1. `applyMatrix3(normalMatrix)` on its own can leave a length other than 1; call `.normalize()` after it.
- It changes the vector you call it on, like `transformDirection`, so clone first.
- Building the matrix takes an inverse, so build it once per object and reuse it for all of that object's normals.

### Which way does a clicked face point?

A raycast's `hit.face.normal` is measured from the object itself: a plane's front says (0, 0, 1) whichever way the plane is turned. To set a decal flat on the spot, bounce something off it, or aim a marker out of it, turn the normal into the world first:

```js
const hit = raycaster.intersectObject(mesh)[0];
const normalMatrix = new Matrix3().getNormalMatrix(hit.object.matrixWorld);
const n = hit.face.normal.clone().applyNormalMatrix(normalMatrix);
decal.position.copy(hit.point); // hit.point is already in the world
decal.lookAt(hit.point.clone().add(n));
```

### mesh.normalMatrix is for camera space

Every mesh has a `normalMatrix` property, and it isn't the one for world normals. three.js fills it in while it renders, from the object and the camera together, so it turns normals into **camera space**: measured from the camera. It does nothing until the first render, and it changes whenever the camera moves. For the world, build your own with `getNormalMatrix(mesh.matrixWorld)`.

### Lighting and rim effects in a shader

In a `ShaderMaterial`'s vertex shader, three.js provides `normalMatrix` ready-made, the same camera-space one as `mesh.normalMatrix`. Use it for normals and `modelViewMatrix` for positions:

```glsl
vNormal = normalize(normalMatrix * normal);          // stays straight out
vNormal = normalize(mat3(modelViewMatrix) * normal); // tilts when stretched unevenly
```

Both put the normal in camera space, so whatever you compare it with, like the direction to a light, has to be in camera space too. Writing shaders is its own domain; the point here is which matrix goes with normals.

Switch between the two lines, then change the height. At a height of 0.4, the top is nearly flat, so it should be evenly lit. With the wrong line it's still shaded like a ball. At 1.5, the shape is a plain ball again, and both lines give the same picture.

<div data-scene="light"></div>

A rim glow, which lights up where a surface turns side-on to the camera, has the same problem. On a stretched part, the tilted normals turn side-on in the wrong places, so the glow lands in the wrong spots.

### Which space is it in?

| Value | Space |
| --- | --- |
| `geometry.attributes.normal`, and `normal` in a shader | Measured from the object itself |
| `hit.face.normal` from a raycast | Measured from the object itself |
| `hit.point` from a raycast | The world |
| `normal.clone().applyNormalMatrix(new Matrix3().getNormalMatrix(mesh.matrixWorld))` | The world |
| A normal turned by `mesh.normalMatrix`, or by `normalMatrix` in a shader | Camera space: measured from the camera |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
