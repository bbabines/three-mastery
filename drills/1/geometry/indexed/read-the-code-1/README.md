---
id: 1.geometry.indexed.read-the-code.1
loop: 1
tier: core
concepts: [geometry.indexed]
mode: read-the-code
context: geometry.indexed/memory-savings
lenses: []
misconceptions:
  - geometry.indexed/shared-normals
---

# Indexed vs non-indexed

> **In short:** An index is a list of vertex numbers, three per triangle, that lets neighboring triangles share a vertex instead of each carrying its own copy.
>
> **Used for:** Keeping big models small, like a scanned statue with a million triangles; smooth, rounded surfaces, where neighbors share a corner and its normal; hard edges and the flat-shaded low-poly look, where they can't share; and giving each face its own color, like a floor plan colored room by room.

## A · The basics

### Triangles that share corners

A flat square is two triangles. Between them they have six corners, but only four different points: the two triangles meet along a diagonal and share two of them.

A geometry can store that two ways:

- **Non-indexed:** every triangle lists its own three vertices, one after another. The square takes 6 vertices, and two of them are copies.
- **Indexed:** each point is stored once, as a vertex, and a separate list, the **index**, says which vertices make up each triangle, three numbers per triangle. The square takes 4 vertices and 6 index numbers.

```js
geometry.setAttribute('position', new Float32BufferAttribute(corners, 3)); // 4 vertices
geometry.setIndex([0, 2, 1, 2, 3, 1]); // triangle 0 uses vertices 0, 2, 1; triangle 1 uses 2, 3, 1
```

The numbers in the index are vertex numbers, the same ones `getX(i)` takes on the BufferAttribute and itemSize page.

**Analogy: a connect-the-dots puzzle.** The dots are numbered once, and the instructions say "draw a triangle through dots 1, 5, and 6." Non-indexed is a puzzle where every triangle comes with its own copies of its dots, even where triangles touch.

Change the grid's size and switch between the two. The yellow number at each point is how many vertices sit there. Indexed, it's always 1. Non-indexed, an inside point carries a copy for every triangle that touches it.

<div data-scene="shareCorners"></div>

### One vertex, one of everything

A vertex doesn't only hold a position. It also holds a normal, the direction the surface faces there (the normal matrix page), a UV (the UVs page), and maybe a color. A shared vertex has exactly one of each. So where two faces meet at a sharp edge and need to face different ways at the same point, they can't share a vertex: the point has to be split into separate vertices, one per face.

That's why three.js's `BoxGeometry` has 24 vertices, not 8: each corner is split into 3, one for each face that meets there, so each face's vertices can point straight out of that face. Merge them back down to 8 and every corner gets one normal leaning out diagonally, so the lighting smooths across the edges and the box looks like a blurry ball.

Switch between the three boxes. The white lines are the vertex normals.

<div data-scene="hardEdges"></div>

## B · Working knowledge

### Reading triangles through the index

```js
const index = geometry.index; // null when the geometry has no index
for (let i = 0; i < index.count; i += 3) {
  const a = index.getX(i), b = index.getX(i + 1), c = index.getX(i + 2); // vertex numbers
}
```

- Triangle count is `index.count / 3` with an index, and `position.count / 3` without one.
- A raycast hit tells you the triangle too: `hit.faceIndex` is its number, and `hit.face.a`, `.b`, and `.c` are its three vertex numbers, already read through the index.

### Which one do I have?

- `geometry.index === null` means non-indexed. three.js's built-in shapes, like `BoxGeometry` and `SphereGeometry`, are indexed.
- `geometry.toNonIndexed()` returns a new geometry where every triangle has its own copies of its vertices.
- `mergeVertices(geometry)`, from `three/addons/utils/BufferGeometryUtils.js`, goes the other way. It only merges vertices whose attributes all match, normals and UVs included, so a `BoxGeometry` keeps all 24 unless you delete its `normal` and `uv` first.

### Hard edges, seams, and per-face colors

Anything that has to change sharply at a point needs split vertices there: a hard edge (two normals), a seam in a texture (two UVs), or two faces in different colors. The simplest way to give every face its own color is to stop sharing altogether:

```js
const faces = geometry.toNonIndexed();
const colors = new BufferAttribute(new Float32Array(faces.attributes.position.count * 3), 3);
for (let v = 0; v < colors.count; v += 3) {
  const c = faceColor(v / 3); // this triangle's color
  for (let k = 0; k < 3; k++) colors.setXYZ(v + k, c.r, c.g, c.b);
}
faces.setAttribute('color', colors);
```

On an indexed mesh, coloring one triangle's three vertices colors every triangle that shares them too, in a blurry patch.

Flat shading is different: `material.flatShading = true` works on either kind, because the shader works out each triangle's facing direction itself and ignores the stored normals (the face normals page).

### What it costs

- Each index number is 2 bytes (`Uint16Array`) or 4 (`Uint32Array`). `setIndex` picks for you: 4 bytes once any vertex number reaches 65,535. A loaded glTF can also use 1-byte indices.
- A smooth `SphereGeometry(1, 32, 16)` is about 23 KB indexed and 92 KB non-indexed, with position, normal, and UV at 32 bytes per vertex.
- Fewer vertices also means less work for the GPU's vertex stage, which runs once per vertex it processes. With an index, the GPU can usually reuse a shared vertex's result instead of working it out again.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
