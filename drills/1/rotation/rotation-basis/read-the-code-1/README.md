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

> **In short:** An object's matrix keeps its own three axes as columns, so you can read which way it faces, or build a turn from three directions.
>
> **Used for:** Moving a car along its nose, panning a camera, fitting a sign flat to a wall, and drawing axes to debug.

## A · The basics

### An object carries its own axes

Every object has its own +X, +Y, and +Z, which turn with it. An ordinary object's front is its +Z and its top is its +Y. A camera is the exception: it looks down its −Z, with +X to the right of its picture.

### The columns are the axes

A matrix is a saved transform, and the turn isn't hidden inside it: its first three columns are the object's own +X, +Y, and +Z after the turn. A set of axes like this is called a **basis**. Each column is as long as the object's `scale` on that axis, so normalize one before using it as a direction.

```js
ship.matrixWorld.extractBasis(x, y, z); // its own +X, +Y, +Z, in the world
ship.matrix.extractBasis(x, y, z);      // the same axes, in its parent's space
```

**Analogy: three pointers.** Hold one arm out to the side, and say where it points, where the top of your head points, and where your nose points. Those three answers pin down which way you face; anyone could copy your pose from them.

Turn, tip, and resize the ship. The three arrows are the matrix's first three columns: they follow its own axes and grow with its size.

<div data-scene="columns"></div>

<details>
<summary>The math, if you're curious</summary>

When the three columns are at right angles to each other and each is 1 long, the basis is **orthonormal**, and the matrix is a pure turn. Scale breaks the "1 long" part.

</details>

## B · Working knowledge

### Reading forward from a matrix

```js
const forward = new Vector3().setFromMatrixColumn(car.matrixWorld, 2).normalize(); // its +Z
car.position.addScaledVector(forward, speed * delta); // the car sits straight in the scene
```

Columns count from 0, so column 2 is +Z. `car.getWorldDirection(forward)` gives the same direction, already normalized. A camera's third column points behind it, so its `getWorldDirection` gives that column flipped.

### Panning a camera

```js
camera.matrixWorld.extractBasis(right, up, back); // a camera's +Z points back
camera.position.addScaledVector(right, dx);
controls.target.addScaledVector(right, dx);       // move the OrbitControls target too
```

The camera and its target slide together, so the view moves without turning.

### Building a turn from three axes

When you have directions, not angles, give `makeBasis` the three axes in order, +X, +Y, +Z:

```js
const forward = railDirection.clone().normalize();                     // its +Z
const side = new Vector3().crossVectors(worldUp, forward).normalize(); // its +X
const up = new Vector3().crossVectors(forward, side);                  // its +Y
cart.quaternion.setFromRotationMatrix(m.makeBasis(side, up, forward));
```

The axes must be at right angles and 1 long, or the turn comes out wrong with no error. That's why `up` is rebuilt: on a slope, `worldUp` isn't at right angles to the rail. Raise the slope and switch buttons: with `worldUp`, the ship comes out skewed.

<div data-scene="build"></div>

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
