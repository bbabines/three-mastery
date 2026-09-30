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

> **In short:** A direction stored at each vertex tells lighting which way the surface faces there, so a few flat triangles can look smooth.
>
> **Used for:** Smooth curved surfaces from few triangles, the low-poly look, crisp hard-surface edges, and fixing bad imports.

## A · The basics

### Lighting reads a normal at every vertex

Every triangle has a face normal, but unless `flatShading` is on, lighting uses the **vertex normals** in the geometry's `normal` attribute instead: one per vertex, measured from the object itself. Across a triangle, the GPU blends its three vertex normals, so the lighting changes smoothly from corner to corner. That's how a ball built from flat triangles can look round.

### computeVertexNormals averages the faces

```js
geometry.computeVertexNormals();
```

For each vertex, this adds up the face normals of every triangle that uses it, with bigger triangles counting more, and sets the result to length 1. **Shared** vertices get the average of the faces around them, so the surface looks smooth. **Split** vertices, as in a geometry with no index, each belong to one triangle and get its face normal, so the surface looks faceted.

**Analogy: rolled paper and folded paper.** Roll a sheet into a tube and every spot faces a direction that blends into its neighbors. Fold it sharply and, right at the crease, the two halves face different ways at one spot: that's what split vertices give you.

A real part has curved sides and sharp rims: averaging everything smears the rims, and splitting everything makes the sides faceted. Try all three on the cylinder; the white lines are the vertex normals.

<div data-scene="smoothing"></div>

## B · Working knowledge

### Recomputing normals

`computeVertexNormals()` reads only the positions, the index, and the corner order. Normals point out of each triangle's front, so an inside-out mesh gets normals pointing inward: fix the winding first. It only averages across vertices that are really shared, so vertices split for a UV seam can leave a faint line along it.

### Choosing where the creases go

```js
import { toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';
const creased = toCreasedNormals(geometry, MathUtils.degToRad(30));
```

Edges where the faces meet at more than the angle stay sharp, and the rest are smoothed. The result has no index, so it uses more memory. For the low-poly look, `geometry.toNonIndexed()` then `computeVertexNormals()` gives every triangle its own face normal.

### Checking imported normals

A file's normals are whatever the tool that made it wrote: flipped on some faces, smoothed across hard edges, or split where the surface should be smooth. A glTF mesh with no normals at all loads with `flatShading` turned on. To see the normals, draw each one as a short line:

```js
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';
scene.add(new VertexNormalsHelper(mesh, 0.05));
```

Recomputing fixes most of these, as long as the corner order is right. Try it on the imported ball: part of it arrived with its normals flipped.

<div data-scene="badImport"></div>

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
