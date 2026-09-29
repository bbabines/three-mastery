---
id: 1.transforms.matrix-vs-matrixworld.read-the-code.1
loop: 1
tier: core
concepts: [transforms.matrix-vs-matrixworld]
mode: read-the-code
context: transforms.matrix-vs-matrixworld/world-bounds
lenses: []
misconceptions:
  - transforms.matrix-vs-matrixworld/always-current
---

# matrix vs matrixWorld

> **In short:** Every object keeps two saved transforms: `matrix` is its own move, turn, and resize measured from its parent, and `matrixWorld` is where it really ends up in the world, with every parent above it combined in.
>
> **Used for:** Drawing each mesh in the right place on screen; working out what a click or a ray hit; measuring the space an object takes up in the world, to frame a camera on it or check that it fits; and saving a scene to a file or handing it to another program.

## A · The basics

### A matrix is a saved transform

On the local vs world space page, every object had three settings: `position`, `rotation`, and `scale`, which are a move, a turn, and a resize. To draw an object, three.js has to apply all three to every point of its shape, and a shape can have thousands of points. So it first packs the three settings into one value called a **matrix**: a saved transform, a move, a turn, and a resize packed into one value that three.js can apply to any point in one step.

You set `position`, `rotation`, and `scale`, and three.js builds the matrix from them. You rarely build or read one yourself. Its type in three.js is `Matrix4`, and reading what's inside one comes much later, in the debugging domain.

**Analogy: a saved preset on a photocopier.** "Shrink to half size, turn it sideways, and shift it into the corner" is three settings. Save them as one preset, and every page you feed in gets all three in a single pass. `position`, `rotation`, and `scale` are the settings. The matrix is the preset. The points of the shape are the pages.

### Every object keeps two

Each object stores two of these:

- **`matrix`** is the object's own move, turn, and resize, measured from its parent. three.js builds it from the object's `position`, `rotation` (or `quaternion`, the same turn written another way), and `scale`. It knows nothing about the parents.
- **`matrixWorld`** is where the object really ends up in the world: its own `matrix` with every parent above it combined in, its parent's, that parent's parent's, and so on up to the scene.

In photocopier terms, `matrix` is the object's own preset, and `matrixWorld` is the whole run of presets a page goes through, the object's own and then each parent's, saved as one.

For an object added straight to the scene, the only parent is the scene itself, which normally stays put, so the two hold the same transform.

Slide the box, raise the shelf, and turn the table. The solid box is drawn with `box.matrixWorld`. The faint box is drawn with `box.matrix` alone, measured from the center of the scene as if the box had no parents: it keeps the box's own slide and slight turn, but ignores the shelf and the table. The two orange arrows are the same move, one measured from the shelf and one from the center of the scene.

<div data-scene="twoMatrices"></div>

<details>
<summary>The math, if you're curious</summary>

The names you'll see in docs and forums: `matrix` is the object's **local matrix** (here "local" means measured from the parent), and `matrixWorld` is its **world matrix**. Shader code calls the world matrix `modelMatrix`. three.js builds each world matrix from the one above it, one level at a time down the tree:

`matrixWorld = parent.matrixWorld × matrix`

The order of the two matters; the TRS order page covers why.

</details>

### Saved, not live

Both matrices are saved copies, not live values. Setting `position` changes only `position`. three.js rebuilds `matrix` and `matrixWorld` when it renders the scene, so code that reads them after a change and before the next render gets the old transform. Nothing warns you; the values just describe where the object used to be.

Press **Move it**. The ball's `position` changes right away, and the very next line reads `ball.matrixWorld`: it still describes the old spot, marked by the gray ball. Once three.js renders the next frame, `matrixWorld` catches up.

<div data-scene="staleRead"></div>

`getWorldPosition`, from the local vs world space page, gives the new spot even here. When the saved transforms get refreshed, which methods refresh them for you, and how to refresh them yourself are on the update timing page.

## B · Working knowledge

### Which code reads which

Anything that asks "where is it in the world?" reads `matrixWorld`. `matrix` only means something next to its parent.

| Code | Reads |
| --- | --- |
| The renderer, placing each mesh on screen | `matrixWorld` |
| `raycaster.intersectObject(mesh)`, checking what a ray hits | `matrixWorld` |
| `new Box3().setFromObject(mesh)`, the box a mesh fills in the world | `matrixWorld` |
| `getWorldPosition(v)` and the other `getWorld…` methods | `matrixWorld` |
| `GLTFExporter` and `object.toJSON()`, saving a scene to a file | `matrix` (or `position`, `quaternion`, and `scale`, with GLTFExporter's `trs: true`), measured from the parent, for every object in the tree |

### Measuring an object in the world

`Box3` is three.js's box type. `setFromObject` fits one around an object and everything attached to it, in the world:

```js
const bounds = new Box3().setFromObject(rack);
const size = bounds.getSize(new Vector3()); // width, height, and depth in the world
```

It combines each mesh's shape with that mesh's `matrixWorld`, so every parent's move, turn, and resize is included. That's the box to use for framing a camera on the rack, or for checking that it fits in a room.

If you ever build a box from a mesh's shape yourself, combine it with `matrixWorld` too. `mesh.geometry.boundingBox` is the box around the shape, measured from the mesh itself; the bounding box and sphere page covers it.

```js
mesh.geometry.computeBoundingBox(); // the box around the shape, measured from the mesh itself
const box = mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld); // now in the world
```

With `mesh.matrix` in its place, the parents are left out. For a mesh inside a group, the box lands where the mesh would be if the group weren't there.

### Saving and exporting transforms

What to save depends on whether the tree of parents gets saved too.

- **A file that keeps the tree,** like glTF from `GLTFExporter`, or `object.toJSON()`: each object saves its own transform, usually its `matrix`, measured from its parent. When the file loads, three.js rebuilds every `matrixWorld` from the tree, so everything lands where it was.
- **A flat list with no parents,** like a layout sent to a warehouse system, or placements sent to a server: save where each thing really is, from `matrixWorld` or `getWorldPosition`. A `matrix` in that list leaves out the parents, so a bin saved from a rack lands as if the rack stood at the center of the world.

### Moving an object to a new parent

`add` keeps an object's `position`, `rotation`, and `scale`, so its `matrix` holds the same move, turn, and resize, now measured from the new parent:

```js
shelfB.add(bin); // the bin was on shelf A
```

Its `matrixWorld` now combines in shelf B instead of shelf A, so at the next render the bin jumps to the same spot on shelf B. The add vs attach page covers moving an object to a new parent without the jump.

### Which space is it in?

| Value | Space |
| --- | --- |
| `object.position`, `.rotation`, `.scale` | Measured from its parent |
| `object.matrix` | Measured from its parent |
| `object.matrixWorld` | The world |
| What `new Box3().setFromObject(object)` gives back | The world |
| `mesh.geometry.boundingBox` | Measured from the mesh itself |
| `hit.point`, where a raycast hit | The world |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
