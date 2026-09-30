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

Every object carries a plain object for your own data, which glTF extras fill in and which is copied along with the object when it's cloned or saved.
