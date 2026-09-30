---
id: materials.lights-tour
name: 'Tour: lights'
domain: materials
tier: light
prerequisites: [materials.materials-tour]
misconceptions:
  rectarea-any-material: '"RectAreaLight works on any material." It lights only Standard and Physical, needs `RectAreaLightUniformsLib.init()`, and casts no shadows.'
  old-intensities: '"Light intensities from old tutorials look the same today."'
contexts:
  studio-product: Studio lighting for a product
  softbox-window: A softbox or window
  room-from-above: A room lit from above
---

## Definition

Lights are objects in the scene that lit materials read, and each kind differs in where its light comes from: everywhere, far away, one spot, or a glowing panel.

## Cost lens

Every light adds GPU work for every pixel of every lit material, and adding or removing one rebuilds their shader programs. A light that casts shadows renders the shadow-casting meshes again from the light every frame, six times for a point light.
