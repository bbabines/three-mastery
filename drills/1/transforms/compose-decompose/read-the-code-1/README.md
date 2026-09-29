---
id: 1.transforms.compose-decompose.read-the-code.1
loop: 1
tier: light
concepts: [transforms.compose-decompose]
mode: read-the-code
context: transforms.compose-decompose/copy-world
lenses: []
misconceptions:
  - transforms.compose-decompose/clean-decompose
---

# compose and decompose

> **In short:** `compose` packs a position, a turn, and a size into one matrix, and `decompose` unpacks a matrix back into those three, as long as it holds nothing else.
>
> **Used for:** Copying where a part sits in the world onto another object, reading which way something is turned in the world, building a matrix for each copy of a shape drawn many times, and baking a transform into a shape before merging it with others.

## A · The basics

### Packing and unpacking a transform

A matrix is a saved transform: a move, a turn, and a resize packed into one value that three.js can apply to any point in one step. `compose` does the packing and `decompose` does the unpacking:

```js
matrix.compose(position, quaternion, scale);   // three parts in, one matrix out
matrix.decompose(position, quaternion, scale); // one matrix in, split into the three you pass
```

- `position` and `scale` are Vector3s.
- `quaternion` is three.js's way of storing a rotation. Every object has one, `object.quaternion`, next to `object.rotation`. They're two ways of writing the same turn, and changing one updates the other. The rotation domain explains quaternions; here you only pass them along.
- `decompose` writes its answers into the three objects you hand it, the way `getWorldPosition` writes into the Vector3 you pass.

You've already used both without seeing them. Every object builds its `matrix` by calling `compose` with its own `position`, `quaternion`, and `scale`, in the order from the TRS order page, then shifts it if the object has a `pivot` (the pivots and offset groups page). `getWorldQuaternion` and `getWorldScale` call `decompose` on the object's `matrixWorld`.

**Analogy: notes on a hung picture.** Three notes describe how any picture hangs: where it is, how it's tilted, and how big it is. Hand the notes to someone else and they can hang a matching picture anywhere.

### Not every matrix unpacks cleanly

The TRS order page showed that a rotated part inside a parent stretched by different amounts on each axis gets skewed, and that the skew is called shear. A matrix can hold that skew, but a position, a turn, and a size can't describe it. So `decompose` quietly drops it: no error, no warning, and the parts it gives back describe a plain unskewed shape of about the same size and turn. Rebuilding from them gives a different shape. `object.applyMatrix4` and `attach` decompose too, so they drop a skew the same way.

It's like someone pushing the picture's frame into a lopsided shape. None of the three notes can say "lopsided", so a picture hung from the notes comes out straight.

The yellow outline is a copy built from the panel's decomposed parts. Leave the rack at its normal size and the copy sits exactly on the panel. Stretch the rack and the copy stops matching. At a tilt of 0° or 90° the stretch runs along the panel's own edges, there's no skew, and the copy matches again.

<div data-scene="roundTrip"></div>

## B · Working knowledge

### Copying where a part sits in the world

To put an object exactly where a nested part is, facing the same way and at the same size, decompose the part's `matrixWorld` straight into the object's own values:

```js
part.matrixWorld.decompose(copy.position, copy.quaternion, copy.scale);
scene.add(copy); // the parts are in the world, so add the copy straight to the scene
```

`matrixWorld` is a saved copy, so it can be a frame old right after something moves; the update timing page covers when it's refreshed. If the part might be skewed, copy the whole matrix instead, which keeps everything: `copy.matrix.copy(part.matrixWorld)`, with `copy.matrixAutoUpdate = false` so three.js doesn't rebuild the matrix from the copy's own parts.

### Reading which way something is turned in the world

`wheel.quaternion` is measured from the wheel's parent. For the turn in the world, including every parent's turn, ask for it:

```js
const turn = new Quaternion();
wheel.getWorldQuaternion(turn);
```

That refreshes the matrices, decomposes `matrixWorld`, and keeps only the rotation, so you never need to call `decompose` for this yourself. `getWorldScale` does the same for size, and like any decompose, it can't report a skew.

### Building a matrix, and baking

`compose` is how you make a matrix from parts when something wants one, like each copy of an `InstancedMesh`, one shape drawn many times:

```js
const m = new Matrix4().compose(spot, turn, size); // turn must be a Quaternion
trees.setMatrixAt(i, m);
```

**Baking** writes a transform into the shape's points, so the object can go back to no move, no turn, and no resize. It comes up before merging several shapes into one:

```js
part.updateMatrix();                     // compose the part's own position, quaternion, and scale
part.geometry.applyMatrix4(part.matrix); // move the shape's points by it
part.position.set(0, 0, 0);
part.quaternion.identity();              // no turn
part.scale.set(1, 1, 1);
```

### Which space is it in?

| Value | Space |
| --- | --- |
| `object.matrix`, built by `compose` from the object's own values | Measured from its parent |
| `object.matrixWorld` | The world |
| The parts `object.matrix.decompose(p, q, s)` gives back | Measured from its parent |
| The parts `object.matrixWorld.decompose(p, q, s)` gives back | The world |
| What `object.getWorldQuaternion(q)` gives back | The world |
| The shape's points after baking | Measured from the object itself |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
