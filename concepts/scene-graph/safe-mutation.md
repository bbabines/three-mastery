---
id: scene-graph.safe-mutation
name: Safe mutation
domain: scene-graph
tier: light
prerequisites: [scene-graph.traverse]
misconceptions:
  remove-inside-traverse: '"Removing inside traverse is fine."'
contexts:
  remove-helpers: Removing helpers
  replace-meshes: Replacing meshes
  split-groups: Splitting groups
---

## Definition

Adding or removing objects while walking the tree makes the walk skip objects or throw, so collect what to change during the walk and change it afterward.
