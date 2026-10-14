---
id: tactile.maps
name: The maps, and checking a download
domain: tactile
prerequisites: [tactile.before-you-light, materials.channel-packing, geometry.tangent-space]
misconceptions:
  scan-is-right: '"A downloaded scan is right as it is."'
  roughness-half-plus-map: '"Set roughness 0.5 and add the map."'
  normal-cant-flip: '"A normal map can''t be upside down."'
contexts:
  fabric-configurator: Fabric and leather options in a furniture configurator
  game-scan: A scanned prop in a game
  material-library: A material bought from an online library
---

## Definition

Each map carries one part of a material (color without light, gloss, surface tilt, crease darkening); roughness and metalness multiply their maps, so they start at 1 and 0 for non-metals, and every download needs checking for baked light, a flipped or broken normal map, and wrong metalness.

## Cost lens

Each map is another texture in memory and another read per pixel; packing roughness, metalness, and AO into one file saves two. Checking a download happens once per file, and saves chasing a lighting problem that's really a bad file.
