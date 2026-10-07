---
id: jewelry.polished-metal
name: Polished metal and tone mapping
domain: jewelry
prerequisites: [materials.pbr, materials.environment-maps, materials.tone-mapping, materials.color-spaces, jewelry.two-environments]
misconceptions:
  textures: '"Metal looks real because of its textures."'
  no-tone-mapping: '"Leaving tone mapping off keeps colors true."'
  point-lights: '"Point lights make metal shine."'
contexts:
  precious-metals: Gold, silver, and platinum product renders
  chrome-hardware: Chrome and polished hardware
  match-a-photo: Matching a metal finish to a photo
---

## Definition

Polished metal is a tinted mirror: a color, full metalness, and no roughness, reflecting its environment, and tone mapping decides how that environment's brights and darks reach the screen.

## Cost lens

Cheap: no textures to download or upload, just the environment. Tone mapping is a few steps of math at the end of each material's shader, and changing it rebuilds those shaders once.
