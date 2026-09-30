---
id: materials.specular
name: Specular and half vector
domain: materials
tier: light
prerequisites: [materials.lambert]
misconceptions:
  highlights-stay: '"Highlights stay put when the camera moves."'
contexts:
  glossy-matte: Glossy vs matte
  moving-highlights: Moving highlights
  roughness: Understanding roughness
---

## Definition

Specular light is the mirror-like highlight on a surface, brightest where the normal lines up with the direction halfway between the light and the viewer.

## Space lens

The direction to the viewer runs from each point on the surface to the camera, so it differs at every point. three.js works it out in view space, measured from the camera, along with the normal and the direction to the light.
