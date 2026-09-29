---
id: interaction.hover-selection
name: Hover and selection state
domain: interaction
tier: light
prerequisites: [interaction.click-vs-drag, queries.ray-from-pointer]
misconceptions:
  one-flag: '"Hover and selection can share one flag."'
contexts:
  part-highlight: Part highlight
  multi-select: Multi-select
  deselect-empty: Deselect on empty click
---

## Definition

Hover and selection are two separate states, so each part's look is worked out from both, and put back exactly as it was when the part leaves them.

## Cost lens

Hover means a raycast on pointer moves: do it at most once per frame, with the latest pointer spot, and against simple stand-in shapes when the real meshes are heavy.
