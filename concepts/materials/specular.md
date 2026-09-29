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

Specular light is the mirror-like part of a surface's light, the highlight, and it's brightest where the surface's normal lines up with the half vector, the direction halfway between the directions to the light and to the viewer, so a highlight moves when the viewer moves.

## Space lens

With a perspective camera, the direction to the viewer is different at every point: it runs from that point on the surface to the camera. (An orthographic camera uses one direction for every point.) three.js works it out in view space, measured from the camera, along with the normal and the direction to the light.
