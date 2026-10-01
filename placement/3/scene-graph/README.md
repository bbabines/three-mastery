---
id: 3.scene-graph.placement
loop: 3
domain: scene-graph
parts:
  - scene-graph.traverse
  - scene-graph.finding-objects
  - scene-graph.safe-mutation
  - scene-graph.world-bounds
  - scene-graph.scene-stats
  - scene-graph.visibility-layers
  - scene-graph.user-data
  - scene-graph.material-override
  - scene-graph.clone-semantics
---

# Placement check: scene graph

No docs or three.js source. Write every function from memory, then run `npm run pick -- done` once. The check records missed parts, and passing all parts suggests skipping this domain's drills.

| Function | Returns |
| --- | --- |
| `visibleMeshes(root: THREE.Object3D)` | The Mesh objects in visible branches. |
| `namedMeshes(root: THREE.Object3D, name: string)` | All meshes with that name, even when names repeat. |
| `removeTaggedHelpers(root: THREE.Object3D)` | How many helper objects were removed. |
| `tightWorldSize(root: THREE.Object3D)` | The tight world-space size as a Vector3. |
| `uniqueGeometryCount(root: THREE.Object3D)` | The number of distinct mesh geometry resources. |
| `rendersForCamera(mesh: THREE.Object3D, camera: THREE.Camera)` | Whether the object is visible through its parents and camera layer. |
| `selectableId(hit: THREE.Object3D)` | The nearest selectable ID, or an empty string. |
| `swapMaterial(mesh: THREE.Mesh, replacement: THREE.Material)` | The original material, while the mesh receives the replacement. |
| `coloredClone(source: THREE.Mesh, color: THREE.ColorRepresentation)` | A colored clone with shared geometry and independent material. |
