---
id: 1.geometry.groups.read-the-code.1
loop: 1
tier: light
concepts: [geometry.groups]
mode: read-the-code
context: geometry.groups/draw-call-audit
lenses: []
misconceptions:
  - geometry.groups/one-draw-call
---

# Groups and multi-material

> **In short:** A mesh can paint different ranges of its triangles with different materials, and each range costs its own draw call.
>
> **Used for:** Painted panels with chrome trim, six-sided dice and packaging, draw call audits, and telling which part was clicked.

## A · The basics

### One mesh, several materials

A mesh can take an array of materials instead of one. The geometry then says which triangles use which one, with a list of **groups**:

```js
geometry.groups; // [{ start: 0, count: 6, materialIndex: 0 }, { start: 6, count: 6, materialIndex: 1 }, …]
const crate = new Mesh(geometry, [cardboard, label]);
```

Each group is a range of the index, from `start` for `count` index numbers, three per triangle, and `materialIndex` picks its slot in the material array. `BoxGeometry` comes with six groups, one per side, in the order +X, −X, +Y, −Y, +Z, −Z.

### Each group is its own draw call

The GPU draws with one material at a time, so three.js draws each group separately: a mesh with six groups and a material array is six draw calls. With a single material, three.js ignores the groups and draws the whole mesh at once.

**Analogy: a coloring page with numbered regions.** It's one page, but you color it one crayon at a time: all the 1s, then all the 2s. Each crayon is a separate pass over the page, even if two numbers happen to use the same color.

Switch between the four versions of the crate and watch the draw call count.

<div data-scene="crate"></div>

## B · Working knowledge

### Setting up groups

```js
geometry.clearGroups();
geometry.addGroup(0, 300, 0);   // index numbers 0 to 299: the paint
geometry.addGroup(300, 120, 1); // the next 120: the chrome
const car = new Mesh(geometry, [paint, chrome]);
```

Without an index, `start` and `count` count vertices instead. Every triangle should be in exactly one group, with no overlaps and no gaps. A material array with no groups draws nothing, and `mergeGeometries(list)` leaves no groups: pass `mergeGeometries(list, true)` to get one group per input geometry.

### Auditing draw calls

Each group is one draw call, even when two groups use the same material; `mergeGroups(geometry)` from the addons joins groups that share one. A glTF mesh whose parts use different materials usually arrives as a `Group` holding one `Mesh` per part instead, which is still a draw call per part. To count them, read `renderer.info.render.calls` after a render.

### Which part was clicked

```js
const hit = raycaster.intersectObject(phone)[0];
const material = phone.material[hit.face.materialIndex]; // the screen or the case
```

`hit.face.materialIndex` is only filled in when the mesh has a material array. With a single material it's always 0, whatever groups the geometry has.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
