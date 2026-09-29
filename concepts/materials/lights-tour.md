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

Lights are objects in the scene that lit materials read: ambient and hemisphere light fill in evenly, a directional light shines in parallel like the sun, point and spot lights shine from one spot, and a RectAreaLight shines from a glowing rectangle.

## Cost lens

Every light adds GPU work for every pixel of every lit material. Adding or removing a light rebuilds the shader program of every lit material in the scene. A light that casts shadows adds a render of the shadow-casting meshes, seen from the light, every frame; a point light adds six.
