---
id: interaction.anchoring
name: 3D-to-2D anchoring
domain: interaction
tier: core
prerequisites: [camera.project-unproject, queries.intersection-anatomy]
misconceptions:
  labels-hide: '"Projected labels hide themselves." project() doesn''t: behind the camera, z goes past 1 and x and y flip. CSS2DRenderer hides those, but nothing hides labels behind other objects.'
contexts:
  hotspots: Hotspots
  price-tags: Price tags
  measurement-labels: Measurement labels
---

## Definition

Anchoring pins an HTML label to a spot in the scene by projecting the spot to the screen every frame, and hiding the label yourself when the spot is behind the camera, off the view, or behind something else.

## Space lens

The anchor is a spot in the world. `project(camera)` gives NDC, and the label's position is CSS pixels from the canvas's top-left corner. The blocking test compares distances in world units along a ray from the camera.

## Cost lens

Projecting is a few multiplications per label; moving HTML elements usually costs more. The blocking test is a raycast per label, which adds up with many labels: spread it over frames, or run it when the camera stops.
