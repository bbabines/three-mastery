---
id: 2.geometry.placement
loop: 2
domain: geometry
parts: [geometry.object-types-tour, geometry.buffer-attribute, geometry.interleaved, geometry.indexed, geometry.winding-order, geometry.face-normals, geometry.vertex-normals, geometry.uvs, geometry.bounding-volumes, geometry.updating-buffers, geometry.groups, geometry.instanced-mesh, geometry.tangent-space]
---

# Geometry placement

No docs or solutions. Write every function in `placement/2/geometry/check.ts` from memory. Each function is short.

| Function | Checks |
| --- | --- |
| `checkObjectTypesTour` | Place repeated parts in one InstancedMesh with separate poses. |
| `checkBufferAttribute` | Read XYZ by vertex number from a position attribute. |
| `checkInterleaved` | Move one interleaved vertex and mark its shared buffer for upload. |
| `checkIndexed` | Read a triangle’s positions using its index list when present. |
| `checkWindingOrder` | Test whether corner order faces a view direction. |
| `checkFaceNormals` | Turn a face normal into the world after uneven stretch. |
| `checkVertexNormals` | Rebuild normals on a copy after positions change. |
| `checkUvs` | Shift only the first triangle’s UVs without moving a shared adjacent face. |
| `checkBoundingVolumes` | Refresh the local bounding sphere after a vertex edit. |
| `checkUpdatingBuffers` | Write a position and mark its attribute for upload. |
| `checkGroups` | Assign a triangle range to a material slot. |
| `checkInstancedMesh` | Update one instance transform and mark it for upload. |
| `checkTangentSpace` | Turn a normal-map sample into a world normal. |

Run `npm run drill -- placement/2/geometry` as you work. When all parts pass, run `npm run pick -- done` once. A miss suggests practicing the drills for that concept; it is not a gate.
