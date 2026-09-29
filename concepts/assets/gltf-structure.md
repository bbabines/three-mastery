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

A glTF file is a tree of nodes, where a node can carry a mesh made of one or more primitives (geometry with one material each), and GLTFLoader turns each node into an Object3D and each primitive into its own Mesh.

## Space lens

A node's position, rotation, and scale are measured from its parent node. The numbers in a primitive's position accessor, which become `geometry.attributes.position`, are measured from the mesh itself.
