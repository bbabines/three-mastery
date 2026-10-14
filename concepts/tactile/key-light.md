---
id: tactile.key-light
name: The key light
domain: tactile
prerequisites: [tactile.reading-light, materials.light-types, geometry.tangent-space]
misconceptions:
  front-light-best: '"Light from the front shows a material best."'
  shadows-show-pores: '"Shadows make the pores show."'
  more-lights-more-real: '"More lights look more real."'
contexts:
  leather-product: A leather bag's product photo
  sofa-configurator: A sofa configurator showing fabric options
  game-sun: A game prop's brick wall under low sun
---

## Definition

The key light is the one main light: placed low and to the side so every bump leaves a little shade, balanced against the HDRI so the shade keeps its detail, matched to the room's color, with a rim light behind when a dark material meets a dark background. Normal maps respond to it by shading alone; they never cast shadows.

## Cost lens

A DirectionalLight adds a little work to every lit pixel; casting shadows adds a depth render of the casting meshes every frame. Each extra light adds both again.
