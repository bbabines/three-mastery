---
id: materials.tone-mapping
name: Tone mapping and exposure
domain: materials
tier: core
prerequisites: [materials.color-spaces]
misconceptions:
  brand-colors: '"Tone mapping leaves brand colors unchanged." ACES and AgX shift hue and saturation; NeutralToneMapping is built to keep product colors close to the source.'
contexts:
  blown-highlights: Blown highlights
  product-colors: Matching product colors
  bright-environments: Bright environments
---

## Definition

Tone mapping squeezes a lit scene's brightness, which can go far past white, into what a screen can show, and exposure brightens or darkens everything just before it.

## Cost lens

A little GPU work for every pixel: three.js adds it to the end of every material's shader when drawing to the canvas. Changing `renderer.toneMapping` rebuilds the shader programs; changing `toneMappingExposure` doesn't.
