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

> **In short:** Printed out, a matrix is 16 numbers stored column by column: the first three columns say where the object's own X, Y, and Z axes point and how long they are, numbers 12 to 14 say where it sits, and the determinant's sign says whether it's mirrored.
>
> **Used for:** Checking a transform in the console when something lands in the wrong place; spotting a hidden scale in an imported model; catching a mirrored part before it draws inside out; and taking in matrices from a file, a server, or another program.

## A · The basics

### Sixteen numbers in four columns

The matrix vs matrixWorld page called a matrix a saved transform: a move, a turn, and a resize packed into one value that three.js can apply to any point in one step. Until now, pages have only said what a matrix holds. This page reads its numbers.

A `Matrix4` keeps 16 numbers in `matrix.elements`, a plain array. Written out as a 4 × 4 grid, it has four columns, and three.js stores them **column by column**: `elements[0]` to `[3]` are the first column, top to bottom, `[4]` to `[7]` the second, and so on. The docs call this **column-major** order.

| Indices | Column | What it holds |
| --- | --- | --- |
| 0, 1, 2 | First | Where the object's own +X points, as long as its X scale |
| 4, 5, 6 | Second | Its own +Y, as long as its Y scale |
| 8, 9, 10 | Third | Its own +Z, as long as its Z scale |
| 12, 13, 14 | Fourth | The move: where it sits |
| 3, 7, 11, 15 | The bottom row | Always 0, 0, 0, 1 for an object's matrix |

The rotation basis page already read the first three columns as the object's own axes. The fourth is new: a matrix made by `makeTranslation(7, 8, 9)` has 7, 8, and 9 at indices 12, 13, and 14.

**Analogy: seats numbered down the columns.** A small theater numbers its seats from 0, four to a column, going down each column before starting the next. Seat 12 isn't where counting along the rows would put it, at the start of the fourth row: it's at the top of the fourth column. Once you know which way the numbering runs, you can find any seat without counting.

Move, turn, and stretch the ship. The arrows are the first three columns, drawn from where the fourth puts it, in the same colors as the readout.

<div data-scene="columns"></div>

### The determinant: mirrored or not

The negative scale and determinant page introduced the **determinant**, one number worked out from all 16. Its sign is the check: negative means the matrix mirrors. Drag the X scale below zero and watch it flip, along with the red arrow. The column lengths never show a mirror, since a length is never negative; the determinant does.

<details>
<summary>The math, if you're curious</summary>

Written as a grid, an object's matrix is the three axes and the move standing side by side as columns, over a bottom row of 0, 0, 0, 1:

```
X.x  Y.x  Z.x  move.x
X.y  Y.y  Z.y  move.y
X.z  Y.z  Z.z  move.z
0    0    0    1
```

A matrix with that bottom row is an **affine** matrix, which is why r186's own mirror check is called `determinantAffine()`.

</details>

## B · Working knowledge

### Reading a transform in the console

```js
mesh.updateWorldMatrix(true, false); // refresh it first, as on the update timing page
console.log(mesh.matrixWorld.elements);
// [2, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  5, 0.5, -3, 1]: stretched 2 times along X, sitting at (5, 0.5, -3)
```

To pull values out, let three.js do the indexing: `new Vector3().setFromMatrixPosition(m)` for the move, `setFromMatrixScale(m)` for the column lengths, `setFromMatrixColumn(m, 0)` for one axis, and `m.decompose(position, quaternion, scale)` for all three (the compose and decompose page).

### set is row by row

`Matrix4.set` takes its 16 numbers **row by row** (row-major), the way a matrix is written on paper, and stores them column by column. So the move is the last number of each of the first three rows:

```js
m.set(1, 0, 0, 5,
      0, 1, 0, 0.5,
      0, 0, 1, -3,
      0, 0, 0, 1);  // m.elements[12] is 5
```

The two orders only matter when you move 16 numbers from one form to the other:

```js
copy.matrix.copy(source.matrix);               // right
copy.matrix.fromArray(source.matrix.elements); // right: fromArray reads column by column, like elements
copy.matrix.set(...source.matrix.elements);    // wrong: rows and columns swapped
```

Swapped, the move lands in the bottom row, where it warps the shape instead of moving it, and the turn runs backwards. glTF files store matrices column by column too, which is why `GLTFLoader` reads them with `fromArray`. Numbers from anywhere else, like a server or a CAD export, say in their docs which order they use.

Try the three ways of typing the same move. The outline marks where the box should be.

<div data-scene="setOrder"></div>

### Spotting scale and mirroring

- **Hidden scale:** a model that imports too big or too small often has a scale on a node; the column lengths show it. `setFromMatrixScale(mesh.matrixWorld)` gives all three.
- **Mirroring:** `mesh.matrixWorld.determinant() < 0` finds mirrored meshes, parents' mirrors included. Count the minus signs in the scales on the way down: an odd number mirrors.
- **A determinant of 0** means a scale of 0 somewhere: the shape is flat, and the matrix can't be inverted. The NaN and degenerate cases page covers what that breaks.

### Which space is it in?

| Value | Space |
| --- | --- |
| `object.matrix.elements` | Measured from its parent |
| `object.matrixWorld.elements` | The world, as of the last refresh |
| The first three columns of `matrixWorld` | The object's own axes, in the world |
| `matrixWorld.elements[12]` to `[14]` | Its position in the world |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
