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

Once a geometry has been drawn, the GPU keeps its own copy of each attribute, so an edit reaches the screen only after the attribute is marked to be sent again.

## Cost lens

Each `needsUpdate` re-sends the whole array from the CPU to the GPU, unless `addUpdateRange` marks only the part that changed, and recomputing normals or bounds is CPU time for every triangle. A GPU buffer can't grow, so allocate the most you'll need up front.
