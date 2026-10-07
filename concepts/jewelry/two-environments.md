---
id: jewelry.two-environments
name: Two lighting files
domain: jewelry
prerequisites: [materials.environment-maps, materials.tone-mapping, jewelry.pro-file]
misconceptions:
  one-hdr: '"One HDR lights everything."'
  ldr-is-enough: '"A JPG or PNG environment is good enough."'
  background-too: '"The lighting file has to be the background too."'
contexts:
  product-viewer: Lighting a product viewer
  choose-hdr: Choosing HDR files
  brief-artist: Briefing a 3D artist on lighting
  match-reference: Matching a reference viewer
---

## Definition

A jewelry viewer reflects one HDR environment in the metal and a different one in the gems, because metal needs a bright neutral room with dark panels and gems need many small lights far brighter than the room.

## Cost lens

Each environment is downloaded and prefiltered once, and costs GPU memory for its picture and its blurred copy, so a second file roughly doubles that. Drawing costs the same either way: each material still reads one environment.
