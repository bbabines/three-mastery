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

A search by name returns the first matching object under the one you search from, and a check on each object's kind picks out every mesh or light.

## Cost lens

Every search walks the tree until it finds a match, on the CPU. Search once, after loading, and keep what you found.
