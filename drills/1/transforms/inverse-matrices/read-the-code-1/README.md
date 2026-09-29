---
id: 1.transforms.inverse-matrices.read-the-code.1
loop: 1
tier: core
concepts: [transforms.inverse-matrices]
mode: read-the-code
context: transforms.inverse-matrices/hit-object-space
lenses: []
misconceptions:
  - transforms.inverse-matrices/inverse-transpose
---

# Inverse matrices

> **In short:** The inverse of a matrix undoes it: an object's `matrixWorld` takes a spot measured from the object into the world, and its inverse brings a world spot back to being measured from the object.
>
> **Used for:** Finding where on a part a click landed, checking whether a spot is inside a turned box, the camera's view of the scene, and moving an object to a new parent without it jumping.

## A · The basics

### Undoing a matrix

The matrix vs matrixWorld page described a matrix as a saved transform: a move, a turn, and a resize packed into one value that three.js can apply to any point in one step. Its **inverse** is the matrix that undoes it: it takes the move, the turn, and the resize back out. Apply a matrix and then its inverse, and every point lands back where it started.

In three.js, `m.invert()` turns a matrix into its inverse.

**Analogy: a seat map.** On the local vs world page, seat 14B was a spot measured from the plane, and the spot on a map was the world position. The plane's `matrixWorld` turns a seat number into a spot on the map. Its inverse goes the other way: give it a spot on the map, like where a lost phone is pinging from, and it tells you the seat.

### From the world back to the object

Most spots three.js hands you are in the world, like where a raycast hit or what `getWorldPosition` gives back. To know where one sits on an object, measured from the object itself, you need the inverse of the object's `matrixWorld`. That's what `worldToLocal` does. It refreshes the object's `matrixWorld`, inverts a copy of it, and applies that to your vector:

```js
const onPanel = panel.worldToLocal(hit.point.clone()); // measured from the panel itself
```

Click anywhere on the panel. `hit.point` is where the click landed in the world. `worldToLocal` gives the same spot measured from the panel itself, and the red, green, and blue lines show those three numbers along the panel's own X, Y, and Z. Click the red button, then turn or move the panel: the button's world numbers change, but its numbers measured from the panel don't.

<div data-scene="clickPanel"></div>

<details>
<summary>The math, if you're curious</summary>

The inverse of a matrix M is written **M⁻¹**. Applying M and then M⁻¹ is the same as applying the **identity matrix**, the matrix that changes nothing: M⁻¹ × M = I. A matrix that has no inverse is called **singular**.

</details>

## B · Working knowledge

### Where on a part did a click land?

A raycast's `hit.point` is in the world. Measured from the object itself, the same spot stays the same however the object moves or turns. That's what you want for sticking a decal where the click landed, or telling whether a click hit the handle end of a tool:

```js
const onDoor = door.worldToLocal(hit.point.clone());
door.add(decal);
decal.position.copy(onDoor); // a child's position is measured from its parent, the door
```

`worldToLocal` changes the vector you pass it, like `sub`, so clone `hit.point` first.

The same trick answers "is this spot inside the turned crate?" Measured from the crate itself, the crate isn't turned, so a plain check against its width, height, and depth works.

### Converting many spots: invert once

Inverting is one of the heavier matrix operations, several times the work of applying a matrix to a point. `worldToLocal` inverts on every call, after refreshing the saved matrices of the object and every parent above it. For one click that's nothing. For thousands of points, or many objects every frame, invert once and reuse it:

```js
const toPart = part.matrixWorld.clone().invert();   // once
for (const p of scanPoints) p.applyMatrix4(toPart); // each point, now measured from the part itself
```

Unlike `worldToLocal`, this uses `matrixWorld` as it was last saved, so if the part just moved, call `part.updateMatrixWorld()` first, as on the update timing page.

three.js does the same when it raycasts: for each mesh, it inverts `matrixWorld` once and converts the one ray into being measured from the mesh, instead of converting every triangle into the world.

### invert() changes the matrix you call it on

Like `sub` and `normalize`, `invert()` changes the matrix it's called on and hands back that same matrix:

```js
const toPart = part.matrixWorld.invert();         // wrong: part.matrixWorld is now the inverse too
const toPart = part.matrixWorld.clone().invert(); // right: part.matrixWorld is untouched
```

three.js rebuilds `matrixWorld` at the next render, so the wrong line can look like a glitch that fixes itself. Anything that reads `matrixWorld` before then, like a raycast in the same click handler, finds the part in the wrong place. A matrix you keep yourself stays broken, since nothing rebuilds it.

### The inverse isn't the transpose

You'll read online that the inverse of a rotation matrix is its **transpose**. Transposing means flipping the matrix's rows and columns, a cheap operation that happens to undo a matrix that only turns. Add any move or any resize and it no longer undoes the matrix; it just lands spots somewhere wrong. An object's `matrixWorld` almost always includes a move, so use `invert()`, which undoes any mix of move, turn, and resize.

The yellow sticker is a spot measured from the sign itself. The scene converts it into the world with `matrixWorld`, then tries to undo that and draws the result as the orange ball. With `invert()`, the ball lands back on the sticker every time. With `transpose()`, it lands there only while the sign just turns in place. Move it or resize it and the ball misses.

<div data-scene="invertVsTranspose"></div>

### A matrix that can't be undone

A resize to 0 squashes every spot onto a single point, and nothing can un-squash it, so that matrix has no inverse. It's like a flattened cardboard box: once it's flat, nothing tells you how tall it was. three.js doesn't throw an error. `invert()` quietly gives back a matrix of all zeros, and applying that gives NaN ("not a number"), which then spreads into everything computed from it:

```js
badge.scale.set(0, 0, 0);                             // shrunk away until it pops in
const offset = badge.worldToLocal(hit.point.clone()); // (NaN, NaN, NaN)
```

A 0 in just one direction, like `scale.set(1, 0, 1)`, does the same. Check for a 0 in the scale before converting, or hide objects with `visible = false` instead of a scale of 0.

### Where three.js inverts for you

- **`object.worldToLocal(v)`** inverts the object's `matrixWorld` on every call, as above.
- **`camera.matrixWorldInverse`** is kept ready on every camera and refreshed along with its `matrixWorld`. It measures any world spot from the camera, which is what drawing the scene needs. It's called the **view matrix**, and the view matrix page in the camera domain covers it.
- **`parent.attach(child)`** uses the inverse of the new parent's `matrixWorld` so the child doesn't jump when it changes parent; the add vs attach page covers it.

### Which space is it in?

| Value | Space |
| --- | --- |
| `hit.point` | The world |
| `panel.matrixWorld` | Converts from measured from the panel itself, to the world |
| `panel.matrixWorld.clone().invert()` | Converts from the world, to measured from the panel itself |
| What `panel.worldToLocal(v)` gives back | Measured from the panel itself |
| A decal's `position`, once it's a child of the panel | Measured from its parent, the panel |
| What `v.applyMatrix4(camera.matrixWorldInverse)` gives back | Measured from the camera |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
