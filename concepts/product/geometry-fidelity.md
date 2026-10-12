---
id: product.geometry-fidelity
name: Geometry and manufacturing detail
domain: product
prerequisites: [product.reference-color, geometry.vertex-normals]
misconceptions:
  density-quality: More triangles automatically produce smoother reflections.
  normal-silhouette: A stronger normal map creates raised silhouette detail.
  recalculate: Recalculating all imported normals is always a safe repair.
contexts:
  case: Watch bezel edge highlights
  bags: Stitched bag construction
  housings: Molded plastic housings
---

## Definition

Product geometry supplies silhouette, edge transitions, and consistent surface directions so reflections describe the manufactured shape.

## Cost lens

Modeled detail adds vertices and sometimes draw calls. Normal maps supply smaller shading detail without changing silhouette; their usefulness depends on screen size and asset consistency.
