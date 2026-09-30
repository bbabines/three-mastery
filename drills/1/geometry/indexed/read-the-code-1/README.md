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

> **In short:** Neighboring triangles can share one stored vertex instead of each keeping a copy, by listing vertex numbers in an index.
>
> **Used for:** Keeping big models small, smooth rounded surfaces, hard edges and the low-poly look, and per-face colors.

## A · The basics

### Triangles that share corners

A flat square is two triangles. Between them they have six corners, but only four different points, since they meet along a diagonal. A geometry can store that two ways. **Non-indexed**, every triangle lists its own three vertices, so the square takes 6 vertices and two of them are copies. **Indexed**, each point is stored once, and a separate list, the **index**, gives three vertex numbers per triangle: 4 vertices and 6 index numbers.

```js
geometry.setAttribute('position', new Float32BufferAttribute(corners, 3)); // 4 vertices
geometry.setIndex([0, 2, 1, 2, 3, 1]); // triangle 0 uses vertices 0, 2, 1; triangle 1 uses 2, 3, 1
```

**Analogy: a connect-the-dots puzzle.** The dots are numbered once, and the instructions say "draw a triangle through dots 1, 5, and 6." Non-indexed is a puzzle where every triangle comes with its own copies of its dots.

Change the grid's size and switch between the two. The yellow number at each point counts the vertices stored there.

<div data-scene="shareCorners"></div>

### One vertex, one of everything

A vertex holds more than a position: also a normal, the direction the surface faces there, a UV, and maybe a color. A shared vertex has exactly one of each. So where two faces meet at a sharp edge and need to face different ways at the same point, the point has to be split into separate vertices, one per face.

That's why `BoxGeometry` has 24 vertices, not 8: each corner is split into 3, one per face. Merge them down to 8 and each corner gets one normal leaning out diagonally, so the box shades like a ball. Switch between the three boxes; the white lines are the vertex normals.

<div data-scene="hardEdges"></div>

## B · Working knowledge

### Reading triangles through the index

```js
const index = geometry.index; // null when the geometry has no index
for (let i = 0; i < index.count; i += 3) {
  const a = index.getX(i), b = index.getX(i + 1), c = index.getX(i + 2); // vertex numbers
}
```

three.js's built-in shapes, like `BoxGeometry`, are indexed. A raycast reads through the index for you: `hit.face.a`, `.b`, and `.c` are the hit triangle's vertex numbers.

### Switching between the two

```js
const faces = geometry.toNonIndexed(); // every triangle gets its own copies
const shared = mergeVertices(geometry); // from three/addons/utils/BufferGeometryUtils.js
```

`mergeVertices` only merges vertices whose attributes all match, normals and UVs included, so a `BoxGeometry` keeps all 24 unless you delete its `normal` and `uv` first.

### Per-face colors

Anything that changes sharply at a point needs split vertices there: a hard edge, a texture seam, or two faces in different colors. On an indexed mesh, coloring one triangle's vertices colors every triangle that shares them too, in a blurry patch. Call `toNonIndexed()` first, then give each triangle's three vertices one color. `flatShading` works on either kind, since the shader works out each triangle's facing itself.

### What it costs

An index number is 2 bytes, or 4 once any vertex number reaches 65,535, and `setIndex` picks for you. A vertex with position, normal, and UV is 32 bytes, so sharing usually makes a smooth mesh several times smaller. It also means less vertex work on the GPU, which can usually reuse a shared vertex's result.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
