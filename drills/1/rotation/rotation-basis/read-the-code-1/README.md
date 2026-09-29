---
id: 1.rotation.rotation-basis.read-the-code.1
loop: 1
tier: core
concepts: [rotation.rotation-basis]
mode: read-the-code
context: rotation.rotation-basis/forward-from-matrix
lenses: []
misconceptions:
  - rotation.rotation-basis/opaque-box
---

# Rotation matrix as a basis

> **In short:** The first three columns of an object's matrix say where its own +X, +Y, and +Z point after it turns, so you can read which way it faces straight out of the matrix, or build a turn from three directions you already have.
>
> **Used for:** Driving a car or a character forward along its own nose, sliding a camera sideways along the screen to pan, standing a sign or a decal flat against a sloped wall, and drawing an object's axes to debug which way it really faces.

## A · The basics

### An object carries its own axes

Every object has its own axes: its own +X, +Y, and +Z. Before it turns, they match its parent's axes. When it turns, they turn with it, like the arrows riding along with the ship on the Euler angles and order page.

An ordinary object's front is its +Z: the side `lookAt` turns toward a target, and the way the ship's nose points. Its top is its +Y. A camera is the exception: it looks down its −Z, with +X to the right of its picture and +Y up.

### The columns are the axes

The matrix vs matrixWorld page called a matrix a saved transform: a move, a turn, and a resize packed into one value. The turn isn't hidden inside it. The matrix's first three columns are the object's own axes after the turn:

- column 1 is where its +X points,
- column 2 is where its +Y points,
- column 3 is where its +Z points: its front.

Each column is as long as the object's `scale` on that axis, so normalize one before you use it as a direction. A set of axes like this is called a **basis**, and the turn part of a matrix is a **rotation basis**. (The fourth column holds the move; the reading matrices page in the debugging domain goes through the numbers one by one.)

```js
const x = new Vector3(), y = new Vector3(), z = new Vector3();
ship.matrixWorld.extractBasis(x, y, z); // the ship's own +X, +Y, +Z, in the world
```

**Analogy: three pointers.** Hold one arm straight out to the side, and say where it points, where the top of your head points, and where your nose points. Those three answers pin down exactly which way you're facing; anyone could copy your pose from them. A rotation basis is those three pointers, written as numbers.

Turn and tip the ship, and resize it. The three arrows are the matrix's first three columns, drawn from the ship's middle: they follow its own axes and grow with its size.

<div data-scene="columns"></div>

<details>
<summary>The math, if you're curious</summary>

Written out, the turn part of the matrix is **[ x y z ]**: the three axes standing side by side as columns. When the axes are at right angles to each other and each is 1 long, the basis is **orthonormal**, and the matrix is an **orthogonal matrix**, a pure turn (or a turn plus a mirror). Scale breaks the "1 long" part, which is why the columns need normalizing.

</details>

## B · Working knowledge

### Reading forward from a matrix

```js
const forward = new Vector3().setFromMatrixColumn(car.matrixWorld, 2).normalize(); // its +Z, in the world
car.position.addScaledVector(forward, speed * delta); // the car sits straight in the scene
```

- **Columns count from 0.** `setFromMatrixColumn(m, 2)` is the third column, +Z. Column 1 is +Y, not the front.
- **Normalize.** Columns carry scale; a car at scale 2 has a column 2 long, and it would move twice as fast.
- **Or ask for it.** `car.getWorldDirection(forward)` gives the same direction, already normalized, and refreshes the matrices first, as the update timing page showed. Reading `matrixWorld` yourself gets it as of the last render.
- **Cameras are flipped.** A camera's third column points behind it. `camera.getWorldDirection(v)` gives the way it looks, which is that column negated.

### Moving along a camera's own axes

```js
camera.matrixWorld.extractBasis(right, up, back); // a camera looks down −Z, so its +Z points back
camera.position.addScaledVector(right, dx);        // slide sideways, along the picture's width
controls.target.addScaledVector(right, dx);        // with OrbitControls, move its target along too
```

That's a pan: the camera and its target slide together, so the view moves without turning.

### Building a turn from three axes

Sometimes you have directions, not angles: a rail runs this way, a wall faces that way. Put the three axes into `makeBasis` in order (+X, +Y, +Z), then turn the matrix into a quaternion:

```js
const forward = railDirection.clone().normalize();                      // its +Z: along the rail
const side = new Vector3().crossVectors(worldUp, forward).normalize();  // its +X: square to both
const up = new Vector3().crossVectors(forward, side);                   // its +Y: square to both again
m.makeBasis(side, up, forward);
cart.quaternion.setFromRotationMatrix(m);
```

The three axes must be at right angles to each other and 1 long, in that order. `makeBasis` copies them in exactly as given, and `setFromRotationMatrix` assumes a pure turn, so anything else gives a wrong turn with no error. That's why `up` is made again from `forward` and `side`, instead of using `worldUp`: on a slope, the world's up isn't at right angles to the rail. And if the rail points straight up, `worldUp` and `forward` line up, and the cross product page showed that gives (0, 0, 0); pick a different helper direction there. The lookAt page builds its turn exactly this way.

Tilt the rail up the slope and switch buttons. With `worldUp` as is, the axes stop being square and the ship comes out skewed.

<div data-scene="build"></div>

### Which space is it in?

| Value | Space |
| --- | --- |
| The columns of `object.matrix` | The object's own axes, measured in its parent's space |
| The columns of `object.matrixWorld`, from `extractBasis` or `setFromMatrixColumn` | The object's own axes, in the world |
| What `object.getWorldDirection(v)` gives back | The world, 1 long: +Z for objects, −Z for cameras |
| The axes you pass to `makeBasis`, to set `object.quaternion` | Measured from the object's parent |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
