---
id: 1.geometry.vertex-normals.read-the-code.1
loop: 1
tier: core
concepts: [geometry.vertex-normals]
mode: read-the-code
context: geometry.vertex-normals/smoothing-artifacts
lenses: []
misconceptions:
  - geometry.vertex-normals/imported-right
---

# Vertex normals

> **In short:** A vertex normal is the direction stored at each vertex for lighting, usually the average of the face normals around it, and a hard edge needs its vertices split so each side keeps its own.
>
> **Used for:** Making a curved surface like a bottle or a car body look smooth with few triangles; the crisp, faceted low-poly style; sharp edges on machined, hard-surface parts; and fixing models that arrive with dark patches or smeared shading.

## A · The basics

### Lighting reads a normal at every vertex

The face normals page showed that every triangle has one direction straight out of it. Lighting doesn't use those (unless `flatShading` is on). It uses the **vertex normals** in the geometry's `normal` attribute: one normal per vertex, measured from the object itself. Across a triangle, the GPU blends its three vertex normals, so the lighting changes smoothly from corner to corner. That's how a ball built from flat triangles can look round.

### computeVertexNormals averages the faces

three.js can work them out for you:

```js
geometry.computeVertexNormals();
```

For each vertex, it adds up the face normals of every triangle that uses that vertex, with bigger triangles counting more, and sets the result to length 1. What you get depends on the sharing from the indexed vs non-indexed page:

- **Shared vertices** get the average of all the faces around them, so the surface looks smooth.
- **Split vertices**, like a geometry with no index, belong to one triangle each, so each gets its triangle's face normal and the surface looks faceted.

**Analogy: rolled paper and folded paper.** Roll a sheet into a tube and every spot faces a direction that blends into its neighbors: one direction per spot. Fold it sharply and, right at the crease, the two halves face different ways: two directions at one spot. Shared vertices give the rolled look. Split vertices give the crease.

### Smooth where it's curved, sharp where it's creased

A real part has both: curved sides and sharp rims. Averaging everything smears the rims. Splitting everything makes the curves look faceted. The cylinder shows all three choices. The white lines are the vertex normals.

<div data-scene="smoothing"></div>

## B · Working knowledge

### Recomputing normals

```js
geometry.computeVertexNormals();
```

- It reads only the positions, the index, and the corner order. Normals point out of each triangle's front, so an inside-out mesh gets normals pointing inward: fix the winding first (the winding order page).
- It averages only across vertices that are actually shared. Vertices split for a UV seam (the UVs page) keep separate normals, which can leave a faint line along the seam.

### Choosing where the creases go

```js
import { mergeVertices, toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';
const creased = toCreasedNormals(geometry, MathUtils.degToRad(30));
```

`toCreasedNormals` keeps an edge sharp wherever its two faces meet at more than the angle you give, and smooths the rest. It returns a geometry with no index, so every triangle carries its own three vertices and the memory grows. To go the other way and smooth everything, merge the vertices first, as on the indexed vs non-indexed page, then call `computeVertexNormals()`.

### The low-poly look

Two ways, from the face normals page: `material.flatShading = true`, which leaves the geometry alone, or `geometry.toNonIndexed()` followed by `computeVertexNormals()`, which gives every triangle its own face normal.

### Imported normals

The normals in a file are whatever the tool that made it wrote, and they can be wrong:

- **Flipped** on some faces, which then light as if they faced away: dark patches.
- **Smoothed across hard edges**, so flat faces show gradients and edges look soft or smeared.
- **Split where the surface should be smooth**, so seams show as lines.
- **Missing.** The glTF spec says a mesh with no normals has "implicit flat normals," so `GLTFLoader` turns `flatShading` on for those meshes.

To see them, add a `VertexNormalsHelper` from `three/addons/helpers/VertexNormalsHelper.js`, which draws each vertex normal as a short line. The debug views page, in the debugging domain, covers showing normals as colors.

```js
scene.add(new VertexNormalsHelper(mesh, 0.05));
```

Recomputing fixes most of these, as long as the corner order is right. Try it on the imported ball below: part of it arrived with its normals flipped.

<div data-scene="badImport"></div>

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
