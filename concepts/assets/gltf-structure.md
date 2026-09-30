---
id: assets.gltf-structure
name: glTF structure
domain: assets
tier: core
prerequisites: [assets.loaders-tour, geometry.buffer-attribute]
misconceptions:
  one-mesh: '"One glTF mesh becomes one three.js Mesh." Multi-primitive meshes become a Group.'
contexts:
  find-by-name: Finding a part by node name
  audit-materials: Auditing material assignments
  unexpected-children: Explaining unexpected child meshes
---

## Definition

A glTF file is a tree of nodes whose meshes are made of primitives, pieces of geometry with one material each, and GLTFLoader makes each primitive its own Mesh.

## Space lens

A node's position, rotation, and scale are measured from its parent node. The vertex positions in its geometry are measured from the object itself.
