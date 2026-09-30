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

Showing meshes in a different material for a while means saving each mesh's material, swapping in the new one, and putting the saved one back afterward, because nothing in three.js remembers what a mesh wore before.
