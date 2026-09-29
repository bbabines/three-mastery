---
id: interaction.controls-coexistence
name: Controls coexistence
domain: interaction
tier: light
prerequisites: [interaction.controls-tour, interaction.click-vs-drag]
misconceptions:
  ignore-each-other: '"Controls ignore each other."'
contexts:
  transform-controls: TransformControls
  custom-drags: Custom drags
  html-overlays: HTML overlays
---

## Definition

Every controls object listens to the same pointer on the same canvas and knows nothing about the others, so while a gizmo or your own drag is moving something, the camera controls have to be switched off.
