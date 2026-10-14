---
id: tactile.grounding
name: Shadows and grounding
domain: tactile
prerequisites: [tactile.key-light, materials.shadows]
misconceptions:
  hdri-casts-shadows: '"The HDRI casts shadows."'
  ao-map-everywhere: '"An AO map darkens everything in crevices."'
  pcf-soft: '"PCFSoftShadowMap gives soft shadows."'
contexts:
  product-on-page: A product sitting on a store page's background
  room-planner: Furniture standing on a floor in a room planner
  game-terrain: A game prop resting on terrain
---

## Definition

Grounding is the darkness where an object meets what it stands on: a light's shadow (four switches, a fitted shadow camera, a small normal bias, and a radius for softness), a contact shadow, or screen-space ambient occlusion, since the HDRI casts no shadows and an AO map only darkens the environment's light.

## Cost lens

A shadow-casting light draws its casters again every frame. A contact shadow costs a small render and two blurs, and nothing once drawn if nothing moves. GTAO draws the scene's normals and depth again and runs a full-screen pass every frame, the most of the three.
