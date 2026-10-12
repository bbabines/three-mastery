---
id: product.shadows-grounding
name: Shadows and grounding
domain: product
prerequisites: [product.reflection-design, materials.shadows]
misconceptions:
  resolution-only: '"Higher shadow resolution fixes clipping and detached contact."'
  stale-cache: '"A cached shadow stays correct when a product moves."'
  ao-bounce: '"A dark AO halo supplies bounced illumination."'
  glass-shadow: '"A transmitting material automatically casts physically correct transparent shadows."'
contexts:
  catalog: Grounding catalog products
  turntable: Inspecting contact through an orbit
  moving-parts: Updating adjustable equipment shadows
  tabletop: Showing real product height
---

## Definition

Make support and contact believable with correctly covered, sufficiently resolved shadow data, modest bias, and explicit invalidation when product or light geometry changes.

## Cost lens

Shadow maps render from each light and consume memory. Cached maps avoid updates only while their data remains valid. More resolution increases memory; larger frustums reduce detail at the same resolution.
