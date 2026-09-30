---
id: interaction.focus-on-object
name: Focus on object
domain: interaction
tier: light
prerequisites: [camera.fit-to-bounds, interaction.orbit-pan-dolly, math.lerp]
misconceptions:
  leave-target: '"Move the camera but leave the target."'
contexts:
  double-click-focus: Double-click focus
  reset-view: Reset view
  guided-views: Guided views
---

## Definition

Focusing on an object works out a view that fits its bounding sphere and moves the camera and the orbit target there together, so the camera looks at the object and orbits around it afterward.
