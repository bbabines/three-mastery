---
id: scene-graph.finding-objects
name: Finding objects
domain: scene-graph
tier: light
prerequisites: [scene-graph.traverse, assets.gltf-structure]
misconceptions:
  names-unique: '"Names are unique." glTF doesn''t guarantee it.'
  blender-name: '"The name in Blender is the name in three.js." GLTFLoader cleans names and numbers repeats; the original is in userData.name.'
contexts:
  find-node: Finding a node
  group-by-material: Grouping by material
  locate-lights: Locating lights
---

## Definition

`getObjectByName` and its relatives search an object and everything under it and return the first match, and type checks like `isMesh` pick out one kind of object.

## Cost lens

Every search walks the tree until it finds a match, on the CPU. Search once, after loading, and keep what you found.
