---
id: scene-graph.material-override
name: Material override and restore
domain: scene-graph
tier: light
prerequisites: [scene-graph.traverse, scene-graph.user-data]
misconceptions:
  auto-restore: '"Restoring happens automatically."'
contexts:
  highlight: Highlight
  x-ray: X-ray mode
  debug-views: Debug views
---

## Definition

To show meshes in a different material for a while, save each mesh's material, swap in the new one, and put the saved one back afterwards: nothing in three.js remembers what a mesh wore before.
