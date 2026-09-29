---
id: geometry.updating-buffers
name: Updating buffers
domain: geometry
tier: light
prerequisites: [geometry.buffer-attribute]
misconceptions:
  array-updates-gpu: '"Editing the array updates the GPU."'
contexts:
  deform: Deforming vertices
  progressive-reveal: Progressive reveal
  vertex-highlight: Per-vertex highlight
---

## Definition

Once a geometry has been drawn, the GPU holds its own copy of each attribute, so edits to an attribute's array reach the screen only after `needsUpdate = true` sends them again, and `setDrawRange` limits how much of the geometry is drawn.

## Cost lens

Each `needsUpdate` re-sends the whole array from the CPU to the GPU, unless `addUpdateRange` marks only the part that changed. Recomputing normals or bounds after an edit is CPU time for every triangle. A GPU buffer can't grow, so allocate the most you'll need up front.
