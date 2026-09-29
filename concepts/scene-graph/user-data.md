---
id: scene-graph.user-data
name: userData and metadata
domain: scene-graph
tier: light
prerequisites: [scene-graph.traverse, scene-graph.finding-objects]
misconceptions:
  outside-scene: '"Metadata must live outside the scene."'
contexts:
  tag-ids: Tagging parts with IDs
  mark-selectable: Marking parts selectable
  store-material: Storing an original material
---

## Definition

`userData` is a plain object on every Object3D for your own data; glTF `extras` arrive in it, and it travels with the object through `clone` and saving.
