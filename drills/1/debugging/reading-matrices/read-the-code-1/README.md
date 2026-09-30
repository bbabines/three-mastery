---
id: 1.debugging.reading-matrices.read-the-code.1
loop: 1
tier: core
concepts: [debugging.reading-matrices]
mode: read-the-code
context: debugging.reading-matrices/console-check
lenses: []
misconceptions:
  - debugging.reading-matrices/set-order
---

# Reading matrices

> **In short:** Printed out, a matrix is 16 numbers stored column by column, and they tell you an object's axes, its move, and whether it's mirrored.
>
> **Used for:** Checking a transform in the console, spotting a hidden scale, catching a mirrored part, and loading matrices from other programs.

## A · The basics

### Sixteen numbers in four columns

A matrix is a saved transform: a move, a turn, and a resize packed into one value. A `Matrix4` keeps it as 16 numbers in `matrix.elements`, a plain array. Written as a 4 × 4 grid it has four columns, and three.js stores them **column by column**: `elements[0]` to `[3]` are the first column, top to bottom, `[4]` to `[7]` the second, and so on.

The first three columns are the object's own +X, +Y, and +Z, each as long as its scale on that axis. The fourth column is **the move**: a matrix made by `makeTranslation(7, 8, 9)` has 7, 8, and 9 at indices 12, 13, and 14. For an object's matrix, the bottom row, indices 3, 7, 11, and 15, is always 0, 0, 0, 1.

**Analogy: theater seats numbered down the columns.** Four seats to a column, counted from 0, down each column before starting the next. Seat 12 is at the top of the fourth column, not the start of the fourth row.

Move, turn, and stretch the ship. The arrows are the first three columns, drawn from where the fourth puts it.

<div data-scene="columns"></div>

### The determinant: mirrored or not

The **determinant** is one number worked out from all 16, and its sign is the mirror check: negative means the matrix mirrors. Drag scale x below zero and watch it flip, along with the red arrow. Column lengths never show a mirror, since a length is never negative.

<details>
<summary>The math, if you're curious</summary>

Written as a grid, the three axes and the move stand side by side as columns:

```
X.x  Y.x  Z.x  move.x
X.y  Y.y  Z.y  move.y
X.z  Y.z  Z.z  move.z
0    0    0    1
```

Storing a grid column by column is called **column-major** order.

</details>

## B · Working knowledge

### Reading a transform in the console

```js
mesh.updateWorldMatrix(true, false); // refresh it first
console.log(mesh.matrixWorld.elements);
// [2, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  5, 0.5, -3, 1]: stretched 2 times along X, at (5, 0.5, -3)
```

`matrixWorld` is in the world; `matrix` is measured from the parent. To pull values out, let three.js do the indexing: `setFromMatrixPosition(m)` for the move, `setFromMatrixScale(m)` for the column lengths, or `m.decompose(position, quaternion, scale)` for all three.

### set is row by row

`Matrix4.set` takes its 16 numbers **row by row** (row-major), the way a matrix is written on paper, and stores them column by column. So the move is the last number of each of the first three rows:

```js
m.set(1, 0, 0, 5,
      0, 1, 0, 0.5,
      0, 0, 1, -3,
      0, 0, 0, 1); // m.elements[12] is 5
```

### Copying 16 numbers

The two orders only matter when you move 16 numbers from one form to the other:

```js
copy.matrix.copy(source.matrix);               // right
copy.matrix.fromArray(source.matrix.elements); // right: column by column, like elements
copy.matrix.set(...source.matrix.elements);    // wrong: rows and columns swapped
```

Swapped, the move lands in the bottom row, where it warps the shape instead of moving it, and the turn runs backwards. Try the three ways of typing the same move; the outline marks where the box should be.

<div data-scene="setOrder"></div>

### Spotting scale and mirroring

A model that imports too big or too small often has a scale on a node, and `setFromMatrixScale(mesh.matrixWorld)` shows it. `mesh.matrixWorld.determinant() < 0` finds mirrored meshes, parents' mirrors included: an odd number of minus signs in the scales on the way down mirrors. A determinant of 0 means a scale of 0 somewhere, and the matrix can't be inverted.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
