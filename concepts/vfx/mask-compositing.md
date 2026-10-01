---
id: vfx.mask-compositing
name: Mask remapping and compositing
domain: vfx
prerequisites: [vfx.sdf, shaders.built-in-functions]
misconceptions:
  multiply-always: '"Multiplying masks is always the right combine." Multiply keeps overlap; max keeps either mask.'
contexts:
  dissolve: Dissolve
  magic: Layered magic effects
  fire: Stylized fire
---

## Definition

Mask compositing changes where an effect appears by remapping one mask and combining it with another through operations such as multiply, max, or subtraction.

## Cost lens

Simple mask arithmetic is cheap beside the noise and textures that produce the masks, but transparent pixels still incur overdraw.
