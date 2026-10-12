---
id: product.geometry-fidelity.page
elective: product
kind: page
concepts: [product.geometry-fidelity]
---

# Geometry and manufacturing detail

> **In short:** Believable product geometry supplies the silhouette, edge transitions, and surface directions that lighting needs to reveal the manufactured shape.
>
> **Used for:** Watch bezels, stitched bags, molded plastic housings, and brushed hardware.

## Evidence

The watch contains separate materials for its case, cover, glass, dial, strap, and stitches. The stitches have their own mesh surfaces and normal texture. The strap's leather grain uses a different normal texture. These are different levels of detail: constructed shapes plus tiny shading variation.

Its file also records custom screen-space bevel settings on the cover, but the viewer's bevel plugin is disabled. A recorded material extension therefore does not prove that an effect contributes to the reference image. Standard GLTFLoader does not implement that custom screen-space bevel operation.

Use the live audit to inspect the actual decoded model. Compare reference shading, flat faces, wireframe, and mesh normals. Rotate the reflection to make smoothness and discontinuities easier to see.

<div data-scene="meshAudit"></div>

## Why it works

**Normals** describe which direction a surface faces for shading. Smooth vertex normals blend across triangles so a curved case can reflect a flowing highlight. Flat shading exposes each triangle's direction. More triangles can improve a silhouette, but triangle count alone does not guarantee correct normals or clean reflections.

**Analogy:** a polished spoon shows a flowing stripe from a window. A crumpled spoon breaks that stripe into pieces. The light can reveal those pieces, but moving it cannot straighten the spoon.

A **bevel** is a modeled transition between faces. It creates a band of directions that catches light even when the broad faces are dark. A perfectly sharp corner has no finite transition surface. Compare the sharp block on the left with the beveled block on the right; both use one material.

Turn modeled stitches off, then turn grain shading off separately. Orbit toward the strap's edge. The stitches can contribute protruding shapes; a normal map only changes shading and cannot add a raised silhouette.

<div data-scene="edgesAndStitches"></div>

**Tangents** describe a direction along the UV surface. Tangent-space normal maps and anisotropic highlights depend on a matching surface frame. When tangents are absent, three.js can derive a frame from screen-space derivatives. That fallback does not repair stretched UVs, inconsistent normals, or a normal map baked for a different mesh.

Keep triangulation, UV seams, normals, and the normal bake consistent between the authoring tool and export. Do not blindly recalculate imported normals: hard edges and split vertices may be intentional. Inspect the failing seam first.

## The code

The controls run these comparisons in `scenes.ts`.

### Inspect the imported mesh

```js
const normals = mesh.geometry.getAttribute('normal');
const tangents = mesh.geometry.getAttribute('tangent');
const triangles = (mesh.geometry.index?.count ?? mesh.geometry.getAttribute('position').count) / 3;
```

### Expose the faces

```js
material.flatShading = true;
material.needsUpdate = true;
mesh.material = new THREE.MeshNormalMaterial(); // a separate inspection mode
```

The normal inspection material shows mesh directions; it does not inherit the leather normal map. Restore the original material after diagnosis.

### Give the edge a surface

```js
const bevel = new THREE.ExtrudeGeometry(shape, {
  depth: 0.35, bevelEnabled: true, bevelSize: 0.05,
  bevelThickness: 0.05, bevelSegments: 4,
});
```

These dimensions belong to the comparison block in study units. They are not manufacturing measurements of the watch. Production bevel dimensions should follow the real object and survive its closest allowed zoom.

## Exercises

1. Find a case highlight that flows in reference mode and breaks in flat mode. Save both from one camera. Acceptance: explain how surface directions changed while geometry positions stayed fixed.
2. Rotate the environment until the beveled block has a narrow edge highlight. Inspect both blocks from a grazing camera. Acceptance: identify the transition surface and the silhouette difference, rather than crediting material roughness.
3. Compare stitching hidden, grain off, and the complete watch at close zoom. Acceptance: identify which removed detail changes geometry and which changes only shading.

## How it goes wrong

| Symptom | Cause and repair |
| --- | --- |
| A highlight has an unexplained seam | Inspect normals, UV/bake seams, and triangulation together. Repair the authoring/export mismatch. |
| Dense mesh still looks faceted | Normals or broad shape can remain wrong. Wireframe is evidence of density, not quality. |
| Embossing disappears at the silhouette | A normal map cannot create relief geometry. Model significant depth or use displacement with sufficient vertices. |
| Stitching vanishes at product distance | The feature occupies too few screen pixels. Judge it at the actual configurator zoom, then simplify or enlarge only when justified. |
| Every surface becomes smooth after a repair | Recalculated normals erased intentional hard boundaries. Restore split edges and the intended bake. |

Explain one defect that changing the HDR could expose but could not fix.

<div data-mark-done></div>
