---
id: 4.geometry.placement
loop: 4
domain: geometry
parts:
  - geometry.object-types-tour
  - geometry.buffer-attribute
  - geometry.interleaved
  - geometry.indexed
  - geometry.winding-order
  - geometry.face-normals
  - geometry.vertex-normals
  - geometry.uvs
  - geometry.bounding-volumes
  - geometry.updating-buffers
  - geometry.groups
  - geometry.instanced-mesh
  - geometry.tangent-space
---

# Placement check: Geometry and buffer data

A no-docs check of the decisions in this domain. Write every function in `placement/4/geometry/check.ts` from memory, then run `npm run pick -- done` once. The first attempt is the one that counts. Passing every part suggests skipping this domain's practice; misses point to useful drills. Nothing is timed.

| Function | Decision |
| --- | --- |
| `surfaceObject` | Choose a surface object for geometry and material. |
| `vertexAt` | Read one XYZ vertex by item index. |
| `interleavedStride` | Read the number of stored values per interleaved vertex. |
| `triangleIndices` | Read the three vertex IDs of an indexed triangle. |
| `frontNormal` | Find the side a triangle faces from its corner order. |
| `faceNormal` | Get the flat face normal from three.js. |
| `rebuildNormals` | Recompute vertex normals after moving vertices. |
| `uvAt` | Read a vertex's UV coordinates. |
| `localBounds` | Compute local geometry bounds after a vertex edit. |
| `updateVertex` | Write one vertex and mark its buffer for upload. |
| `addMaterialGroup` | Assign a draw range to one material. |
| `setInstanceTransform` | Update one instance transform for the next render. |
| `bitangent` | Find the third direction of a tangent basis. |
