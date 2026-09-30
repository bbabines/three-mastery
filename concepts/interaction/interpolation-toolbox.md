---
id: interaction.interpolation-toolbox
name: Interpolation toolbox
domain: interaction
tier: light
prerequisites: [math.lerp, rotation.slerp]
misconceptions:
  linear-natural: '"Linear easing looks natural."'
contexts:
  ui-transitions: UI transitions
  focus-animation: Focus animation
  drag-to-value: Mapping drag distance to a value
---

## Definition

A few small functions shape how a value travels between two ends: keeping it in range, easing its start and finish, converting one range to another, and blending turns.
