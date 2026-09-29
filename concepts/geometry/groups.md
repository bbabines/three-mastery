---
id: geometry.groups
name: Groups and multi-material
domain: geometry
tier: light
prerequisites: [geometry.indexed, geometry.object-types-tour]
misconceptions:
  one-draw-call: '"One mesh is always one draw call."'
contexts:
  per-part: Per-part materials
  draw-call-audit: Draw call audit
  material-index: Raycast materialIndex
---

## Definition

Groups split a geometry's index into ranges (vertex ranges when there's no index), each pointing at a slot in an array of materials, and each group is then drawn as its own draw call; with a single material, groups are ignored.

## Cost lens

Every group of a mesh with a material array is one more draw call, CPU time every frame, even when two groups use the same material. `mergeGroups` joins groups that share a material into one range.
