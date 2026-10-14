---
id: effects.hdri-ground
name: Projected HDRI ground
domain: effects
prerequisites: [materials.environment-maps, effects.ground-shadow]
misconceptions:
  any-hdri: '"Any HDRI works as a floor."'
contexts:
  room-scene: A product shown in a photographed room
  outdoor: Furniture or a vehicle on a real outdoor floor
  lighting-match: A background that matches the lighting exactly
---

## Definition

A projected HDRI ground bends the lower half of the lighting panorama onto a flat floor under the product, so the photo's own floor appears to be what the product stands on.

## Cost lens

It's a background: one sphere draw a frame, about as costly as showing the panorama behind the scene, and no new texture memory when the same panorama already lights the scene. The photo's floor can't receive shadows, so a shadow is laid on top.
